import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useStore } from '../store.js';
import { SHOTS, ORBITS, AXIS_LENGTH } from '../data/shots.js';

const v3 = (a) => new THREE.Vector3(...a);
const PIVOT = new THREE.Vector3();
const TMP = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const SPH = new THREE.Spherical();
const FRAME_X = { left: -0.17, center: 0, right: 0.17 };
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Float index of the [data-shot] section crossing the middle of the viewport. */
function readShotPosition() {
  const els = document.querySelectorAll('#main [data-shot]');
  if (!els.length) return 0;
  const mid = window.innerHeight / 2;
  let prev = null;
  for (let i = 0; i < els.length; i++) {
    const r = els[i].getBoundingClientRect();
    const c = r.top + r.height / 2;
    if (mid < c) {
      if (prev === null) return 0;
      return i - 1 + (mid - prev) / (c - prev);
    }
    prev = c;
  }
  return els.length - 1;
}

function samplePath(keys, pos, out) {
  const n = keys.length;
  const p = Math.min(n - 1, Math.max(0, pos));
  const i = Math.min(n - 2, Math.floor(p));
  if (n === 1) {
    const a = keys[0];
    out.cam.set(...a.cam);
    out.look.set(...a.look);
    out.fov = a.fov;
    out.fx = FRAME_X[a.frame];
    return out;
  }
  // hold on each shot while its text is read, travel in between
  const f = smooth(0.12, 0.88, p - i);
  const a = keys[i];
  const b = keys[i + 1];
  out.cam.set(...a.cam).lerp(v3(b.cam), f);
  out.look.set(...a.look).lerp(v3(b.look), f);
  out.fov = THREE.MathUtils.lerp(a.fov, b.fov, f);
  out.fx = THREE.MathUtils.lerp(FRAME_X[a.frame], FRAME_X[b.frame], f);
  return out;
}

const newPose = () => ({ cam: new THREE.Vector3(), look: new THREE.Vector3(), fov: 30, fx: 0 });
const copyPose = (to, from) => {
  to.cam.copy(from.cam);
  to.look.copy(from.look);
  to.fov = from.fov;
  to.fx = from.fx;
  return to;
};

/** Keep roughly the horizontal framing Blender had at 16:9 on narrow screens. */
function fitFov(fov, aspect) {
  const ref = 16 / 9;
  if (aspect >= ref) return fov;
  const h = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(fov) / 2) * ref);
  const keep = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(h / 2) / aspect));
  return Math.min(70, fov + (keep - fov) * 0.72);
}

