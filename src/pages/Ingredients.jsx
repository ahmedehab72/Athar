import { useEffect } from 'react';
import { Plate, Shot } from '../components/Bits.jsx';
import { useStore } from '../store.js';
import { INGREDIENTS, ROLE_LABEL, SCENE_EXTRAS, toArabicDigits } from '../data/content.js';

function describe(id) {
  const ing = INGREDIENTS.find((i) => i.id === id);
  if (ing) return { name: ing.name, meta: `${ROLE_LABEL[ing.role]}${ing.mesh ? ' · ظاهرة في المشهد' : ''}`, text: ing.text };
  const extra = SCENE_EXTRAS[id];
  if (extra) return { name: extra.name, meta: 'في المشهد', text: extra.text };
  return null;
}

/** Chapter 2 · the sixteen ingredients. Two sections on the journey. */
export default function Ingredients() {
  const active = useStore((s) => s.activeIng);
  const setActive = useStore((s) => s.setActiveIng);
  const d = active ? describe(active) : null;

  useEffect(() => () => setActive(null), [setActive]);

  return (
    <>
      <Shot align="center" id="ingredients">
        <Plate title="ست عشرة مادة" meta="الفصل الثاني · المكونات">
          <p className="lede">
            عدّها بلوتارخ ست عشرة. بعضها يُشرب، وبعضها يُؤكل، وبعضها لا يُعرف اليوم إلا بالاسم. في المشهد تدور سبعٌ منها حول
            الخلطة التي تصير إليها.
          </p>
        </Plate>
      </Shot>

      <Shot>
        <div className="ing reveal" onMouseLeave={() => setActive(null)}>
          <h3 className="plate__title">الفهرس</h3>
          <p className="ing__hint">اختر مادة من القائمة، أو مرّر المؤشر على ما يدور في المشهد.</p>

          <ol className="ing__index">
            {INGREDIENTS.map((ing, i) => (
              <li key={ing.id} className="ing__item">
                <button
                  type="button"
                  className="ing__btn"
                  aria-pressed={active === ing.id}
                  onMouseEnter={() => setActive(ing.id)}
                  onFocus={() => setActive(ing.id)}
                  onClick={() => setActive(active === ing.id ? null : ing.id)}
                >
                  <span className="ing__num">{toArabicDigits(String(i + 1).padStart(2, '0'))}</span>
                  <span className="ing__name">
                    {ing.name}
                    {ing.mesh && <span className="ing__seen" aria-label="ظاهرة في المشهد" />}
                  </span>
                  <span className="ing__role">{ROLE_LABEL[ing.role]}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="ing__detail" aria-live="polite">
            {d ? (
              <>
                <p className="ing__detail-name">{d.name}</p>
                <p className="ing__detail-meta">{d.meta}</p>
                <p className="ing__detail-text">{d.text}</p>
              </>
            ) : (
              <p className="ing__legend">
                <span className="ing__seen" aria-hidden="true" /> النقطة الكهرمانية تعني أن المادة حاضرة في المشهد.
                «افتتاحية» و«قلب» و«قاعدة» هي موضعها لو صارت عطرًا.
              </p>
            )}
          </div>
        </div>
      </Shot>
    </>
  );
}
