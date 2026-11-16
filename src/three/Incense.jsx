import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Particles } from './Atmosphere.jsx';
import { fx, BRAZIER } from './fx.js';

const FALL = 0.45; // seconds from release to the coals
const DROP_H = 0.8; // metres above the coals
const G = (2 * DROP_H) / (FALL * FALL);
const POOL = 5;

/**
 * The offering: a kyphi pellet falls onto the brazier, the coals flare, a puff of smoke and
 * a spray of sparks climb out of the bowl. Triggered by ignite() from the brazier or the page button.
 */
export default function Incense() {
  const seen = useRef(0);
  const burst = useRef({ impact: -1e9, power: 0, start: 1e9, end: 1e9 + 1 });
  const smoke = useRef();
  const sparks = useRef();
  const pellets = useRef([]);
  const next = useRef(0);

  const pelletMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4a2a12',
        roughness: 0.55,
        emissive: new THREE.Color('#e77419'),
        emissiveIntensity: 0,
      }),
    [],
  );
  const pelletGeo = useMemo(() => new THREE.IcosahedronGeometry(0.032, 1), []);
  const slots = useMemo(() => Array.from({ length: POOL }, () => ({ t0: -1e9, x: 0, z: 0, spin: 0 })), []);

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    const b = burst.current;

    // a new offering since last frame
    if (fx.seq !== seen.current) {
      const n = fx.seq - seen.current;
      seen.current = fx.seq;
      for (let i = 0; i < Math.min(n, POOL); i++) {
        const s = slots[next.current++ % POOL];
        s.t0 = now + i * 0.12;
        s.x = (Math.random() - 0.5) * 0.12;
        s.z = (Math.random() - 0.5) * 0.12;
        s.spin = Math.random() * 6;
      }
      const impact = now + FALL;
      b.power = Math.min(2.2, fx.env + 1);
      b.impact = impact;
      // keep one continuous puff if offerings overlap, otherwise start a new one
      if (now < b.end) b.end = impact + 1.6 + b.power * 0.6;
      else {
        b.start = impact;
        b.end = impact + 1.6 + b.power * 0.6;
      }
    }

    // envelope: sharp attack at impact, slow fall
    const dt = now - b.impact;
    fx.env = dt < 0 ? fx.env * 0.98 : b.power * (1 - Math.exp(-dt * 14)) * Math.exp(-dt / 2.4);
    if (fx.env < 0.001) fx.env = 0;

    for (const u of [smoke.current, sparks.current]) {
      if (!u) continue;
      u.uBurstStart.value = b.start;
      u.uBurstEnd.value = b.end;
    }

    // pellets: fall, glow, melt away
    slots.forEach((s, i) => {
      const m = pellets.current[i];
      if (!m) return;
      const t = now - s.t0;
      if (t < 0 || t > FALL + 2.2) {
        m.visible = false;
        return;
      }
      m.visible = true;
      if (t < FALL) {
        m.position.set(BRAZIER.x + s.x, BRAZIER.y + DROP_H - 0.5 * G * t * t, BRAZIER.z + s.z);
        m.scale.setScalar(1);
      } else {
        const k = (t - FALL) / 2.2;
        m.position.set(BRAZIER.x + s.x, BRAZIER.y - k * 0.02, BRAZIER.z + s.z);
        m.scale.set(1 + k * 0.6, Math.max(0.05, 1 - k), 1 + k * 0.6);
      }
      m.rotation.set(s.spin + t * 3, s.spin * 0.5 + t * 2, 0);
    });
    pelletMat.emissiveIntensity = 0.4 + fx.env * 1.5;
  });

  return (
    <group>
      {slots.map((_, i) => (
        <mesh key={i} ref={(m) => (pellets.current[i] = m)} geometry={pelletGeo} material={pelletMat} visible={false} />
      ))}
      <Particles
        uniformsRef={smoke}
        position={[BRAZIER.x, BRAZIER.y + 0.04, BRAZIER.z]}
        count={220}
        height={3.4}
        radius={0.14}
        speed={0.62}
        spread={6}
        size={0.5}
        grow={3.5}
        color="#e6d8bb"
        opacity={0.15}
      />
      <Particles
        uniformsRef={sparks}
        position={[BRAZIER.x, BRAZIER.y + 0.03, BRAZIER.z]}
        count={110}
        height={2.1}
        radius={0.2}
        speed={1.4}
        spread={2.4}
        size={0.05}
        grow={-0.5}
        color="#ffa040"
        opacity={1}
        soft={0.1}
        additive
      />
    </group>
  );
}
