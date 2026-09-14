"use client";

import { useEffect, useRef } from "react";

const TRAIL_POINTS = 34;
const SPARK_DURATION = 520;

type Point = { x: number; y: number };
type Spark = Point & { angle: number; startTime: number; accent: boolean };

export default function CursorEffects() {
  const glowCanvasRef = useRef<HTMLCanvasElement>(null);
  const sparkCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const glowCanvas = glowCanvasRef.current;
    const sparkCanvas = sparkCanvasRef.current;
    if (!glowCanvas || !sparkCanvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    if (reducedMotion.matches) return;

    const glowContext = glowCanvas.getContext("2d");
    const sparkContext = sparkCanvas.getContext("2d");
    if (!glowContext || !sparkContext) return;

    const sparks: Spark[] = [];
    const points = Array.from({ length: TRAIL_POINTS }, () => ({ x: 0, y: 0 }));
    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };
    let initialized = false;
    let pointerInside = true;
    let lastInputTime = performance.now();
    let lastFrameTime = performance.now();
    let fade = 0;
    let glowFrame = 0;
    let sparkFrame = 0;
    let destroyed = false;

    const sizeCanvas = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, maxDpr: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeCanvases = () => {
      sizeCanvas(glowCanvas, glowContext, 1.5);
      sizeCanvas(sparkCanvas, sparkContext, 2);
    };

    const drawSparks = (now: number) => {
      sparkContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparkContext.globalCompositeOperation = "lighter";

      for (let index = sparks.length - 1; index >= 0; index -= 1) {
        const spark = sparks[index];
        const progress = (now - spark.startTime) / SPARK_DURATION;
        if (progress >= 1) {
          sparks.splice(index, 1);
          continue;
        }

        const eased = progress * (2 - progress);
        const distance = eased * 46;
        const lineLength = 19 * (1 - eased);
        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        sparkContext.globalAlpha = Math.max(0, 1 - progress);
        sparkContext.strokeStyle = spark.accent ? "#ffffff" : "#b7ff18";
        sparkContext.shadowColor = spark.accent ? "#88aaff" : "#b7ff18";
        sparkContext.shadowBlur = 8 * (1 - progress);
        sparkContext.lineWidth = spark.accent ? 1.25 : 2;
        sparkContext.lineCap = "round";
        sparkContext.beginPath();
        sparkContext.moveTo(x1, y1);
        sparkContext.lineTo(x2, y2);
        sparkContext.stroke();
      }

      sparkContext.globalAlpha = 1;
      sparkContext.shadowBlur = 0;
      sparkFrame = sparks.length ? requestAnimationFrame(drawSparks) : 0;
    };

    const createSparks = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const now = performance.now();
      const count = finePointer.matches ? 14 : 10;
      const angleOffset = Math.random() * Math.PI;

      for (let index = 0; index < count; index += 1) {
        sparks.push({
          x: event.clientX,
          y: event.clientY,
          angle: angleOffset + (Math.PI * 2 * index) / count,
          startTime: now,
          accent: index % 4 === 0,
        });
      }

      if (!sparkFrame) sparkFrame = requestAnimationFrame(drawSparks);
    };

    const drawGlow = (now: number) => {
      if (destroyed) return;
      const delta = Math.min((now - lastFrameTime) / 16.667, 3);
      lastFrameTime = now;
      const shouldFade = !pointerInside || now - lastInputTime > 650;
      const fadeTarget = initialized && !shouldFade ? 1 : 0;
      fade += (fadeTarget - fade) * Math.min(1, delta * 0.085);

      if (initialized) {
        const headEase = 1 - Math.pow(1 - 0.42, delta);
        const chainEase = 1 - Math.pow(1 - 0.34, delta);
        head.x += (target.x - head.x) * headEase;
        head.y += (target.y - head.y) * headEase;
        points[0].x = head.x;
        points[0].y = head.y;

        for (let index = 1; index < points.length; index += 1) {
          points[index].x += (points[index - 1].x - points[index].x) * chainEase;
          points[index].y += (points[index - 1].y - points[index].y) * chainEase;
        }
      }

      glowContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
      glowContext.globalCompositeOperation = "lighter";
      glowContext.lineCap = "round";

      for (let index = points.length - 2; index >= 0; index -= 1) {
        const strength = 1 - index / (points.length - 1);
        const alpha = Math.pow(strength, 1.2) * 0.48 * fade;
        const red = Math.round(68 + (183 - 68) * strength);
        const green = Math.round(87 + (255 - 87) * strength);
        const blue = Math.round(239 + (24 - 239) * strength);

        glowContext.globalAlpha = alpha;
        glowContext.strokeStyle = `rgb(${red} ${green} ${blue})`;
        glowContext.shadowColor = `rgb(${red} ${green} ${blue})`;
        glowContext.shadowBlur = 8 + strength * 15;
        glowContext.lineWidth = 1 + strength * 7;
        glowContext.beginPath();
        glowContext.moveTo(points[index + 1].x, points[index + 1].y);
        glowContext.lineTo(points[index].x, points[index].y);
        glowContext.stroke();
      }

      if (initialized) {
        const halo = glowContext.createRadialGradient(head.x, head.y, 0, head.x, head.y, 18);
        halo.addColorStop(0, `rgba(255, 255, 255, ${0.95 * fade})`);
        halo.addColorStop(0.18, `rgba(183, 255, 24, ${0.82 * fade})`);
        halo.addColorStop(1, "rgba(183, 255, 24, 0)");
        glowContext.globalAlpha = 1;
        glowContext.shadowBlur = 0;
        glowContext.fillStyle = halo;
        glowContext.beginPath();
        glowContext.arc(head.x, head.y, 18, 0, Math.PI * 2);
        glowContext.fill();
      }

      glowContext.globalAlpha = 1;
      glowContext.shadowBlur = 0;
      if (fade > 0.002 || !shouldFade) {
        glowFrame = requestAnimationFrame(drawGlow);
      } else {
        glowFrame = 0;
      }
    };

    const startGlow = () => {
      if (!glowFrame) {
        lastFrameTime = performance.now();
        glowFrame = requestAnimationFrame(drawGlow);
      }
    };

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (!initialized) {
        head.x = event.clientX;
        head.y = event.clientY;
        target.x = event.clientX;
        target.y = event.clientY;
        for (const point of points) {
          point.x = event.clientX;
          point.y = event.clientY;
        }
        initialized = true;
        fade = 1;
      }

      target.x = event.clientX;
      target.y = event.clientY;
      pointerInside = true;
      lastInputTime = performance.now();
      startGlow();
    };

    const fadeGlow = () => {
      pointerInside = false;
      lastInputTime = performance.now();
      startGlow();
    };

    resizeCanvases();
    window.addEventListener("resize", resizeCanvases);
    window.addEventListener("pointerdown", createSparks, { passive: true });

    const enableGlow = finePointer.matches || !("ontouchstart" in window);
    if (enableGlow) {
      window.addEventListener("pointermove", updatePointer, { passive: true });
      document.documentElement.addEventListener("mouseleave", fadeGlow);
      window.addEventListener("blur", fadeGlow);
    }

    return () => {
      destroyed = true;
      cancelAnimationFrame(glowFrame);
      cancelAnimationFrame(sparkFrame);
      window.removeEventListener("resize", resizeCanvases);
      window.removeEventListener("pointerdown", createSparks);
      window.removeEventListener("pointermove", updatePointer);
      document.documentElement.removeEventListener("mouseleave", fadeGlow);
      window.removeEventListener("blur", fadeGlow);
    };
  }, []);

  return (
    <div className="cursor-effects" aria-hidden="true">
      <canvas ref={glowCanvasRef} className="cursor-effects__glow" />
      <canvas ref={sparkCanvasRef} className="cursor-effects__sparks" />
    </div>
  );
}
