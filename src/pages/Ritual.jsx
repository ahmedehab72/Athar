import { Plate, Shot } from '../components/Bits.jsx';
import { toArabicDigits } from '../data/content.js';

const STEPS = [
  {
    title: 'السحق',
    meta: 'المدقة · الحجر',
    body: 'تُدق المواد اليابسة على لوح حجري: الجذور والبذور والقصب والعرعر. لا تُطحن ناعمة تمامًا، فبعض الخشونة تجعل الدخان يصعد على مهل.',
  },
  {
    title: 'النقع',
    meta: 'النبيذ · الزبيب',
    body: 'يُنقع الزبيب في النبيذ حتى يلين، ويُدق معه معجونًا داكنًا. وتُترك المساحيق في النبيذ أيامًا، فيخرج منها ما لا يخرج بالنار.',
  },
  {
    title: 'الإذابة',
    meta: 'الراتنج · العسل',
    body: 'يُذاب الراتنج والمُرّ على نار هادئة مع العسل. هنا تتحول الدموع الكهرمانية الصلبة إلى سائل ذهبي ثقيل يربط كل شيء.',
  },
  {
    title: 'العجن والإراحة',
    meta: 'الوعاء · الزمن',
    body: 'تُجمع الأجزاء في وعاء الألباستر وتُعجن حتى تصير كتلة واحدة، ثم تُترك لتستريح. تُشكَّل بعدها حبّات صغيرة تنتظر الجمر.',
  },
];

/** Chapter 3 · the ritual. Five sections on the journey. */
export default function Ritual() {
  return (
    <>
      <Shot align="center" id="ritual">
        <Plate title="خلطة لا تُصنع على عجل" meta="الفصل الثالث · الطقس">
          <p className="lede">أربع مراحل على حجر واحد. كل مرحلة تأخذ وقتها، والوقت نفسه من المكوّنات.</p>
        </Plate>
      </Shot>

      {STEPS.map((s, i) => (
        <Shot key={s.title}>
          <Plate
            as="h3"
            title={s.title}
            meta={
              <>
                <span className="step-count">
                  {toArabicDigits(i + 1)} من {toArabicDigits(STEPS.length)}
                </span>{' '}
                · {s.meta}
              </>
            }
          >
            <p className="lede">{s.body}</p>
          </Plate>
        </Shot>
      ))}
    </>
  );
}
