import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { CHAPTERS, toArabicDigits } from '../data/content.js';
import { Close, Mark, Menu } from './Icons.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.__lenis?.stop();
    document.documentElement.classList.add('menu-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      window.__lenis?.start();
      document.documentElement.classList.remove('menu-open');
    };
  }, [open]);

  return (
    <header className="masthead">
      <Link to="/" className="brand" aria-label="كايفي، الصفحة الرئيسية">
        <Mark />
        <span className="brand__word">كايفي</span>
      </Link>

      <nav className="nav" aria-label="الفصول">
        <ul>
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <NavLink to={c.path}>{c.nav}</NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Link to="/contact" className="btn btn--ember masthead__cta">
        اطلب العطر
      </Link>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="menu"
        aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <Close /> : <Menu />}
      </button>

      <div id="menu" className="menu" data-open={open} hidden={!open}>
        <nav aria-label="القائمة">
          <ol className="menu__list">
            {CHAPTERS.map((c, i) => (
              <li key={c.id} style={{ '--i': i }}>
                <NavLink to={c.path}>
                  <span className="menu__num">{toArabicDigits(i + 1)}</span>
                  <span className="menu__name">{c.name}</span>
                </NavLink>
              </li>
            ))}
            <li style={{ '--i': CHAPTERS.length }}>
              <NavLink to="/contact">
                <span className="menu__num">
                  <Mark width={22} height={22} />
                </span>
                <span className="menu__name">اطلب العطر</span>
              </NavLink>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
}
