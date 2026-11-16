import { useStore } from '../store.js';
import { ORBITS } from '../data/shots.js';
import { ignite } from '../three/fx.js';
import { Orbit, Flame } from './Icons.jsx';

/**
 * What a visitor can do with their hands on an orbit page: turn the scene, and on the story
 * page make an offering. The button is the keyboard / screen-reader path to the same ritual
 * as clicking the brazier in the scene.
 */
export default function OrbitHint() {
  const route = useStore((s) => s.route);
  const chapter = useStore((s) => s.chapter);
  const used = useStore((s) => s.orbitUsed);
  const reduced = useStore((s) => s.reducedMotion);
  const cfg = route === 'journey' ? ORBITS[chapter] : null;
  if (!cfg || (reduced && !cfg.offering)) return null;

  return (
    <div className="orbit-hint" role="group" aria-label="تفاعل مع المشهد" key={chapter}>
      {!reduced && (
        <p className="orbit-hint__drag" data-used={cfg.offering ? used : false}>
          <Orbit width={20} height={20} />
          <span>{cfg.hint}</span>
        </p>
      )}
      {cfg.offering && (
        <button type="button" className="orbit-hint__burn" onClick={ignite}>
          <Flame width={18} height={18} />
          <span>أشعل البخور</span>
        </button>
      )}
    </div>
  );
}
