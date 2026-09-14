"use client";

import { useEffect, useRef } from "react";
import { Camera, Geometry, Mesh, Program, Renderer } from "ogl";

const DEFAULT_COLORS = ["#3d6caf", "#3d6caf", "#84a8dc", "#b7ff18"];

const VERTEX_SHADER = `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    modelPosition.x += sin(uTime * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    modelPosition.y += sin(uTime * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    modelPosition.z += sin(uTime * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float uTime;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float distanceToCenter = length(uv - vec2(0.5));
    float circle = smoothstep(0.5, 0.18, distanceToCenter);
    float twinkle = 0.72 + 0.28 * sin(uTime * 1.7 + vRandom.y * 6.28);
    vec3 color = vColor + 0.12 * sin(uv.yxx + uTime + vRandom.y * 6.28);
    gl_FragColor = vec4(color, circle * twinkle * 0.78);
  }
`;

type ParticlesProps = {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  pixelRatio?: number;
  className?: string;
};

const hexToRgb = (hex: string) => {
  let value = hex.replace(/^#/, "");
  if (value.length === 3) value = value.split("").map(character => character + character).join("");
  const parsed = Number.parseInt(value.slice(0, 6), 16);
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255];
};

export default function Particles({
  particleCount = 420,
  particleSpread = 12,
  speed = 0.055,
  particleColors = DEFAULT_COLORS,
  moveParticlesOnHover = true,
  particleHoverFactor = 0.22,
  particleBaseSize = 190,
  sizeRandomness = 1.15,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1.35,
  className = "",
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = window.innerWidth < 720 ? Math.min(particleCount, 120) : particleCount;
    const dpr = Math.min(window.devicePixelRatio || 1, pixelRatio);
    const renderer = new Renderer({ dpr, depth: false, alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.setAttribute("aria-hidden", "true");
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouseRef.current = {
        x: (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1,
        y: -((event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1),
      };
    };

    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      let x = 0;
      let y = 0;
      let z = 0;
      let length = 0;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        length = x * x + y * y + z * z;
      } while (length > 1 || length === 0);

      const radius = Math.cbrt(Math.random());
      positions.set([x * radius, y * radius, z * radius], index * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], index * 4);
      colors.set(hexToRgb(particleColors[Math.floor(Math.random() * particleColors.length)]), index * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });
    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * dpr },
        uSizeRandomness: { value: sizeRandomness },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let frame = 0;
    let lastTime = performance.now();
    let elapsed = Math.random() * 1000;
    const update = (time: number) => {
      const delta = Math.min(time - lastTime, 40);
      lastTime = time;
      elapsed += delta * speed;
      program.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover && !reducedMotion) {
        particles.position.x += (-mouseRef.current.x * particleHoverFactor - particles.position.x) * 0.035;
        particles.position.y += (-mouseRef.current.y * particleHoverFactor - particles.position.y) * 0.035;
      }

      if (!disableRotation && !reducedMotion) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.08;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.12;
        particles.rotation.z += 0.006 * speed;
      }

      renderer.render({ scene: particles, camera });
      if (!reducedMotion) frame = requestAnimationFrame(update);
    };

    resize();
    window.addEventListener("resize", resize);
    if (moveParticlesOnHover && !reducedMotion) window.addEventListener("pointermove", handlePointerMove, { passive: true });
    frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      geometry.remove();
      program.remove();
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
    };
  }, [cameraDistance, disableRotation, moveParticlesOnHover, particleBaseSize, particleColors, particleCount, particleHoverFactor, particleSpread, pixelRatio, sizeRandomness, speed]);

  return <div ref={containerRef} className={`particles-container${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}
