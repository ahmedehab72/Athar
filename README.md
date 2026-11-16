# أثر — Athar cinematic site

Vite + React + React Three Fiber. Arabic, RTL. The whole site is one continuous scroll through one 3D scene exported from `kyphi.blend` (the source file keeps its original name); the camera walks the scene's X axis (temple 0 m → perfume 64 m) as you scroll. Brand name: أثر. "كايفي" appears only as the name of the ancient incense in the story.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
```

Deploy `dist/` to any static host. Because routes are real paths (`/story`, `/perfume` …), the host must rewrite unknown paths to `index.html` (Netlify: `_redirects` → `/* /index.html 200`; Vercel: SPA rewrite).

## Where things live

| What | File |
|---|---|
| All copy, ingredients, placeholders | `src/data/content.js` |
| Camera shots per page (from the Blender preview cameras) | `src/data/shots.js` |
| Lighting (the .blend has none) | `src/three/Lights.jsx` |
| Smoke, sparks, dust, light shaft (replace Blender volumetrics) | `src/three/Atmosphere.jsx` |
| Model loading, material fixes, ingredient orbit / hover | `src/three/Kyphi.jsx` |
| Palette tokens (from the Blender materials) | `src/styles/tokens.css` |

Each page is a list of `<Shot>` sections; section *n* holds camera keyframe *n* of that page in `shots.js`. Add a section → add a keyframe.

## Re-exporting the model

In Blender, select all meshes and export glTF Binary to `public/models/kyphi.glb` (+Y up, apply modifiers, no cameras/lights).

## Replace before launch

Shown on the site as dashed amber `[placeholders]`:

- Product: concentration, bottle size, price, where it's sold (`PRODUCT` in `content.js`)
- Contact: email, phone, address (`CONTACT` in `content.js`)
- Perfume notes on `/perfume` are a proposal derived from Plutarch's list; confirm against the real formula
- The inquiry form does not send anywhere yet: see the `TODO` in `src/pages/Contact.jsx`
