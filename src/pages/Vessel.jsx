import { Plate, Shot } from '../components/Bits.jsx';

/** Chapter 4 · the alabaster vessel. Three sections on the journey. */
export default function Vessel() {
  return (
    <>
      <Shot align="center" id="vessel">
        <Plate title="إناء الألباستر" meta="الفصل الرابع · الإرث">
          <p className="lede">ما يُصنع بهذا الصبر لا يُترك في أي إناء.</p>
        </Plate>
      </Shot>

      <Shot>
        <Plate as="h3" title="حجر يحفظ الرائحة" meta="الكالسيت المصري">
          <p>
            اختار المصريون الألباستر لأثمن عطورهم وزيوتهم. حجر ناعم يُنحت رقيقًا حتى يكاد الضوء يعبره، باردٌ يحفظ ما بداخله
            من الحرّ، ولا يأخذ من الرائحة ولا يضيف إليها.
          </p>
          <p className="soft">في مقابر الملوك وُجدت أوانٍ منه ما زالت تحمل أثر ما كان فيها بعد آلاف السنين.</p>
        </Plate>
      </Shot>

      <Shot>
        <Plate as="h3" title="حلقة الذهب" meta="الختم · الغطاء">
          <p>
            حول عنق الإناء حلقة ذهبية، وعلى غطائه أخرى. لم يكن الذهب زينة فقط: كان علامة على أن ما في الداخل مخصص للمعبد، وأن
            الختم لم يُفتح.
          </p>
          <p className="soft">هذه الحلقة نفسها تعود في زجاجة كايفي: طوقًا عند العنق وغطاءً من الذهب.</p>
        </Plate>
      </Shot>
    </>
  );
}
