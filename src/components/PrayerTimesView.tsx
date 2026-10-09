import React, { useState, useEffect } from 'react';
import { CityLocation, PrayerName, PrayerTimeItem } from '../types';
import { getFullPrayerItems, calculateQiblaBearing } from '../utils/prayerTimes';
import { soundController } from '../utils/audioSynth';
import { Bell, BellOff, Volume2, Compass, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface PrayerTimesViewProps {
  currentCity: CityLocation;
}

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({ currentCity }) => {
  const [prayers, setPrayers] = useState<PrayerTimeItem[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<PrayerTimeItem | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  // Calculate and refresh prayer times
  useEffect(() => {
    const items = getFullPrayerItems(currentCity.lat, currentCity.lng, new Date());
    setPrayers(items);

    const next = items.find((p) => p.isNext) || items[0];
    setNextPrayer(next);
  }, [currentCity]);

  // Live clock and countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );

      if (nextPrayer) {
        let diff = nextPrayer.timestamp.getTime() - now.getTime();
        // If next prayer is tomorrow's Fajr
        if (diff < 0) {
          const tomorrowFajr = new Date(nextPrayer.timestamp);
          tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
          diff = tomorrowFajr.getTime() - now.getTime();
        }

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeRemaining(
            `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
          );
        } else {
          setTimeRemaining('حان وقت الصلاة الآن');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPrayer]);

  // Toggle notification for a specific prayer
  const toggleNotification = (id: PrayerName) => {
    soundController.playTasbeehClick();
    setPrayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, notificationEnabled: !p.notificationEnabled } : p))
    );
  };

  // Request browser notification permission
  const requestNotification = async () => {
    if (typeof Notification !== 'undefined') {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
      if (res === 'granted') {
        soundController.playTakbeerMelody();
        new Notification('تم تفعيل منبه الصلوات 🕌', {
          body: `سيتم تذكيرك بمواقيت الصلوات الخمس لمدينة ${currentCity.nameAr}`,
          icon: '/icon.svg',
        });
        setTestNotificationSent(true);
        setTimeout(() => setTestNotificationSent(false), 4000);
      }
    } else {
      soundController.playTakbeerMelody();
    }
  };

  // Test Adhan & Reminder notification
  const triggerTestAlarm = () => {
    soundController.playTakbeerMelody();
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('🕌 تجربة تنبيه الأذان', {
        body: 'الله أكبر، الله أكبر.. حيّ على الصلاة، حيّ على الفلاح',
      });
    }
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 4000);
  };

  const qiblaAngle = calculateQiblaBearing(currentCity.lat, currentCity.lng);

  return (
    <div className="space-y-6">
      {/* Top Banner: Next Prayer Countdown */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 border border-emerald-800/40 p-6 text-white shadow-xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>الصلاة القادمة</span>
              <span className="text-slate-400">·</span>
              <span>{currentCity.nameAr}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              صلاة {nextPrayer?.arabicName}
            </h2>
            <p className="text-sm text-slate-300">
              الوقت المحدد:{' '}
              <span className="font-semibold text-emerald-300 font-mono text-base">
                {nextPrayer?.time}
              </span>{' '}
              · الوقت الحالي:{' '}
              <span className="font-mono text-slate-300">{currentTimeStr}</span>
            </p>
          </div>

          {/* Countdown Digital Timer */}
          <div className="flex flex-col items-center p-4 rounded-xl bg-slate-950/60 border border-emerald-500/30 backdrop-blur-md">
            <span className="text-xs text-slate-400 mb-1">الوقت المتبقي للأذان</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-widest text-emerald-400">
              {timeRemaining || '--:--:--'}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={triggerTestAlarm}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                استماع للأذان
              </button>
              {notificationPermission !== 'granted' && (
                <button
                  onClick={requestNotification}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition flex items-center gap-1"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  تفعيل الإشعارات
                </button>
              )}
            </div>
          </div>
        </div>

        {testNotificationSent && (
          <div className="mt-4 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>تم إطلاق تنبيه الأذان التجريبي بنجاح مع نغمة التكبير والاهتزاز.</span>
          </div>
        )}
      </div>

      {/* Grid of the 6 Prayer Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {prayers.map((prayer) => {
          const isNext = prayer.isNext;
          const isCurrent = prayer.isCurrent;

          return (
            <div
              key={prayer.id}
              className={`relative rounded-xl p-4 transition-all border flex flex-col justify-between ${
                isNext
                  ? 'bg-gradient-to-b from-emerald-950 to-slate-900 border-emerald-500 shadow-md shadow-emerald-900/30'
                  : isCurrent
                  ? 'bg-slate-900 border-teal-600/60'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">{prayer.englishName}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{prayer.arabicName}</h3>
                </div>
                {prayer.id !== 'sunrise' && (
                  <button
                    onClick={() => toggleNotification(prayer.id)}
                    title={prayer.notificationEnabled ? 'إلغاء التنبيه' : 'تفعيل التنبيه'}
                    className={`p-1.5 rounded-lg transition ${
                      prayer.notificationEnabled
                        ? 'text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/80'
                        : 'text-slate-500 bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    {prayer.notificationEnabled ? (
                      <Bell className="w-4 h-4" />
                    ) : (
                      <BellOff className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              <div className="mt-4">
                <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-100 tracking-tight">
                  {prayer.time}
                </span>
                <div className="mt-2 text-[11px] text-slate-400">
                  {isNext ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> الصلاة القادمة
                    </span>
                  ) : isCurrent ? (
                    <span className="text-teal-400 font-semibold">الصلاة الحالية</span>
                  ) : (
                    <span>{prayer.notificationEnabled ? 'منبه مفعل' : 'تنبيه صامت'}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auxiliary Info: Qibla & Prayer Virtues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Qibla Direction Compass Card */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-full border-2 border-emerald-600/40 flex items-center justify-center shrink-0 bg-slate-950 shadow-inner">
            <Compass className="w-8 h-8 text-slate-600" />
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-700"
              style={{ transform: `rotate(${qiblaAngle}deg)` }}
            >
              <div className="w-1 h-9 bg-emerald-500 rounded-full -translate-y-3.5 shadow-sm shadow-emerald-400" />
              <div className="absolute top-2 w-2 h-2 rounded-full bg-amber-400" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-emerald-400 font-medium">اتجاه القبلة نحو مكة المكرمة</span>
            <h4 className="text-base font-bold text-white">
              زاوية القبلة: <span className="font-mono text-emerald-300">{qiblaAngle}°</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              محسوبة فلكياً لمدينة {currentCity.nameAr} بالنسبة للكعبة المشرفة. وجه هاتفك باتجاه السهم الأخضر.
            </p>
          </div>
        </div>

        {/* Hadith on Prayer */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-center space-y-2">
          <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <span>✨</span>
            <span>فضل المحافظة على الصلوات</span>
          </span>
          <p className="text-sm font-quran text-slate-200 leading-relaxed">
            «أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ: الصَّلَاةُ عَلَى وَقْتِهَا، ثُمَّ بِرُّ الْوَالِدَيْنِ، ثُمَّ الْجِهَادُ فِي سَبِيلِ اللَّهِ»
          </p>
          <span className="text-[11px] text-slate-400">متفق عليه عن عبد الله بن مسعود رضي الله عنه</span>
        </div>
      </div>
    </div>
  );
};
