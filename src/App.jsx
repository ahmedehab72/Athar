import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { useStore } from './store.js';
import { CHAPTER_PATH, ENTRY, chapterOf, routeKey } from './data/shots.js';
import { scrollState, scrollToChapter } from './lib/journey.js';
import Header from './components/Header.jsx';
import Axis from './components/Axis.jsx';
import Loader from './components/Loader.jsx';
import OrbitHint from './components/OrbitHint.jsx';
import Journey from './pages/Journey.jsx';
import Contact from './pages/Contact.jsx';

const Stage = lazy(() => import('./three/Stage.jsx'));

const OUT_MS = 650;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [shown, setShown] = useState(location);
  const [phase, setPhase] = useState('in');
  const setRoute = useStore((s) => s.setRoute);
  const setChapter = useStore((s) => s.setChapter);
  const chapter = useStore((s) => s.chapter);
  const reduced = useStore((s) => s.reducedMotion);
  const first = useRef(true);

  // Smooth scroll for the whole document.
  useEffect(() => {
    if (reduced) return undefined;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.9 });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [reduced]);

  useEffect(() => {
    const key = routeKey(location.pathname);
    const target = chapterOf(location.pathname);

    if (first.current) {
      first.current = false;
      setRoute(key, ENTRY[target] ?? 0);
      setChapter(target);
      return undefined;
    }
    // the URL was rewritten by scrolling; nothing to do
    if (location.state?.fromScroll) return undefined;

    // a link to another place on the journey: travel there by scrolling
    if (key === 'journey' && routeKey(shown.pathname) === 'journey') {
      setShown(location);
      scrollToChapter(target, { smooth: !reduced });
      return undefined;
    }

    // a different page (contact ↔ journey): fly the camera, swap the text under cover
    setRoute(key, ENTRY[target] ?? 0);
    setChapter(target);
    setPhase('out');
    const t = setTimeout(
      () => {
        window.__lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
        setShown(location);
        setPhase('in');
      },
      reduced ? 0 : OUT_MS,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.key]);

  // The address bar follows the camera: scrolling into a chapter rewrites the URL in place.
  useEffect(() => {
    if (phase !== 'in' || routeKey(location.pathname) !== 'journey' || scrollState.programmatic) return;
    const path = CHAPTER_PATH[chapter];
    if (path && path !== location.pathname) navigate(path, { replace: true, state: { fromScroll: true } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, phase]);

  // Move focus to the new page heading for keyboard and screen-reader users.
  useEffect(() => {
    if (phase !== 'in') return;
    const h1 = document.querySelector('#main h1');
    if (h1 && document.activeElement && document.activeElement !== document.body) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
  }, [shown.key, phase]);

  useReveal(routeKey(shown.pathname));

  return (
    <>
      <a className="skip" href="#main">تخطَّ إلى المحتوى</a>
      <Suspense fallback={null}>
        <Stage />
      </Suspense>
      <div className="scrim" aria-hidden="true" />
      <Header />
      <main id="main" className={`page page--${phase}`} data-route={routeKey(shown.pathname)}>
        <Routes location={shown}>
          <Route path="/contact" element={<Contact />} />
          <Route path="/:chapter?" element={<JourneyRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <OrbitHint />
      <Axis />
      <Loader />
    </>
  );
}

function JourneyRoute() {
  const { pathname } = useLocation();
  return chapterOf(pathname) === 'home' && pathname !== '/' ? <Navigate to="/" replace /> : <Journey />;
}

/** Text is lit as it enters the frame, like a lamp passing over a plate. */
function useReveal(key) {
  useEffect(() => {
    const els = document.querySelectorAll('#main .reveal');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-lit');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
}
