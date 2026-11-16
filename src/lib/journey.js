import { ENTRY } from '../data/shots.js';

/** Set while a menu / axis click is scrolling the page, so the URL is not rewritten mid-way. */
export const scrollState = { programmatic: false };

/** The first section of a chapter on the journey page. */
export const chapterSection = (chapter) => document.querySelectorAll('#main [data-shot]')[ENTRY[chapter] ?? 0];

/**
 * Scroll the journey to a chapter. Smooth scrolling is the camera move: the scene travels
 * along the axis exactly as if the visitor had scrolled there.
 */
export function scrollToChapter(chapter, { smooth = true } = {}) {
  const el = chapter === 'home' ? 0 : chapterSection(chapter);
  if (el === undefined || el === null) return;
  const lenis = window.__lenis;
  if (!smooth) {
    if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
    else if (el === 0) window.scrollTo(0, 0);
    else el.scrollIntoView();
    return;
  }
  scrollState.programmatic = true;
  clearTimeout(scrollState.timer);
  const done = () => {
    clearTimeout(scrollState.timer);
    scrollState.programmatic = false;
  };
  if (lenis) {
    const from = window.scrollY;
    const to = el === 0 ? 0 : el.getBoundingClientRect().top + from;
    const duration = Math.min(4.5, 1.4 + Math.abs(to - from) / 4000);
    // if the visitor grabs the wheel mid-way Lenis drops the tween without onComplete
    scrollState.timer = setTimeout(done, duration * 1000 + 400);
    lenis.scrollTo(el, { duration, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2), onComplete: done, force: true });
  } else {
    if (el === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    else el.scrollIntoView({ behavior: 'smooth' });
    setTimeout(done, 1500);
  }
}
