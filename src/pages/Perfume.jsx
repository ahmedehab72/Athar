import { Link } from 'react-router-dom';
import { Placeholder, Plate, Shot } from '../components/Bits.jsx';
import { ArrowForward } from '../components/Icons.jsx';
import { PRODUCT } from '../data/content.js';
import { scrollToChapter } from '../lib/journey.js';

/** Chapter 5 · the perfume today. Five sections, the last one closes the journey. */
export default function Perfume() {
  return (
    <>
      <Shot id="perfume">
        <Plate title="كايفي" meta="الفصل الخامس · اليوم">
          <p className="lede">بخور الغروب، وقد صار عطرًا يُحمل على الجلد.</p>
          <div className="plate__actions">
            <Link to="/contact" className="btn btn--ember">
              اطلب كايفي
              <ArrowForward width={18} height={18} />
            </Link>
          </div>
        </Plate>
      </Shot>

      <Shot>
        <Plate as="h3" title="النوتات" meta="كما يقترحها الفهرس">
          <dl className="notes">
            <div className="notes__row">
              <dt>افتتاحية</dt>
              <dd>نبيذ، زبيب، حبّ العرعر، حبهان</dd>
            </div>
            <div className="notes__row">
              <dt>قلب</dt>
              <dd>عسل، قصب الذريرة، سُعد، مصطكي</dd>
            </div>
            <div className="notes__row">
              <dt>قاعدة</dt>
              <dd>مُرّ، راتنج، قار خفيف</dd>
            </div>
          </dl>
          <p className="note-small">هرم مقترح مبني على قائمة بلوتارخ، يُعتمد بعد مراجعة التركيبة النهائية.</p>
        </Plate>
      </Shot>

      <Shot>
        <Plate as="h3" title="الزجاجة" meta="زجاج · كهرمان · ذهب">
          <p>
            زجاج صافٍ سميك يحمل سائلًا كهرمانيًا بلون الراتنج المذاب. على صدرها لوحة من الذهب المطفي، وعند عنقها طوق ذهبي
            وغطاء، كما على إناء الألباستر.
          </p>
          <p className="soft">وتقف على قرص أسود لامع، كما كان الإناء يقف على حجره.</p>
        </Plate>
      </Shot>

      <Shot>
        <Plate as="h3" title="التفاصيل" meta="بطاقة العطر">
          <dl className="spec">
            <div>
              <dt>الاسم</dt>
              <dd>{PRODUCT.name}</dd>
            </div>
            <div>
              <dt>التركيز</dt>
              <dd>
                <Placeholder value={PRODUCT.kind} />
              </dd>
            </div>
            <div>
              <dt>الحجم</dt>
              <dd>
                <Placeholder value={PRODUCT.size} />
              </dd>
            </div>
            <div>
              <dt>السعر</dt>
              <dd>
                <Placeholder value={PRODUCT.price} />
              </dd>
            </div>
            <div>
              <dt>أين تجده</dt>
              <dd>
                <Placeholder value={PRODUCT.availability} />
              </dd>
            </div>
          </dl>
        </Plate>
      </Shot>

      <Shot align="center">
        <Plate as="h3" title="احمله معك" meta="ختام الرحلة">
          <p className="lede">أرسل لنا، ونخبرك كيف يصل كايفي إليك.</p>
          <div className="plate__actions">
            <Link to="/contact" className="btn btn--ember">
              اطلب كايفي
              <ArrowForward width={18} height={18} />
            </Link>
            <button type="button" className="btn" onClick={() => scrollToChapter('home')}>
              شاهد الرحلة من أولها
            </button>
          </div>
        </Plate>
      </Shot>
    </>
  );
}
