import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../store.js';

/*
 * What the .blend had as volumetrics (M_VolumetricHaze, M_VolumetricBeam, M_LightTrail_CH3)
 * cannot travel through glTF. They are rebuilt here as GPU particles and a light shaft.
 * All motion runs in the vertex shader: no per-frame CPU work.
 */

const particleVert = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uTime, uHeight, uRadius, uSpeed, uSpread, uSize, uGrow, uPR, uMode;
  uniform float uBurstStart, uBurstEnd;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    vec3 p;
    float life;
    if (uMode < 0.5) {
      // rising: smoke and sparks
      float sp = uSpeed * (0.55 + 0.45 * aSeed.y);
      life = fract(aSeed.x + uTime * sp / uHeight);
      p = vec3((aSeed.z - 0.5) * uRadius, life * uHeight, (aSeed.w - 0.5) * uRadius);
      p.xz *= 1.0 + life * uSpread;
      p.x += sin(uTime * 0.6 + aSeed.y * 30.0 + life * 5.0) * 0.08 * life * uSpread;
      p.z += cos(uTime * 0.45 + aSeed.x * 30.0 + life * 4.0) * 0.08 * life * uSpread;
      vAlpha = smoothstep(0.0, 0.12, life) * (1.0 - smoothstep(0.55, 1.0, life));
      // burst mode: only particles born inside [uBurstStart, uBurstEnd] are visible,
      // so a puff leaves the bowl and climbs instead of the whole column lighting at once
      if (uBurstEnd > 0.0) {
        float born = uTime - life * uHeight / sp;
        vAlpha *= step(uBurstStart, born) * (1.0 - smoothstep(uBurstEnd - 0.6, uBurstEnd, born));
      }
    } else {
      // floating motes in a box
      life = 0.5 + 0.5 * sin(uTime * (0.4 + aSeed.y) + aSeed.x * 40.0);
      p = (aSeed.xzw - 0.5) * vec3(uRadius, uHeight, uRadius);
      p.y += uHeight * 0.5;
      p.x += sin(uTime * 0.13 + aSeed.y * 20.0) * 0.25;
      p.y += sin(uTime * 0.11 + aSeed.z * 20.0) * 0.18;
      p.z += cos(uTime * 0.09 + aSeed.w * 20.0) * 0.25;
      vAlpha = pow(life, 3.0);
    }
    vSeed = aSeed.y;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // particles right in front of the lens fade out instead of filling the frame
    vAlpha *= smoothstep(0.25, 1.1, -mv.z);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(0.0, uSize * (1.0 + life * uGrow) * (0.6 + 0.8 * aSeed.y) * uPR * (220.0 / max(0.05, -mv.z)));
  }
`;

const particleFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity, uSoft;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    // edge0 < edge1 always: a reversed smoothstep is undefined in GLSL and yields NaN on some GPUs,
    // which bloom then smears across the whole frame.
    float a = 1.0 - smoothstep(0.5 * uSoft, 0.5, d);
    a = clamp(a * vAlpha * uOpacity, 0.0, 1.0);
    if (a < 0.003) discard;
    gl_FragColor = vec4(uColor * (0.85 + 0.3 * vSeed), a);
  }
`;

