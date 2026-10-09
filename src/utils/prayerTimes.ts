import { CityLocation, PrayerName, PrayerTimeItem } from '../types';

export const POPULAR_CITIES: CityLocation[] = [
  {
    id: 'makkah',
    nameAr: 'مكة المكرمة',
    nameEn: 'Makkah',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    lat: 21.4225,
    lng: 39.8262,
    timezone: 'Asia/Riyadh'
  },
  {
    id: 'madinah',
    nameAr: 'المدينة المنورة',
    nameEn: 'Madinah',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    lat: 24.5247,
    lng: 39.5692,
    timezone: 'Asia/Riyadh'
  },
  {
    id: 'cairo',
    nameAr: 'القاهرة',
    nameEn: 'Cairo',
    countryAr: 'مصر',
    countryEn: 'Egypt',
    lat: 30.0444,
    lng: 31.2357,
    timezone: 'Africa/Cairo'
  },
  {
    id: 'algiers',
    nameAr: 'الجزائر العاصمة',
    nameEn: 'Algiers',
    countryAr: 'الجزائر',
    countryEn: 'Algeria',
    lat: 36.7538,
    lng: 3.0588,
    timezone: 'Africa/Algiers'
  },
  {
    id: 'riyadh',
    nameAr: 'الرياض',
    nameEn: 'Riyadh',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    lat: 24.7136,
    lng: 46.6753,
    timezone: 'Asia/Riyadh'
  },
  {
    id: 'casablanca',
    nameAr: 'الدار البيضاء',
    nameEn: 'Casablanca',
    countryAr: 'المغرب',
    countryEn: 'Morocco',
    lat: 33.5731,
    lng: -7.5898,
    timezone: 'Africa/Casablanca'
  },
  {
    id: 'amman',
    nameAr: 'عمّان',
    nameEn: 'Amman',
    countryAr: 'الأردن',
    countryEn: 'Jordan',
    lat: 31.9454,
    lng: 35.9284,
    timezone: 'Asia/Amman'
  },
  {
    id: 'dubai',
    nameAr: 'دبي',
    nameEn: 'Dubai',
    countryAr: 'الإمارات العربية المتحدة',
    countryEn: 'UAE',
    lat: 25.2048,
    lng: 55.2708,
    timezone: 'Asia/Dubai'
  },
  {
    id: 'istanbul',
    nameAr: 'إسطنبول',
    nameEn: 'Istanbul',
    countryAr: 'تركيا',
    countryEn: 'Turkey',
    lat: 41.0082,
    lng: 28.9784,
    timezone: 'Europe/Istanbul'
  },
  {
    id: 'tunis',
    nameAr: 'تونس',
    nameEn: 'Tunis',
    countryAr: 'تونس',
    countryEn: 'Tunisia',
    lat: 36.8065,
    lng: 10.1815,
    timezone: 'Africa/Tunis'
  }
];

