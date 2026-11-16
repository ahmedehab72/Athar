import { useState } from 'react';
import { Placeholder, Plate, Shot } from '../components/Bits.jsx';
import { CONTACT } from '../data/content.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [values, setValues] = useState({ name: '', reach: '', message: '' });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = 'اكتب اسمك حتى نعرف بمن نتصل.';
    const reach = values.reach.trim();
    if (!reach) e.reach = 'نحتاج بريدًا أو رقم هاتف لنردّ عليك.';
    else if (reach.includes('@') && !EMAIL_RE.test(reach)) e.reach = 'يبدو أن البريد ناقص، راجعه من فضلك.';
    else if (!reach.includes('@') && reach.replace(/\D/g, '').length < 7) e.reach = 'الرقم قصير، أضف رمز الدولة إن لزم.';
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setState('sending');
    // TODO: send `values` to the brand's inquiry endpoint or email service before launch.
    await new Promise((r) => setTimeout(r, 900));
    setState('sent');
  };

  return (
    <article>
      <title>اطلب العطر | كايفي</title>
      <meta name="description" content="اطلب كايفي أو اسأل عنه. اترك اسمك ووسيلة للتواصل ونردّ عليك." />

      <Shot>
        <Plate as="h1" title="اطلب كايفي" meta="رسالة إلى البيت">
          {state === 'sent' ? (
            <p className="inquiry__status" role="status">
              وصلت رسالتك يا {values.name.trim()}. سنردّ عليك قريبًا عبر {values.reach.trim()}.
            </p>
          ) : (
            <form className="inquiry" onSubmit={onSubmit} noValidate>
              <div className="field" data-invalid={!!errors.name}>
                <label htmlFor="f-name">الاسم</label>
                <input id="f-name" name="name" autoComplete="name" value={values.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
                {errors.name && <p id="e-name" className="field__error">{errors.name}</p>}
              </div>
              <div className="field" data-invalid={!!errors.reach}>
                <label htmlFor="f-reach">البريد أو الهاتف</label>
                <input id="f-reach" name="reach" inputMode="email" autoComplete="email" dir="auto" value={values.reach} onChange={set('reach')} aria-invalid={!!errors.reach} aria-describedby={errors.reach ? 'e-reach' : undefined} />
                {errors.reach && <p id="e-reach" className="field__error">{errors.reach}</p>}
              </div>
              <div className="field">
                <label htmlFor="f-message">رسالتك (اختياري)</label>
                <textarea id="f-message" name="message" rows={3} value={values.message} onChange={set('message')} placeholder="الكمية، المدينة، أو أي سؤال عن كايفي" />
              </div>
              <div>
                <button type="submit" className="btn btn--ember" disabled={state === 'sending'}>
                  {state === 'sending' ? 'جارٍ الإرسال…' : 'أرسل الطلب'}
                </button>
              </div>
            </form>
          )}

          <dl className="contact-lines">
            <div>
              <dt>البريد</dt>
              <dd><Placeholder value={CONTACT.email} /></dd>
            </div>
            <div>
              <dt>الهاتف</dt>
              <dd><Placeholder value={CONTACT.phone} /></dd>
            </div>
            <div>
              <dt>العنوان</dt>
              <dd><Placeholder value={CONTACT.city} /></dd>
            </div>
          </dl>
        </Plate>
      </Shot>
    </article>
  );
}
