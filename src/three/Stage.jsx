import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import Kyphi from './Kyphi.jsx';
import Lights from './Lights.jsx';
import CameraRig from './CameraRig.jsx';
import Atmosphere from './Atmosphere.jsx';
import Incense from './Incense.jsx';

const NIGHT = '#0A0806';
const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;

export default function Stage() {
  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, mobile ? 1.5 : 2]}
        gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
        camera={{ fov: 32, near: 0.05, far: 120, position: [0, 1, 6.2] }}
        // The page text sits over the canvas; listen on the whole app so 3D objects stay clickable.
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        onCreated={(state) => {
          if (import.meta.env.DEV) window.__r3f = state;
        }}
      >
        <color attach="background" args={[NIGHT]} />
        <fogExp2 attach="fog" args={[NIGHT, 0.045]} />

        {/* Reflections only: a warm, mostly dark room so gold and glass have something to mirror. */}
        <Environment resolution={256} frames={1} environmentIntensity={0.55}>
          <Lightformer form="rect" intensity={2.2} color="#ffd9a0" position={[0, 4, 2]} scale={[6, 1.2, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#e77419" position={[-4, 1, -2]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
          <Lightformer form="ring" intensity={1.6} color="#e4cf92" position={[3, 2, 3]} scale={1.5} />
          <Lightformer form="rect" intensity={0.5} color="#41141c" position={[0, -2, -4]} scale={[10, 2, 1]} />
        </Environment>

        <Lights />
        <Suspense fallback={null}>
          <Kyphi />
        </Suspense>
        <Incense />
        <Atmosphere mobile={mobile} />
        <CameraRig />

        <EffectComposer multisampling={mobile ? 0 : 4} enableNormalPass={false}>
          <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.2} intensity={0.85} radius={0.72} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette offset={0.22} darkness={0.82} />
          <Noise opacity={0.045} premultiply />
        </EffectComposer>
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  );
}
