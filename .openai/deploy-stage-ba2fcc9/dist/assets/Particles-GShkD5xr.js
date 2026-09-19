import{n as e,r as t,t as n}from"./index-DiYPXpix.js";var r=t(),i=e(),a=[`#6f9fff`,`#8ab6ff`,`#b7d4ff`,`#caff55`],o=`
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
`,s=`
  precision highp float;

  uniform float uTime;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float distanceToCenter = length(uv - vec2(0.5));
    float circle = smoothstep(0.5, 0.18, distanceToCenter);
    float twinkle = 0.8 + 0.2 * sin(uTime * 1.7 + vRandom.y * 6.28);
    vec3 shimmer = 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28);
    vec3 color = min(vColor * 1.22 + shimmer, vec3(1.0));
    gl_FragColor = vec4(color, circle * twinkle * 0.98);
  }
`,c=e=>{let t=e.replace(/^#/,``);t.length===3&&(t=t.split(``).map(e=>e+e).join(``));let n=Number.parseInt(t.slice(0,6),16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]};function l({particleCount:e=760,particleSpread:t=12,speed:l=.055,particleColors:u=a,moveParticlesOnHover:d=!0,particleHoverFactor:f=.22,particleBaseSize:p=235,sizeRandomness:m=1.15,cameraDistance:h=20,disableRotation:g=!1,pixelRatio:_=1.35,className:v=``}){let y=(0,r.useRef)(null),b=(0,r.useRef)({x:0,y:0});return(0,r.useEffect)(()=>{let r=y.current;if(!r)return;let i=!1,a=!1,v=!1,x,S=async()=>{if(i||a)return;a=!0;let{Camera:y,Geometry:S,Mesh:C,Program:w,Renderer:T}=await n(async()=>{let{Camera:e,Geometry:t,Mesh:n,Program:r,Renderer:i}=await import(`./src-CAYA9N7R.js`);return{Camera:e,Geometry:t,Mesh:n,Program:r,Renderer:i}},[]);if(i)return;let E=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,D=window.innerWidth<720,O=D?Math.min(e,220):e,k=D?1e3/30:1e3/45,A=Math.min(window.devicePixelRatio||1,_),j=new T({dpr:A,depth:!1,alpha:!0}),M=j.gl;M.clearColor(0,0,0,0),M.canvas.setAttribute(`aria-hidden`,`true`),r.appendChild(M.canvas);let N=new y(M,{fov:15});N.position.set(0,0,h);let P=()=>{let e=Math.max(r.clientWidth,1),t=Math.max(r.clientHeight,1);j.setSize(e,t),N.perspective({aspect:M.canvas.width/M.canvas.height})},F=e=>{b.current={x:e.clientX/Math.max(window.innerWidth,1)*2-1,y:-(e.clientY/Math.max(window.innerHeight,1)*2-1)}},I=new Float32Array(O*3),L=new Float32Array(O*4),R=new Float32Array(O*3);for(let e=0;e<O;e+=1){let t=0,n=0,r=0,i=0;do t=Math.random()*2-1,n=Math.random()*2-1,r=Math.random()*2-1,i=t*t+n*n+r*r;while(i>1||i===0);let a=Math.cbrt(Math.random());I.set([t*a,n*a,r*a],e*3),L.set([Math.random(),Math.random(),Math.random(),Math.random()],e*4),R.set(c(u[Math.floor(Math.random()*u.length)]),e*3)}let z=new S(M,{position:{size:3,data:I},random:{size:4,data:L},color:{size:3,data:R}}),B=new w(M,{vertex:o,fragment:s,uniforms:{uTime:{value:0},uSpread:{value:t},uBaseSize:{value:p*A},uSizeRandomness:{value:m}},transparent:!0,depthTest:!1,depthWrite:!1}),V=new C(M,{mode:M.POINTS,geometry:z,program:B}),H=0,U=0,W=Math.random()*1e3,G=e=>{if(i||(H=requestAnimationFrame(G),!v||document.hidden||e-U<k))return;let t=Math.min(e-(U||e),45);U=e,W+=t*l,B.uniforms.uTime.value=W*.001,d&&!E&&(V.position.x+=(-b.current.x*f-V.position.x)*.035,V.position.y+=(-b.current.y*f-V.position.y)*.035),!g&&!E&&(V.rotation.x=Math.sin(W*2e-4)*.08,V.rotation.y=Math.cos(W*5e-4)*.12,V.rotation.z+=.006*l),j.render({scene:V,camera:N}),E&&cancelAnimationFrame(H)},K=new ResizeObserver(P);K.observe(r),d&&!E&&window.addEventListener(`pointermove`,F,{passive:!0}),P(),H=requestAnimationFrame(G),x=()=>{cancelAnimationFrame(H),K.disconnect(),window.removeEventListener(`pointermove`,F),z.remove(),B.remove(),r.contains(M.canvas)&&r.removeChild(M.canvas)}},C=new IntersectionObserver(e=>{v=e.some(e=>e.isIntersecting),v&&S()},{threshold:.01});return C.observe(r),()=>{i=!0,C.disconnect(),x?.()}},[h,g,d,p,u,e,f,t,_,m,l]),(0,i.jsx)(`div`,{ref:y,className:`particles-container${v?` ${v}`:``}`,"aria-hidden":`true`})}export{l as default};