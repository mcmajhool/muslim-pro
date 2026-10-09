import { DailyTask } from '../types';

export const DEFAULT_DAILY_TASKS: DailyTask[] = [
  // الفجر والصباح
  {
    id: 'task_fajr_fard',
    title: 'صلاة الفجر في وقتها (في جماعة)',
    description: 'أداء صلاة الفجر حاضراً في المسجد للرجال ومع أول وقتها للنساء',
    period: 'fajr_morning',
    category: 'fard',
    reward: 'من صلى الصبح فهو في ذمة الله، وبشرى بالنور التام يوم القيامة',
    timeHint: 'مع أذان الفجر',
    completed: false
  },
  {
    id: 'task_fajr_sunnah',
    title: 'سنة الفجر الراتبة (ركعتان خفيفتان)',
    description: 'ركعتا الفجر قبل الفريضة بسورتي الكافرون والإخلاص',
    period: 'fajr_morning',
    category: 'sunnah',
    reward: 'ركعتا الفجر خير من الدنيا وما فيها (صحيح مسلم)',
    timeHint: 'قبل فريضة الفجر',
    completed: false
  },
  {
    id: 'task_morning_azkar',
    title: 'قراءة أذكار الصباح كاملة',
    description: 'الجلوس للذكر والتحصين من طلوع الفجر حتى الإشراق',
    period: 'fajr_morning',
    category: 'dhikr',
    reward: 'حفظ وتوفيق وسكينة طوال النهار ودفع لكل سوء ومكروه',
    timeHint: 'بعد صلاة الفجر مباشرة',
    completed: false
  },
  {
    id: 'task_quran_morning',
    title: 'ورد القرآن الكريم اليومي (جزء أو حزب بتدبر)',
    description: 'تلاوة آيات من كتاب الله مع فهم المعنى والتدبر والعمل بها',
    period: 'fajr_morning',
    category: 'quran',
    reward: 'إن قرآن الفجر كان مشهوداً، ولكل حرف عشر حسنات',
    timeHint: 'بعد أذكار الصباح',
    completed: false
  },
  {
    id: 'task_duha_prayer',
    title: 'صلاة الضحى (ركعتان إلى أربع ركعات)',
    description: 'صلاة الأوابين بعد شروق الشمس بربع ساعة وحتى قبل الظهر',
    period: 'fajr_morning',
    category: 'sunnah',
    reward: 'تجزئ عن 360 صدقة عن مفاصل جسدك كل يوم',
    timeHint: 'الضحى (9:00 ص - 11:30 ص)',
    completed: false
  },

  // الظهر والعصر
  {
    id: 'task_dhuhr_sunnah_pre',
    title: 'سنة الظهر القبلية (4 ركعات)',
    description: 'أربع ركعات بتسليمتين قبل فريضة الظهر',
    period: 'dhuhr_asr',
    category: 'sunnah',
    reward: 'تُفتح فيها أبواب السماء، ويحب النبي أن يرفع له فيها عمل صالح',
    timeHint: 'قبل فريضة الظهر',
    completed: false
  },
  {
    id: 'task_dhuhr_fard',
    title: 'صلاة الظهر في وقتها',
    description: 'أداء فريضة الظهر جماعة في المسجد بخشوع وسكينة',
    period: 'dhuhr_asr',
    category: 'fard',
    reward: 'أحب الأعمال إلى الله: الصلاة على وقتها',
    timeHint: 'مع أذان الظهر',
    completed: false
  },
  {
    id: 'task_dhuhr_sunnah_post',
    title: 'سنة الظهر البعدية (ركعتان راتبة)',
    description: 'ركعتان بعد صلاة الظهر لاستكمال السنن الرواتب',
    period: 'dhuhr_asr',
    category: 'sunnah',
    reward: 'من بنى لله 12 ركعة في اليوم بنى الله له بيتاً في الجنة',
    timeHint: 'بعد فريضة الظهر',
    completed: false
  },
  {
    id: 'task_asr_fard',
    title: 'صلاة العصر في وقتها (الصلاة الوسطى)',
    description: 'المحافظة على صلاة العصر وتجنب تأخيرها حتى اصفرار الشمس',
    period: 'dhuhr_asr',
    category: 'fard',
    reward: 'من ترك صلاة العصر فقد حبط عمله، ومن صلاها دخل الجنة',
    timeHint: 'مع أذان العصر',
    completed: false
  },
  {
    id: 'task_sadaqah',
    title: 'صدقة اليوم أو مساعدة محتاج',
    description: 'تصدق بمال، أو إطعام طعام، أو كلمة طيبة، أو تبسم في وجه أخيك',
    period: 'dhuhr_asr',
    category: 'akhlaq',
    reward: 'الصدقة تطفئ غضب الرب وتدفع ميتة السوء وتظل صاحبها يوم القيامة',
    timeHint: 'خلال اليوم',
    completed: false
  },
  {
    id: 'task_parents_silah',
    title: 'بر الوالدين وصلة الرحم',
    description: 'مكالمة هاتفية، أو زيارة، أو دعاء لهما بظهر الغيب، أو إدخال سرور',
    period: 'dhuhr_asr',
    category: 'akhlaq',
    reward: 'رضا الله في رضا الوالدين، ومن أحب أن يُبسط له في رزقه فليصل رحمه',
    timeHint: 'فترة ما بعد الظهيرة',
    completed: false
  },

  // المغرب والعشاء
  {
    id: 'task_evening_azkar',
    title: 'قراءة أذكار المساء',
    description: 'تحصين النفس والبيت بالأذكار النبوية المأثورة قبل الغروب أو بعده',
    period: 'maghrib_isha',
    category: 'dhikr',
    reward: 'حفظ من الهوام والشرور والشياطين طيلة الليل حتى يصبح',
    timeHint: 'قبل غروب الشمس / بعد العصر',
    completed: false
  },
  {
    id: 'task_maghrib_fard',
    title: 'صلاة المغرب في وقتها وسنتها (ركعتان)',
    description: 'أداء صلاة المغرب وركعتين راتبة بعدها بخشوع',
    period: 'maghrib_isha',
    category: 'fard',
    reward: 'استقبال الليل بطاعة الله والتضرع إليه',
    timeHint: 'مع أذان المغرب',
    completed: false
  },
  {
    id: 'task_isha_fard',
    title: 'صلاة العشاء في وقتها وسنتها (ركعتان)',
    description: 'أداء صلاة العشاء في جماعة وركعتي السنة الراتبة',
    period: 'maghrib_isha',
    category: 'fard',
    reward: 'من صلى العشاء في جماعة فكأنما قام نصف الليل',
    timeHint: 'مع أذان العشاء',
    completed: false
  },
  {
    id: 'task_witr_prayer',
    title: 'صلاة الوتر (ركعة إلى ثلاث ركعات)',
    description: 'ختم صلاة الليل بالوتر إما بعد العشاء أو قبل النوم أو عند السحر',
    period: 'maghrib_isha',
    category: 'sunnah',
    reward: 'إن الله وتر يحب الوتر، فأوتروا يا أهل القرآن',
    timeHint: 'بعد سنة العشاء أو قبل النوم',
    completed: false
  },
  {
    id: 'task_seeking_knowledge',
    title: 'مجلس علم أو قراءة حديث وسيرة نبوية',
    description: 'قراءة 15 دقيقة في تفسير القرآن، أو رياض الصالحين، أو سيرة الحبيب ﷺ',
    period: 'maghrib_isha',
    category: 'akhlaq',
    reward: 'من سلك طريقاً يلتمس فيه علماً سهل الله له به طريقاً إلى الجنة',
    timeHint: 'بين المغرب والعشاء أو بعد العشاء',
    completed: false
  },

  // الليل والاستعداد للنوم
  {
    id: 'task_qiyam_night',
    title: 'قيام الليل والتهجد (ركعتان أو أكثر)',
    description: 'الوقوف بين يدي الله في الثلث الأخير من الليل والناس نيام',
    period: 'night_sleep',
    category: 'sunnah',
    reward: 'شرف المؤمن قيامه بالليل، وأفضل الصلاة بعد الفريضة صلاة الليل',
    timeHint: 'الثلث الأخير من الليل (قبل الفجر بساعة)',
    completed: false
  },
  {
    id: 'task_istighfar_sahoor',
    title: 'الاستغفار بالأسحار والتضرع بالدعاء',
    description: 'الاستغفار والدعاء في وقت النزول الإلهي: هل من داعٍ فأستجيب له؟',
    period: 'night_sleep',
    category: 'dhikr',
    reward: 'والمستغفرين بالأسحار، وقت إجابة الدعاء ومغفرة الذنوب',
    timeHint: 'قبل الفجر بنصف ساعة',
    completed: false
  },
  {
    id: 'task_muhasabah_tawbah',
    title: 'محاسبة النفس والعفو وتجديد التوبة',
    description: 'تفقد أعمال اليوم، الاستغفار من الزلل، العفو عن المسلمين والمبيت بقلب سليم',
    period: 'night_sleep',
    category: 'akhlaq',
    reward: 'حاسبوا أنفسكم قبل أن تحاسبوا، وسلامة الصدر من موجبات الجنة',
    timeHint: 'قبل وضع الرأس على الوسادة',
    completed: false
  },
  {
    id: 'task_sleep_azkar',
    title: 'أذكار النوم والنوم على وضوء وطهارة',
    description: 'آية الكرسي، المعوذات، باسمك ربي وضعت جنبي، والتسبيح 33 والتحميد 33 والتكبير 34',
    period: 'night_sleep',
    category: 'dhikr',
    reward: 'يوكل به ملك يحفظه ولا يقربه شيطان حتى يصبح، والمبيت في حفظ الله',
    timeHint: 'عند النوم',
    completed: false
  }
];
