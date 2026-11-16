/* Authored icon set: 1.5px stroke, round caps, drawn on a 24 grid. */

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

/** Points "forward" in RTL reading order (to the left). */
export const ArrowForward = (p) => (
  <svg {...base} {...p}>
    <path d="M20 12H4.5" />
    <path d="M10 6.5 4.5 12l5.5 5.5" />
  </svg>
);

export const ArrowDown = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4v15.5" />
    <path d="M6.5 14 12 19.5 17.5 14" />
  </svg>
);

export const Menu = (p) => (
  <svg {...base} {...p}>
    <path d="M4 8h16" />
    <path d="M8 16h12" />
  </svg>
);

export const Close = (p) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12" />
    <path d="M18 6 6 18" />
  </svg>
);

/** Drag around: an ellipse with arrowheads, read as "turn". */
export const Orbit = (p) => (
  <svg {...base} {...p}>
    <path d="M19.5 9.2C21 10 22 11 22 12c0 2.8-4.5 5-10 5s-10-2.2-10-5 4.5-5 10-5" />
    <path d="m10 4.8 2.2 2.2L10 9.2" />
    <path d="M12 12v.01" strokeWidth="2.4" />
  </svg>
);

/** A single flame over a coal: the offering. */
export const Flame = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3c.6 3-2.8 4.2-2.8 7.6A2.8 2.8 0 0 0 12 13.4a2.8 2.8 0 0 0 2.8-2.8c0-1.3-.6-2-1.1-2.7" />
    <path d="M5 17h14l-1.6 3.5H6.6z" />
  </svg>
);

/** The brand mark: a censer with an ember and two threads of smoke. */
export const Mark = (p) => (
  <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" focusable="false" {...p}>
    <path d="M8 21h16l-2.4 4.5H10.4z" fill="var(--gold-2)" />
    <circle cx="16" cy="18.4" r="2.7" fill="var(--ember)" />
    <path
      d="M16 14.6c-2.6-2.8 1.8-4.5-.4-8.1M19.2 14.2c-1.5-1.9 1.1-3-.2-5.4"
      fill="none"
      stroke="var(--alabaster)"
      strokeWidth="1.3"
      strokeLinecap="round"
      opacity=".75"
    />
  </svg>
);
