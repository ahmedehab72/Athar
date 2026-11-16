import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useStore } from '../store.js';
import { INGREDIENTS } from '../data/content.js';
import { fx, ignite } from './fx.js';

const URL = '/models/kyphi.glb';
const ING_CENTER = new THREE.Vector3(16, 0, 0);

/** ING_Cinnamon_02 → "Cinnamon", ING_Center_AmberOrb → "Center_AmberOrb" */
const ingType = (name) => name.replace(/^ING_/, '').replace(/_\d+$/, '');
const meshToIngredient = Object.fromEntries(INGREDIENTS.filter((i) => i.mesh).map((i) => [i.mesh, i.id]));
export const ingredientIdForMesh = (name) => {
  const t = ingType(name);
  return meshToIngredient[t] ?? t; // extras (Cinnamon, Center_AmberOrb) keep their type as id
};

export default function Kyphi() {
  const { scene } = useGLTF(URL);
  const setReady = useStore((s) => s.setReady);
  const setActiveIng = useStore((s) => s.setActiveIng);
  const gl = useThree((s) => s.gl);

  const rig = useMemo(() => {
    const meshes = [];
    scene.traverse((o) => o.isMesh && meshes.push(o));

    const embers = [];
    const orbiters = [];
    const ing = [];
    const vessel = new THREE.Group();
    const bottle = new THREE.Group();
    vessel.position.set(48, 0, 0);
    bottle.position.set(64, 0, 0);
    scene.add(vessel, bottle);

    for (const m of meshes) {
      const mat = m.material;
      const name = mat?.name ?? '';
      m.castShadow = m.receiveShadow = false;

      if (name.includes('GlowingEmbers')) {
        mat.emissiveIntensity = 3.2;
        mat.toneMapped = true;
        embers.push(mat);
      }
      if (name.includes('PerfumeGlass')) {
        m.material = new THREE.MeshPhysicalMaterial({
          name,
          color: '#fff7ea',
          metalness: 0,
          roughness: 0.035,
          transmission: 1,
          thickness: 0.22,
          ior: 1.5,
          envMapIntensity: 1.6,
          specularIntensity: 1,
          clearcoat: 0.6,
          clearcoatRoughness: 0.05,
        });
      }
      if (name.startsWith('M_Gold') || name.includes('MatteGold')) mat.envMapIntensity = 1.8;
      if (name.includes('GlossyDisc')) mat.envMapIntensity = 1.4;
      if (name.includes('AmberLiquid') || name.includes('AmberPaste')) mat.emissiveIntensity = Math.min(mat.emissiveIntensity, 0.5);

      if (m.name.startsWith('ING_')) {
        m.userData.ing = ingredientIdForMesh(m.name);
        m.userData.baseScale = m.scale.clone();
        m.userData.mat = m.material;
        ing.push(m);
        if (!m.name.includes('Center') && !m.name.includes('Halo')) {
          const d = new THREE.Vector3(m.position.x - ING_CENTER.x, 0, m.position.z - ING_CENTER.z);
          orbiters.push({ mesh: m, radius: d.length(), angle: Math.atan2(d.z, d.x), baseY: m.position.y, speed: 0.12 + Math.random() * 0.1, phase: Math.random() * 6.28 });
        }
      }
    }

    // Group the bottle and the vessel so they can turn on their own axis.
    for (const m of meshes) {
      if (/^CH4_(Alabaster|Vessel|Lid)/.test(m.name)) vessel.attach(m);
      if (/^CH5_(Perfume|MatteGold|Plaque|Cap)/.test(m.name)) bottle.attach(m);
    }

    // The .blend has three pairs of columns, all in front of the brazier. For the 360° look-around
    // the hall becomes a hypostyle: four rows of columns running past the brazier on both sides.
    const parts = ['Base', 'Shaft', 'Capital'].map((p) => scene.getObjectByName(`CH1_Column_L1_${p}`)).filter(Boolean);
    if (parts.length === 3) {
      const src = parts[1].position; // L1 shaft: x -1.5, z -1.2
      const taken = new Set(['-1.5,-1.2', '-1.5,-3', '-1.5,-4.8', '1.5,-1.2', '1.5,-3', '1.5,-4.8']);
      const hall = new THREE.Group();
      hall.name = 'CH1_HypostyleExtension';
      for (const x of [-4.2, -1.5, 1.5, 4.2]) {
        for (const z of [4.0, 2.2, 0.4, -1.2, -3.0, -4.8, -6.6]) {
          if (taken.has(`${x},${z}`)) continue;
          for (const p of parts) {
            const c = p.clone();
            c.position.set(p.position.x + (x - src.x), p.position.y, p.position.z + (z - src.z));
            hall.add(c);
          }
        }
      }
      scene.add(hall);
    }

    const brazier = meshes.filter((m) => /^CH1_(Brazier|CoalLump)/.test(m.name));
    for (const m of brazier) m.userData.brazier = true;

    // Every ingredient gets its own material copy so it can be lit alone.
    for (const m of ing) {
      m.material = m.material.clone();
      m.userData.baseEmissive = m.material.emissive.clone();
      m.userData.baseEmissiveIntensity = m.material.emissiveIntensity;
    }

    return { embers, orbiters, ing, vessel, bottle };
  }, [scene]);

  // Compile everything up front so the first flight does not stutter.
  useEffect(() => {
    let raf = 0;
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => setReady());
    });
    return () => cancelAnimationFrame(raf);
  }, [gl, setReady]);

  const highlight = useRef(new THREE.Color('#ffcf7a'));

  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = clock.elapsedTime;
    const { chapter: route, activeIng } = useStore.getState();

    for (const mat of rig.embers) {
      mat.emissiveIntensity = (3.0 + Math.sin(t * 7.1) * 0.35 + Math.sin(t * 17.3) * 0.25) * (1 + fx.env * 1.6);
    }

    const slow = route === 'ingredients' && activeIng ? 0.35 : 1;
    for (const o of rig.orbiters) {
      o.angle += o.speed * dt * 0.5 * slow;
      o.mesh.position.x = ING_CENTER.x + Math.cos(o.angle) * o.radius;
      o.mesh.position.z = ING_CENTER.z + Math.sin(o.angle) * o.radius;
      o.mesh.position.y = o.baseY + Math.sin(t * 1.4 + o.phase) * 0.03;
      o.mesh.rotation.y += dt * 0.35;
      o.mesh.rotation.x += dt * 0.12;
    }

    for (const m of rig.ing) {
      const on = activeIng && m.userData.ing === activeIng;
      const dim = activeIng && !on;
      const s = on ? 1.45 : dim ? 0.9 : 1;
      m.scale.lerp(new THREE.Vector3().copy(m.userData.baseScale).multiplyScalar(s), 1 - Math.exp(-dt * 8));
      const mat = m.material;
      if (on) {
        mat.emissive.lerp(highlight.current, 1 - Math.exp(-dt * 6));
        mat.emissiveIntensity += (0.9 - mat.emissiveIntensity) * (1 - Math.exp(-dt * 6));
      } else {
        mat.emissive.lerp(m.userData.baseEmissive, 1 - Math.exp(-dt * 6));
        mat.emissiveIntensity += (m.userData.baseEmissiveIntensity - mat.emissiveIntensity) * (1 - Math.exp(-dt * 6));
      }
    }

    rig.vessel.rotation.y += dt * (route === 'vessel' ? 0.16 : 0.05);
    // a slow sway; on the perfume page the visitor turns it, so the sway stays small
    rig.bottle.rotation.y = Math.sin(t * 0.22) * (route === 'perfume' ? 0.18 : 0.25);
  });

  const overUI = (e) => !!e.nativeEvent?.target?.closest?.('a, button, input, textarea, label, .plate, .masthead, .axis, .menu, .orbit-hint');

  const onOver = (e) => {
    const route = useStore.getState().chapter;
    if (overUI(e)) return;
    if (route === 'story' && e.object.userData.brazier) {
      e.stopPropagation();
      document.documentElement.classList.add('over-brazier');
      return;
    }
    if (route !== 'ingredients') return;
    const id = e.object.userData.ing;
    if (!id) return;
    e.stopPropagation();
    setActiveIng(id);
    document.body.style.cursor = 'pointer';
  };
  const onOut = (e) => {
    if (e.object.userData.brazier) document.documentElement.classList.remove('over-brazier');
    if (!e.object.userData.ing) return;
    document.body.style.cursor = '';
  };
  const onClick = (e) => {
    if (useStore.getState().chapter !== 'story' || !e.object.userData.brazier) return;
    if (e.delta > 6 || overUI(e)) return; // a drag, or a click meant for the page
    e.stopPropagation();
    ignite();
  };

  return <primitive object={scene} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick} />;
}

useGLTF.preload(URL);
