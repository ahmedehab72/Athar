/**
 * Camera shots, in glTF / three.js space (Y up). Blender (x, y, z) → three (x, z, -y).
 * The base shots are the preview cameras from kyphi.blend (Camera_Preview_CH1..5 tracking
 * LOOK_CH1..5).
 *
 * The site is one continuous journey: every keyframe below belongs to one <section data-shot>
 * on the journey page, in order. `chapter` says which chapter the section belongs to;
 * interludes (no text) carry the camera from one vitrine to the next.
 *
 * frame: where the subject sits on desktop. 'left' leaves the right (RTL start) side for text.
 */

export const AXIS_LENGTH = 64;

// Blender preview cameras, verbatim.
const CH1 = { cam: [0, 0.72, 2.4], look: [0, 0.7, -2.2], fov: 32.3 };
const CH2 = { cam: [16.12, 1.1, 4.8], look: [16, 1.2, 0], fov: 13.6 };
const CH3 = { cam: [32.25, 1.72, 4.15], look: [31.98, 0.2, 0.06], fov: 13.6 };
const CH4 = { cam: [48.65, 1.18, 9.2], look: [48, 1.12, 0], fov: 13.6 };
const CH5 = { cam: [64.55, 0.52, 5.0], look: [64, 0.38, 0], fov: 13.6 };

const k = (chapter, base, frame = 'left', over = {}) => ({ chapter, ...base, frame, ...over });
const interlude = (chapter, cam, look, fov) => ({ chapter, cam, look, fov, frame: 'center', interlude: true });

export const JOURNEY = [
  k('home', { cam: [0, 1.0, 6.2], look: [0, 0.95, -2.4], fov: 30 }, 'center'),

  k('story', { cam: [0, 0.9, 4.3], look: [0, 0.82, -2.2], fov: 32 }, 'center'),
  k('story', CH1),
  k('story', { cam: [0.42, 0.78, 0.95], look: [0, 0.52, -0.4], fov: 30 }),
  k('story', { cam: [-0.55, 0.55, 0.7], look: [0.25, 2.9, -1.8], fov: 44 }),
  interlude('story', [7, 2.4, 10], [13, 1.0, 0], 30),

  k('ingredients', CH2, 'center', { cam: [16.12, 1.15, 6.2] }),
  k('ingredients', { cam: [18.9, 1.45, 3.9], look: [16, 1.18, 0], fov: 15 }),
  interlude('ingredients', [24, 2.2, 8], [30, 0.6, 0], 26),

  k('ritual', CH3, 'center'),
  k('ritual', { cam: [31.95, 3.4, 1.25], look: [32.0, 0.12, 0], fov: 19 }),
  k('ritual', { cam: [33.6, 0.5, 1.8], look: [32.05, 0.2, 0], fov: 20 }),
  k('ritual', { cam: [30.85, 0.62, 1.55], look: [31.78, 0.18, -0.22], fov: 20 }),
  k('ritual', { cam: [32.8, 0.95, 1.65], look: [32.08, 0.2, 0], fov: 20 }),
  interlude('ritual', [40, 2.4, 10], [46, 1.0, 0], 26),

  k('vessel', CH4, 'center'),
  k('vessel', { cam: [46.9, 0.45, 4.6], look: [48, 1.15, 0], fov: 24 }),
  k('vessel', { cam: [48.55, 2.05, 2.7], look: [48, 1.76, 0], fov: 15 }),
  interlude('vessel', [56, 2.0, 9], [62, 0.5, 0], 24),

  k('perfume', CH5),
  k('perfume', { cam: [65.35, 0.62, 3.7], look: [64, 0.36, 0], fov: 14 }),
  k('perfume', { cam: [64.08, 0.3, 1.55], look: [64, 0.29, 0], fov: 16 }),
  k('perfume', { cam: [64.35, 1.25, 2.1], look: [64, 0.55, 0], fov: 16 }),
  k('perfume', CH5, 'left', { cam: [64.75, 0.6, 6.0] }),
];

export const SHOTS = {
  journey: JOURNEY,
  contact: [k('contact', { cam: [0.2, 0.95, 4.6], look: [0, 0.75, -2.2], fov: 30 })],
};

/** Index of the first section of each chapter in the journey. */
export const ENTRY = JOURNEY.reduce((acc, s, i) => (s.chapter in acc ? acc : { ...acc, [s.chapter]: i }), {});

/**
 * Chapters where the visitor can drag to orbit. The camera turns around `pivot`;
 * polar limits keep it above the floor and below the roof line.
 */
export const ORBITS = {
  story: { pivot: [0, 0.62, -0.4], minPolar: 0.42, maxPolar: 1.56, minY: 0.22, hint: 'اسحب لتتجوّل في المعبد', offering: true },
  perfume: { pivot: [64, 0.36, 0], minPolar: 0.38, maxPolar: 1.52, minY: 0.14, hint: 'اسحب لتدير الزجاجة' },
};

export const CHAPTER_PATH = {
  home: '/',
  story: '/story',
  ingredients: '/ingredients',
  ritual: '/ritual',
  vessel: '/vessel',
  perfume: '/perfume',
};

const clean = (p) => p.replace(/\/+$/, '') || '/';

/** Every path except /contact is a place on the one journey page. */
export const routeKey = (pathname) => (clean(pathname) === '/contact' ? 'contact' : 'journey');

export const chapterOf = (pathname) => {
  const p = clean(pathname);
  return Object.keys(CHAPTER_PATH).find((c) => CHAPTER_PATH[c] === p) ?? (p === '/contact' ? 'contact' : 'home');
};
