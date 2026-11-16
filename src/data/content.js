/**
 * Site copy. Everything a visitor reads lives here so it can be edited in one place.
 * Values wrapped in PLACEHOLDER(...) are not known yet and render visibly as placeholders.
 */

export const PLACEHOLDER = (label) => ({ placeholder: true, label });

export const CHAPTERS = [
  { id: 'story', path: '/story', name: 'المعبد', nav: 'الحكاية', x: 0, ordinal: 'الفصل الأول' },
  { id: 'ingredients', path: '/ingredients', name: 'ست عشرة مادة', nav: 'المكونات', x: 16, ordinal: 'الفصل الثاني' },
  { id: 'ritual', path: '/ritual', name: 'الطقس', nav: 'الطقس', x: 32, ordinal: 'الفصل الثالث' },
  { id: 'vessel', path: '/vessel', name: 'إناء الألباستر', nav: 'الإناء', x: 48, ordinal: 'الفصل الرابع' },
  { id: 'perfume', path: '/perfume', name: 'أثر', nav: 'العطر', x: 64, ordinal: 'الفصل الخامس' },
];

/**
 * Plutarch (On Isis and Osiris, §80) counts sixteen ingredients in kyphi.
 * `mesh` links an ingredient to the objects that represent it in the Blender scene (ING_*).
 * `role` is the place it would take in a perfume pyramid: top / heart / base.
 */
export const INGREDIENTS = [
  { id: 'honey', name: 'العسل', role: 'heart', mesh: 'Honey', text: 'يربط المساحيق ببعضها ويمنح الدخان حلاوته الأولى. كان العسل في مصر القديمة قربانًا بحد ذاته.' },
  { id: 'wine', name: 'النبيذ', role: 'top', mesh: 'Wine', text: 'تُنقع فيه المواد اليابسة أيامًا قبل العجن، فيلين خشبها ويخرج ما فيها من رائحة.' },
  { id: 'raisin', name: 'الزبيب', role: 'top', mesh: 'Raisin', text: 'يُدق مع النبيذ حتى يصير معجونًا داكنًا، يضيف نفحة فاكهة مجففة دافئة.' },
  { id: 'myrrh', name: 'المُر', role: 'base', mesh: 'Myrrh', text: 'صمغ مُر الطعم عميق الرائحة، جُلب من بلاد بُنت. قلب كايفي الراتنجي.' },
  { id: 'resin', name: 'الراتنج', role: 'base', mesh: 'Resin', text: 'دموع كهرمانية من شجر الصنوبر والبطم، تذوب على الجمر وتحمل الدخان إلى الأعلى.' },
  { id: 'juniper', name: 'حب العرعر', role: 'top', mesh: 'GoldSeed', text: 'يذكره بلوتارخ بنوعيه، الكبير والصغير. حبات صغيرة بنفحة صنوبرية منعشة.' },
  { id: 'juniper-small', name: 'العرعر الصغير', role: 'top', text: 'النوع الثاني من العرعر في قائمة بلوتارخ، أحدّ رائحة وأصغر حبًا.' },
  { id: 'cyperus', name: 'السُّعد', role: 'heart', text: 'جذور عشب السُّعد، رائحتها ترابية خشبية، تجعل الخلطة أرضية متماسكة.' },
  { id: 'mastic', name: 'المصطكي', role: 'heart', text: 'قطرات شفافة من شجرة المصطكي، رائحتها نظيفة كالصنوبر والليمون معًا.' },
  { id: 'calamus', name: 'قصب الذريرة', role: 'heart', text: 'قصب عطري من الأهوار، رائحته حارة حلوة تشبه القرفة والزنجبيل.' },
  { id: 'cardamom', name: 'الحبهان', role: 'top', text: 'حبات خضراء حادة الرائحة تفتح الخلطة وتمنحها لمعة باردة.' },
  { id: 'aspalathus', name: 'الأسبالاثوس', role: 'heart', text: 'شجيرة شوكية عطرية ذكرها الكتّاب الإغريق، يُستخلص من خشبها زيت دافئ.' },
  { id: 'seseli', name: 'السيسيلي', role: 'top', text: 'بذور نبتة من فصيلة الجزر، رائحتها عشبية حادة.' },
  { id: 'rush', name: 'السّمار العطري', role: 'heart', text: 'عشب الأسل العطري، يضيف للدخان خضرة جافة خفيفة.' },
  { id: 'dock', name: 'الحُمّاض', role: 'top', text: 'نبتة حامضة الطعم، تكسر ثقل الراتنج والعسل.' },
  { id: 'bitumen', name: 'القار', role: 'base', text: 'أغرب ما في القائمة: قار طبيعي يمنح الخلطة عمقًا دخانيًا قاتمًا.' },
];

/** Objects in the scene that are not in Plutarch's list but are part of the composition. */
export const SCENE_EXTRAS = {
  Cinnamon: { name: 'القرفة', text: 'ليست في قائمة بلوتارخ، لكن الباحثين يقرؤون بها إحدى مواد وصفات المعابد المتأخرة. حاضرة في المشهد كعودٍ دافئ.' },
  Center_AmberOrb: { name: 'الخلطة', text: 'في المركز: المواد كلها بعد أن تصير واحدة. كتلة كهرمانية تنتظر الجمر.' },
};

export const ROLE_LABEL = { top: 'افتتاحية', heart: 'قلب', base: 'قاعدة' };

/** Product facts that do not exist yet. Replace before launch. */
export const PRODUCT = {
  name: 'أثر',
  kind: PLACEHOLDER('نوع التركيز'),
  size: PLACEHOLDER('حجم الزجاجة'),
  price: PLACEHOLDER('السعر'),
  availability: PLACEHOLDER('أماكن البيع'),
};

export const CONTACT = {
  email: PLACEHOLDER('البريد الإلكتروني'),
  phone: PLACEHOLDER('رقم الهاتف'),
  city: PLACEHOLDER('المدينة / العنوان'),
};

export const toArabicDigits = (n) => String(n).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