export function Particles({
  uniformsRef,
  position,
  count = 100,
  height = 2,
  radius = 0.2,
  speed = 0.3,
  spread = 3,
  size = 0.2,
  grow = 2,
  color = '#e9dec7',
  opacity = 0.3,
  soft = 0,
  additive = false,
  mode = 'rise',
}) {
  const pr = useThree((s) => s.viewport.dpr);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const seed = new Float32Array(count * 4);
    for (let i = 0; i < seed.length; i++) seed[i] = Math.random();
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, height / 2, 0), Math.max(height, radius * 4));
    return g;
  }, [count, height, radius]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHeight: { value: height },
      uRadius: { value: radius },
      uSpeed: { value: speed },
      uSpread: { value: spread },
      uSize: { value: size },
      uGrow: { value: grow },
      uPR: { value: pr },
      uMode: { value: mode === 'rise' ? 0 : 1 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uSoft: { value: soft },
      uBurstStart: { value: 0 },
      uBurstEnd: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  if (uniformsRef) uniformsRef.current = uniforms;

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uPR.value = pr;
  });

  return (
    <points position={position} geometry={geo} frustumCulled>
      <shaderMaterial
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

const beamVert = /* glsl */ `
  varying float vY;
  varying float vFacing;
  void main() {
    vY = uv.y;
    vec3 n = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = abs(dot(n, normalize(-mv.xyz)));
    gl_Position = projectionMatrix * mv;
  }
`;
const beamFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity, uTime;
  varying float vY;
  varying float vFacing;
  void main() {
    float a = pow(max(vFacing, 0.0001), 2.2) * smoothstep(0.0, 0.35, vY) * (0.75 + 0.25 * sin(uTime * 0.7 + vY * 6.0));
    gl_FragColor = vec4(uColor, a * uOpacity);
  }
`;

function Beam({ position, rotation, height = 6, top = 0.12, bottom = 0.9, color = '#e9d6ae', opacity = 0.11 }) {
  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity }, uTime: { value: 0 } }), [color, opacity]);
  useFrame(({ clock }) => (uniforms.uTime.value = clock.elapsedTime));
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[top, bottom, height, 40, 1, true]} />
      <shaderMaterial
        vertexShader={beamVert}
        fragmentShader={beamFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function Atmosphere({ mobile }) {
  const reduced = useStore((s) => s.reducedMotion);
  const q = mobile || reduced ? 0.5 : 1;
  const n = (c) => Math.round(c * q);
  const group = useRef();

  return (
    <group ref={group}>
      {/* CH1 temple: incense smoke, ember sparks, a shaft from the roof, drifting dust */}
      <Particles position={[0, 0.56, -0.4]} count={n(140)} height={3.2} radius={0.16} speed={0.32} spread={5} size={0.55} grow={3.5} color="#d8c9ad" opacity={0.085} />
      <Particles position={[0, 0.56, -0.4]} count={n(60)} height={1.8} radius={0.22} speed={0.55} spread={1.5} size={0.045} grow={-0.4} color="#ff8a2a" opacity={0.95} soft={0.1} additive />
      <Beam position={[-0.55, 3.1, -1.9]} rotation={[0.42, 0, -0.18]} height={6.4} />
      <Particles mode="float" position={[0, 0, -2.4]} count={n(160)} height={4} radius={4.5} size={0.035} color="#e9dec7" opacity={0.55} additive />

      {/* CH2 ingredients: gold dust around the orb */}
      <Particles mode="float" position={[16, 0.2, 0]} count={n(110)} height={2.2} radius={2.4} size={0.03} color="#e4cf92" opacity={0.7} additive />

      {/* CH3 ritual: the light trail becomes a slow rise of gold motes from the bowl */}
      <Particles position={[32.1, 0.26, 0]} count={n(50)} height={1.3} radius={0.3} speed={0.14} spread={1.2} size={0.03} grow={0} color="#ffc54a" opacity={0.8} additive />
      <Particles mode="float" position={[32, 0, 0]} count={n(70)} height={1.8} radius={2.4} size={0.025} color="#e9dec7" opacity={0.4} additive />

      {/* CH4 vessel: museum dust in the key light */}
      <Particles mode="float" position={[48, 0, 0]} count={n(120)} height={3} radius={3.4} size={0.035} color="#efe3c8" opacity={0.55} additive />

      {/* CH5 perfume: a fine warm haze around the bottle */}
      <Particles mode="float" position={[64, 0, 0]} count={n(80)} height={1.6} radius={1.8} size={0.025} color="#e4cf92" opacity={0.5} additive />
    </group>
  );
}
