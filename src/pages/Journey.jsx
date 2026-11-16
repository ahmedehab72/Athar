import { useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shot } from '../components/Bits.jsx';
import { ArrowDown, ArrowForward } from '../components/Icons.jsx';
import { useStore } from '../store.js';
import { chapterOf } from '../data/shots.js';
import { scrollToChapter } from '../lib/journey.js';
import Story from './Story.jsx';
import Ingredients from './Ingredients.jsx';
import Ritual from './Ritual.jsx';
import Vessel from './Vessel.jsx';
import Perfume from './Perfume.jsx';

const META = {
  home: ['كايفي | بخور المعابد يعود عطرًا', 'كايفي: رحلة سينمائية من معبد مصري قديم إلى زجاجة عطر، عبر ست عشرة مادة وطقسٍ وإناء من الألباستر.'],
  story: ['الحكاية | كايفي', 'من أين جاء كايفي: بخور الغروب في المعابد المصرية، ووصفاته المنقوشة على جدران إدفو وفيلة.'],
  ingredients: ['المكونات | كايفي', 'ست عشرة مادة كما عدّها بلوتارخ: عسل ونبيذ وزبيب ومُرّ وراتنج وعرعر وغيرها، تدور حول قلب كايفي.'],
  ritual: ['الطقس | كايفي', 'كيف يُصنع كايفي: السحق، والنقع في النبيذ، وإذابة الراتنج بالعسل، ثم العجن والإراحة.'],
  vessel: ['إناء الألباستر | كايفي', 'لماذا حفظ المصريون عطورهم في الألباستر، وما الذي يحمله كايفي من ذلك الإرث.'],
  perfume: ['العطر | كايفي', 'كايفي اليوم: عطر مستلهم من بخور المعابد المصرية، في زجاجة من الكهرمان والذهب.'],
};

/** A wordless stretch of scroll: the camera leaves one vitrine and walks to the next. */
function Interlude() {
  return <Shot className="shot--interlude" aria-hidden="true" />;
}

/**
 * The whole film on one page. Scrolling never stops at a chapter's end: the camera carries
 * straight on along the axis into the next room.
 */
export default function Journey() {
  const { pathname } = useLocation();
  const chapter = useStore((s) => s.chapter);
  const [title, description] = META[chapter] ?? META.home;

  // Arriving on /ingredients etc. lands directly on that chapter.
  useLayoutEffect(() => {
    const c = chapterOf(pathname);
    if (c !== 'home') scrollToChapter(c, { smooth: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article>
      <title>{title}</title>
      <meta name="description" content={description} />

      <Shot className="shot--hero">
        <div className="title-card">
          <div className="reveal">
            <h1 className="title-card__word">كايفي</h1>
          </div>
          <p className="title-card__line reveal">البخور الذي كانت معابد مصر تُشعله عند الغروب، يعود عطرًا.</p>
          <div className="title-card__actions reveal">
            <button type="button" className="btn btn--ember" onClick={() => scrollToChapter('story')}>
              ابدأ الرحلة
              <ArrowDown width={18} height={18} />
            </button>
            <Link to="/perfume" className="text-link">
              <span>اذهب إلى العطر مباشرة</span>
              <ArrowForward width={18} height={18} />
            </Link>
          </div>
        </div>
      </Shot>

      <Story />
      <Interlude />
      <Ingredients />
      <Interlude />
      <Ritual />
      <Interlude />
      <Vessel />
      <Interlude />
      <Perfume />
    </article>
  );
}