export default function CameraRig() {
  const { camera, size } = useThree();
  const route = useStore((s) => s.route);
  const reduced = useStore((s) => s.reducedMotion);

  const pose = useRef(null);
  const goal = useRef(newPose());
  const from = useRef(newPose());
  const flight = useRef({ active: false, t: 1 });
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const axisEl = useRef(null);
  const orbit = useRef({ yaw: 0, pitch: 0, vYaw: 0, vPitch: 0, dragging: false, x: 0, y: 0, anchor: 0, returning: false, target: 0 });
  const applied = useRef({ cam: new THREE.Vector3(), look: new THREE.Vector3() });
  const setOrbitUsed = useStore((s) => s.setOrbitUsed);

  const setChapter = useStore((s) => s.setChapter);
  const canOrbit = useStore((s) => s.route === 'journey' && !!ORBITS[s.chapter]);

  useEffect(() => {
    document.documentElement.classList.toggle('can-orbit', canOrbit && !reduced);
  }, [canOrbit, reduced]);

  // Drag (mouse) or horizontal swipe (touch) to walk around the pivot of the current chapter.
  useEffect(() => {
    if (reduced) return undefined;
    const html = document.documentElement;
    const o = orbit.current;
    const blocked = (t) =>
      t?.closest?.('a, button, input, textarea, select, label, .plate, .ing, .masthead, .axis, .menu, .orbit-hint');

    const down = (e) => {
      const { route: r, chapter } = useStore.getState();
      const cfg = r === 'journey' ? ORBITS[chapter] : null;
      if (!cfg || e.button > 0 || blocked(e.target)) return;
      if (o.cfg && o.cfg !== cfg && (o.yaw || o.pitch)) return; // still gliding home from another chapter
      if (e.pointerType === 'mouse') e.preventDefault(); // no text selection while turning
      o.cfg = cfg;
      o.dragging = true;
      o.x = e.clientX;
      o.y = e.clientY;
      o.vYaw = o.vPitch = 0;
      o.returning = false;
      o.type = e.pointerType;
      html.classList.add('is-orbiting');
    };
    const move = (e) => {
      if (!o.dragging) return;
      const dx = e.clientX - o.x;
      const dy = e.clientY - o.y;
      o.x = e.clientX;
      o.y = e.clientY;
      const k = (Math.PI * 2.2) / Math.max(700, window.innerWidth);
      o.vYaw = -dx * k;
      o.yaw += o.vYaw;
      if (o.type === 'mouse') {
        o.vPitch = dy * k * 0.6;
        o.pitch = THREE.MathUtils.clamp(o.pitch + o.vPitch, -0.6, 0.7);
      }
      if (Math.abs(dx) > 3) setOrbitUsed();
    };
    const up = () => {
      if (!o.dragging) return;
      o.dragging = false;
      o.anchor = readShotPosition();
      html.classList.remove('is-orbiting');
    };

    window.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      html.classList.remove('is-orbiting');
    };
  }, [reduced, setOrbitUsed]);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    axisEl.current = document.documentElement;
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // A route change is a camera move along the processional axis.
  useEffect(() => {
    if (!pose.current) return undefined;
    // leave from wherever the visitor is actually looking, then drop the orbit offset
    copyPose(from.current, pose.current);
    from.current.cam.copy(applied.current.cam);
    from.current.look.copy(applied.current.look);
    copyPose(pose.current, from.current);
    Object.assign(orbit.current, { yaw: 0, pitch: 0, vYaw: 0, vPitch: 0, returning: false, dragging: false, cfg: null });
    const entry = useStore.getState().entryShot;
    const keys = SHOTS[route];
    const dist = Math.abs(keys[Math.min(entry, keys.length - 1)].cam[0] - pose.current.cam.x);
    const obj = { t: 0 };
    flight.current = { active: true, t: 0, dist };
    document.documentElement.classList.add('is-flying');
    const tween = gsap.to(obj, {
      t: 1,
      duration: reduced ? 0.01 : 1.8 + Math.min(1.4, dist / 40),
      ease: 'power2.inOut',
      onUpdate: () => (flight.current.t = obj.t),
      onComplete: () => {
        flight.current.active = false;
        document.documentElement.classList.remove('is-flying');
      },
    });
    return () => {
      tween.kill();
      document.documentElement.classList.remove('is-flying');
    };
  }, [route, reduced]);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const keys = SHOTS[route];
    const fl = flight.current;

    if (fl.active) {
      samplePath(keys, useStore.getState().entryShot, goal.current);
      const t = fl.t;
      const lift = Math.sin(Math.PI * t);
      const span = Math.min(1, fl.dist / 16);
      const g = goal.current;
      const f = from.current;
      g.cam.lerpVectors(f.cam, g.cam, t);
      g.look.lerpVectors(f.look, g.look, t);
      g.fov = THREE.MathUtils.lerp(f.fov, g.fov, t);
      g.fx = THREE.MathUtils.lerp(f.fx, g.fx, t);
      // rise and pull back mid-flight, as if stepping back to see the next room
      g.cam.y += lift * 0.9 * span;
      g.cam.z += lift * 3.5 * span;
      g.fov += lift * 6 * span;
    }
    const shotPos = fl.active ? useStore.getState().entryShot : readShotPosition();
    if (!fl.active) {
      samplePath(keys, shotPos, goal.current);
      // which chapter the camera is in now drives the URL, the title, orbit and hover
      const here = keys[Math.min(keys.length - 1, Math.max(0, Math.round(shotPos)))]?.chapter;
      if (here && here !== useStore.getState().chapter) setChapter(here);
    }

    if (!pose.current) {
      pose.current = copyPose(newPose(), goal.current);
    } else if (fl.active) {
      copyPose(pose.current, goal.current);
    } else {
      const k = 1 - Math.exp(-dt * (reduced ? 30 : 3.2));
      pose.current.cam.lerp(goal.current.cam, k);
      pose.current.look.lerp(goal.current.look, k);
      pose.current.fov += (goal.current.fov - pose.current.fov) * k;
      pose.current.fx += (goal.current.fx - pose.current.fx) * k;
    }

    // a breath of parallax from the pointer
    const p = pointer.current;
    const pk = 1 - Math.exp(-dt * 2);
    p.sx += (p.x - p.sx) * pk;
    p.sy += (p.y - p.sy) * pk;
    const par = reduced ? 0 : 0.05;

    const P = pose.current;
    const cam = applied.current.cam.copy(P.cam);
    const look = applied.current.look.copy(P.look);

    // orbit: inertia after release, glide home once the visitor scrolls on
    const o = orbit.current;
    const cfg = o.cfg;
    if (cfg && !fl.active) {
      if (!o.dragging) {
        const fr = Math.exp(-dt * 3.5);
        o.yaw += o.vYaw;
        o.pitch = THREE.MathUtils.clamp(o.pitch + o.vPitch, -0.6, 0.7);
        o.vYaw *= fr;
        o.vPitch *= fr;
        const moved = Math.abs(o.yaw) > 1e-4 || Math.abs(o.pitch) > 1e-4;
        if (moved && !o.returning && Math.abs(shotPos - o.anchor) > 0.06) {
          o.returning = true;
          o.vYaw = o.vPitch = 0;
          o.target = Math.round(o.yaw / (Math.PI * 2)) * Math.PI * 2; // never unwind a full turn
        }
        if (o.returning) {
          const k = 1 - Math.exp(-dt * 2.4);
          o.yaw += (o.target - o.yaw) * k;
          o.pitch += -o.pitch * k;
          if (Math.abs(o.target - o.yaw) < 1e-3 && Math.abs(o.pitch) < 1e-3) {
            o.yaw = o.pitch = 0;
            o.returning = false;
          }
        }
      }
      if (o.yaw !== 0 || o.pitch !== 0) {
        PIVOT.set(...cfg.pivot);
        SPH.setFromVector3(TMP.copy(cam).sub(PIVOT));
        SPH.theta += o.yaw;
        SPH.phi = THREE.MathUtils.clamp(SPH.phi - o.pitch, cfg.minPolar, cfg.maxPolar);
        SPH.makeSafe();
        cam.setFromSpherical(SPH).add(PIVOT);
        cam.y = Math.max(cam.y, cfg.minY);
        look.sub(PIVOT).applyAxisAngle(UP, o.yaw).add(PIVOT);
      }
    }

    camera.position.set(cam.x - p.sx * par, cam.y + p.sy * par * 0.6, cam.z);
    camera.lookAt(look);

    const mobile = size.width <= 760;
    camera.fov = fitFov(P.fov, size.width / size.height);
    const fx = mobile ? 0 : P.fx;
    const fy = mobile ? 0.13 : 0;
    camera.setViewOffset(size.width, size.height, -fx * size.width, fy * size.height, size.width, size.height);
    camera.updateProjectionMatrix();

    axisEl.current?.style.setProperty('--axis', Math.min(1, Math.max(0, P.look.x / AXIS_LENGTH)).toFixed(4));
  });

  return null;
}