// Mathematical calculation of Prayer Times
export function calculatePrayerTimes(lat: number, lng: number, date: Date = new Date()): Record<PrayerName, { time: string; timestamp: Date }> {
  const d = new Date(date);
  const startOfYear = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Sun declination & Equation of Time
  const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b); // minutes
  const declination = 23.45 * Math.sin((2 * Math.PI * (284 + dayOfYear)) / 365); // degrees
  const decRad = (declination * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  // Local solar noon (in decimal hours UTC)
  const timeZoneOffset = -d.getTimezoneOffset() / 60;
  const solarNoonUtc = 12 - lng / 15 - eot / 60;
  const solarNoonLocal = solarNoonUtc + timeZoneOffset;

  // Hour angle helper
  const hourAngle = (angle: number): number => {
    const aRad = (angle * Math.PI) / 180;
    const cosH = (Math.sin(aRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosH > 1) return 0; // Midnight sun
    if (cosH < -1) return Math.PI; // Polar night
    return Math.acos(cosH);
  };

  // Fajr: Sun 18 degrees below horizon (-18 deg)
  const fajrHA = hourAngle(-18) * (180 / Math.PI) / 15;
  const fajrHour = solarNoonLocal - fajrHA;

  // Sunrise: Sun 0.833 degrees below horizon
  const sunriseHA = hourAngle(-0.833) * (180 / Math.PI) / 15;
  const sunriseHour = solarNoonLocal - sunriseHA;

  // Dhuhr: solar noon + slight delay (~2 mins)
  const dhuhrHour = solarNoonLocal + 2 / 60;

  // Asr: Shadow equals object height + shadow at noon (Shafi'i/Standard)
  const noonSunAltRad = Math.asin(Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad));
  const noonShadow = 1 / Math.tan(noonSunAltRad);
  const asrAltRad = Math.atan(1 / (1 + noonShadow));
  const asrAltDeg = (asrAltRad * 180) / Math.PI;
  const asrHA = hourAngle(asrAltDeg) * (180 / Math.PI) / 15;
  const asrHour = solarNoonLocal + asrHA;

  // Maghrib: Sunset
  const maghribHour = solarNoonLocal + sunriseHA;

  // Isha: Sun 17.5 degrees below horizon
  const ishaHA = hourAngle(-17.5) * (180 / Math.PI) / 15;
  const ishaHour = solarNoonLocal + ishaHA;

  const toTimeStringAndDate = (decimalHour: number): { time: string; timestamp: Date } => {
    let normalized = decimalHour;
    while (normalized < 0) normalized += 24;
    while (normalized >= 24) normalized -= 24;

    const hours = Math.floor(normalized);
    const minutes = Math.floor((normalized - hours) * 60);

    const ts = new Date(d);
    ts.setHours(hours, minutes, 0, 0);

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    return {
      time: `${hh}:${mm}`,
      timestamp: ts
    };
  };

  return {
    fajr: toTimeStringAndDate(fajrHour),
    sunrise: toTimeStringAndDate(sunriseHour),
    dhuhr: toTimeStringAndDate(dhuhrHour),
    asr: toTimeStringAndDate(asrHour),
    maghrib: toTimeStringAndDate(maghribHour),
    isha: toTimeStringAndDate(ishaHour)
  };
}

export function getFullPrayerItems(lat: number, lng: number, date: Date = new Date()): PrayerTimeItem[] {
  const times = calculatePrayerTimes(lat, lng, date);
  const now = date.getTime();

  const baseItems: { id: PrayerName; arabicName: string; englishName: string }[] = [
    { id: 'fajr', arabicName: 'الفجر', englishName: 'Fajr' },
    { id: 'sunrise', arabicName: 'الشروق', englishName: 'Sunrise' },
    { id: 'dhuhr', arabicName: 'الظهر', englishName: 'Dhuhr' },
    { id: 'asr', arabicName: 'العصر', englishName: 'Asr' },
    { id: 'maghrib', arabicName: 'المغرب', englishName: 'Maghrib' },
    { id: 'isha', arabicName: 'العشاء', englishName: 'Isha' }
  ];

  let nextFound = false;
  let nextPrayerId: PrayerName = 'fajr';

  const items = baseItems.map(item => {
    const calc = times[item.id];
    const isPast = calc.timestamp.getTime() <= now;

    return {
      id: item.id,
      arabicName: item.arabicName,
      englishName: item.englishName,
      time: calc.time,
      timestamp: calc.timestamp,
      isCurrent: false,
      isNext: false,
      notificationEnabled: item.id !== 'sunrise',
      soundType: (item.id === 'sunrise' ? 'silent' : 'adhan') as 'adhan' | 'takbeer' | 'beep' | 'silent'
    };
  });

  // Find next prayer
  for (const item of items) {
    if (item.timestamp.getTime() > now && !nextFound) {
      item.isNext = true;
      nextFound = true;
      nextPrayerId = item.id;
      break;
    }
  }

  // If all prayers today passed, next is Fajr tomorrow
  if (!nextFound) {
    items[0].isNext = true;
  }

  // Determine current prayer period
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].timestamp.getTime() <= now) {
      items[i].isCurrent = true;
      break;
    }
  }

  return items;
}

// Qibla direction formula
export function calculateQiblaBearing(lat: number, lng: number): number {
  const makkahLat = 21.4225;
  const makkahLng = 39.8262;

  const lat1 = (lat * Math.PI) / 180;
  const lat2 = (makkahLat * Math.PI) / 180;
  const dLng = ((makkahLng - lng) * Math.PI) / 180;

  const y = Math.sin(dLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);

  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  qibla = (qibla + 360) % 360;
  return Math.round(qibla);
}

// Hijri Date estimation in Arabic
export function getArabicHijriDate(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return formatter.format(date);
  } catch {
    // Fallback if islamic-umalqura not available
    const hijriMonths = [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
      'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];
    return `1448 هـ`;
  }
}
