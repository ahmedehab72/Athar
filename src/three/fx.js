/**
 * Shared, frame-rate state for the incense ritual. Written by Incense.jsx each frame,
 * read by Lights.jsx and Kyphi.jsx. Kept outside React so the render loop never re-renders.
 */
export const fx = {
  seq: 0, // increments on every offering
  env: 0, // 0..~2, current strength of the flare (embers, light, smoke)
};

/** Drop one kyphi pellet on the coals. Safe to call from DOM or 3D events. */
export function ignite() {
  fx.seq += 1;
}

export const BRAZIER = { x: 0, y: 0.53, z: -0.4 };
