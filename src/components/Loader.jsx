import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { useStore } from '../store.js';
import { toArabicDigits } from '../data/content.js';

export default function Loader() {
  const { progress } = useProgress();
  const ready = useStore((s) => s.ready);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    const t = setTimeout(() => setGone(true), 1400);
    return () => clearTimeout(t);
  }, [ready]);

  if (gone) return null;
  const pct = Math.round(ready ? 100 : Math.min(progress, 99));

  return (
    <div className="loader" data-done={ready} role="status" aria-live="polite">
      <div className="loader__ember" aria-hidden="true" />
      <p className="loader__word">أثر</p>
      <p className="loader__line">
        يُوقَد الجمر… <span className="tabular">{toArabicDigits(pct)}٪</span>
      </p>
    </div>
  );
}
