export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimeItem {
  id: PrayerName;
  arabicName: string;
  englishName: string;
  time: string; // HH:mm
  timestamp: Date;
  isNext?: boolean;
  isCurrent?: boolean;
  notificationEnabled: boolean;
  soundType: 'adhan' | 'takbeer' | 'beep' | 'silent';
}

export interface CityLocation {
  id: string;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  lat: number;
  lng: number;
  timezone: string;
}

export type TaskPeriod = 'fajr_morning' | 'dhuhr_asr' | 'maghrib_isha' | 'night_sleep' | 'anytime';

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  period: TaskPeriod;
  category: 'fard' | 'sunnah' | 'quran' | 'dhikr' | 'akhlaq' | 'custom';
  reward?: string; // فضل العمل
  completed: boolean;
  isCustom?: boolean;
  timeHint?: string; // وقت مقترح
}

export type AzkarCategory = 'morning' | 'evening' | 'post_prayer' | 'sleep' | 'waking' | 'tasbeeh';

export interface ZikrItem {
  id: string;
  category: AzkarCategory;
  text: string;
  transliteration?: string;
  translation?: string;
  virtue?: string; // فضل الذكر
  source?: string; // التخريج (البخاري، مسلم...)
  targetCount: number;
  currentCount: number;
  completed: boolean;
}

export interface HourlyRoutineItem {
  timeRange: string;
  title: string;
  description: string;
  category: 'ibadah' | 'quran' | 'work' | 'rest' | 'family';
  recommendation: string;
}

export interface KotlinFile {
  filename: string;
  path: string;
  description: string;
  code: string;
  language: string;
}
