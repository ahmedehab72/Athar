import { create } from 'zustand';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Shared state between the DOM pages and the 3D stage.
 * route        – 'journey' (the one long page) or 'contact'
 * chapter      – chapter the camera is in now (home, story, ingredients, ritual, vessel, perfume, contact)
 * entryShot    – journey section a flight from another page lands on
 * activeIng    – ingredient highlighted (hover in DOM or 3D)
 * ready        – model loaded and first frame rendered
 */
export const useStore = create((set) => ({
  route: 'journey',
  chapter: 'home',
  entryShot: 0,
  activeIng: null,
  ready: false,
  orbitUsed: false,
  reducedMotion: reduced,
  setOrbitUsed: () => set({ orbitUsed: true }),
  setRoute: (route, entryShot = 0) => set({ route, entryShot, activeIng: null }),
  setChapter: (chapter) => set((s) => (s.chapter === chapter ? s : { chapter, activeIng: null })),
  setActiveIng: (activeIng) => set({ activeIng }),
  setReady: () => set({ ready: true }),
}));
