import { NavLink } from 'react-router-dom';
import { CHAPTERS } from '../data/content.js';
import { AXIS_LENGTH } from '../data/shots.js';

/**
 * The processional axis. The five vitrines stand on one line in the Blender scene
 * (x = 0 … 64 m). The ember marker is the camera's real x position, written each frame
 * by CameraRig into the --axis custom property.
 */
export default function Axis() {
  return (
    <nav className="axis" aria-label="موقعك في الرحلة">
      <div className="axis__track" aria-hidden="true">
        <span className="axis__ember" />
      </div>
      <ol className="axis__stations">
        {CHAPTERS.map((c) => (
          <li key={c.id} style={{ '--at': c.x / AXIS_LENGTH }}>
            <NavLink to={c.path} className="axis__station">
              <span className="axis__dot" aria-hidden="true" />
              <span className="axis__label">{c.name}</span>
            </NavLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}
