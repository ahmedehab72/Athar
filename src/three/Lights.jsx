import { useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { fx } from './fx.js';

/**
 * kyphi.blend ships without lights; this is the lighting rebuilt per vitrine.
 * All lights stay mounted (toggling visibility recompiles shaders), each one is local.
 */
function Spot({ target, ...props }) {
  const ref = useRef();
  useLayoutEffect(() => {
    ref.current.target.position.set(...target);
    ref.current.target.updateMatrixWorld();
  }, [target]);
  return <spotLight ref={ref} decay={2} penumbra={0.85} {...props} />;
}

export default function Lights() {
  const brazier = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (brazier.current) {
      const flicker = Math.sin(t * 9.3) * 2.2 + Math.sin(t * 23.1) * 1.4 + Math.sin(t * 3.1) * 1.5;
      brazier.current.intensity = (16 + flicker) * (1 + fx.env * 1.4);
    }
  });

  return (
    <>
      <hemisphereLight args={['#4a3620', '#060504', 1.1]} />

      {/* CH1 temple: ember glow, a shaft from the roof onto the brazier, torchlight down the hall */}
      <pointLight ref={brazier} position={[0, 0.72, -0.4]} color="#ff7a1c" distance={12} decay={1.4} />
      <Spot position={[-1.2, 6.5, -3.6]} target={[0, 0, -0.6]} angle={0.32} intensity={260} color="#d9c49a" distance={16} />
      <Spot position={[0, 3.6, 4.8]} target={[0, 1.4, -3]} angle={0.6} intensity={90} color="#ffcf98" distance={18} />
      <pointLight position={[-2.6, 2.8, -2.2]} color="#e08a1e" intensity={14} distance={7} decay={1.5} />
      <pointLight position={[2.6, 2.8, -2.2]} color="#e08a1e" intensity={14} distance={7} decay={1.5} />
      <pointLight position={[0, 2.6, -7.5]} color="#ff9a3c" intensity={30} distance={11} decay={1.5} />

      {/* CH2 ingredients: halo from above, the orb lit from within */}
      <Spot position={[17.6, 3.6, 3.0]} target={[16, 1.15, 0]} angle={0.42} intensity={42} color="#ffe0b4" distance={10} />
      <Spot position={[14.2, 2.2, -2.4]} target={[16, 1.2, 0]} angle={0.5} intensity={30} color="#e4cf92" distance={9} />
      <pointLight position={[16, 0.62, 0.35]} color="#ffa524" intensity={1.8} distance={2.4} decay={1.6} />

      {/* CH3 ritual: tabletop key */}
      <Spot position={[32.9, 2.7, 1.6]} target={[32, 0.2, 0]} angle={0.42} intensity={9} color="#ffdcae" distance={8} />
      <Spot position={[30.9, 1.4, -1.6]} target={[32, 0.2, 0]} angle={0.5} intensity={7} color="#e4cf92" distance={6} />
      <pointLight position={[32.1, 0.5, 0]} color="#e08a1e" intensity={0.35} distance={1.2} decay={1.6} />

      {/* CH4 vessel: museum key from the left, gold rim from behind */}
      <Spot position={[46.3, 3.6, 2.8]} target={[48, 1.1, 0]} angle={0.36} intensity={60} color="#ffe6c4" distance={10} />
      <Spot position={[49.8, 2.4, -2.2]} target={[48, 1.2, 0]} angle={0.45} intensity={40} color="#e4cf92" distance={8} />

      {/* CH5 perfume: soft key, gold rim, amber backlight through the glass */}
      <Spot position={[62.9, 1.9, 1.9]} target={[64, 0.35, 0]} angle={0.42} intensity={20} color="#fff0dc" distance={7} />
      <Spot position={[65.0, 1.3, -1.6]} target={[64, 0.4, 0]} angle={0.5} intensity={24} color="#e4cf92" distance={6} />
      <pointLight position={[64, 0.34, -0.28]} color="#e08a1e" intensity={0.9} distance={1.2} decay={1.6} />
    </>
  );
}
