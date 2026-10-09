import React, { useState } from 'react';
import { AzkarCategory, ZikrItem } from '../types';
import { INITIAL_AZKAR } from '../data/azkarData';
import { soundController } from '../utils/audioSynth';
import {
  Check,
  RotateCcw,
  Copy,
  CheckCheck,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  BookOpen,
  Volume2
} from 'lucide-react';

export const AzkarScheduleView: React.FC = () => {
  const [azkarList, setAzkarList] = useState<ZikrItem[]>(INITIAL_AZKAR);
  const [activeCategory, setActiveCategory] = useState<AzkarCategory>('morning');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Digital Sebha state
  const [sebhaCount, setSebhaCount] = useState(0);
  const [sebhaTarget, setSebhaTarget] = useState(33);
  const [currentSebhaPhrase, setCurrentSebhaPhrase] = useState('سُبْحَانَ اللَّهِ');

  const sebhaPhrases = [
    'سُبْحَانَ اللَّهِ',
    'الْحَمْدُ لِلَّهِ',
    'لَا إِلَهَ إِلَّا اللَّهُ',
    'اللَّهُ أَكْبَرُ',
    'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
    'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ'
  ];

  // Handle click on specific Dhikr counter
  const handleCountClick = (id: string) => {
    soundController.playTasbeehClick();
    setAzkarList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.currentCount < item.targetCount) {
            const nextCount = item.currentCount + 1;
            const isCompleted = nextCount >= item.targetCount;
            if (isCompleted) {
              soundController.playSuccessChime();
            }
            return {
              ...item,
              currentCount: nextCount,
              completed: isCompleted,
            };
          }
        }
        return item;
      })
    );
  };

  // Reset a specific Dhikr
  const handleResetZikr = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundController.playTasbeehClick();
    setAzkarList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, currentCount: 0, completed: false } : item
      )
    );
  };

  // Reset all azkar in current category
  const handleResetCategory = () => {
    soundController.playTasbeehClick();
    setAzkarList((prev) =>
      prev.map((item) =>
        item.category === activeCategory
          ? { ...item, currentCount: 0, completed: false }
          : item
      )
    );
  };

  // Copy Dhikr text
  const handleCopyText = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Recite Dhikr using speech synthesis
  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Digital Sebha counter click
  const handleSebhaTap = () => {
    soundController.playTasbeehClick();
    setSebhaCount((prev) => {
      const next = prev + 1;
      if (next % sebhaTarget === 0) {
        soundController.playSuccessChime();
      }
      return next;
    });
  };

  const handleResetSebha = () => {
    soundController.playTasbeehClick();
    setSebhaCount(0);
  };

  const categories: { id: AzkarCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'morning', label: 'أذكار الصباح', icon: <Sun className="w-4 h-4" /> },
    { id: 'evening', label: 'أذكار المساء', icon: <Sunset className="w-4 h-4" /> },
    { id: 'post_prayer', label: 'بعد الصلوات', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'sleep', label: 'أذكار النوم', icon: <Moon className="w-4 h-4" /> },
    { id: 'tasbeeh', label: 'المسبحة والاستغفار', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const currentCategoryItems = azkarList.filter((item) => item.category === activeCategory);
  const completedInCategory = currentCategoryItems.filter((i) => i.completed).length;

  return (
    <div className="space-y-6">
      {/* Category Tabs & Reset Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 px-2">
          <span className="text-xs text-slate-400">
            المكتمل:{' '}
            <span className="text-emerald-400 font-mono font-bold">
              {completedInCategory} / {currentCategoryItems.length}
            </span>
          </span>
          <button
            onClick={handleResetCategory}
            title="إعادة تعيين أذكار هذا القسم"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير</span>
          </button>
        </div>
      </div>

      {/* If Tasbeeh category is active, also display the Large Digital Sebha at the top */}
      {activeCategory === 'tasbeeh' && (
        <div className="rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/50 p-6 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="flex items-center justify-between w-full max-w-sm">
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> المسبحة الإلكترونية الرقمية
            </span>
            <button
              onClick={handleResetSebha}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> تصفير المسبحة
            </button>
          </div>

          {/* Current Sebha Phrase Dropdown */}
          <div className="w-full max-w-sm">
            <select
              value={currentSebhaPhrase}
              onChange={(e) => setCurrentSebhaPhrase(e.target.value)}
              className="w-full bg-slate-950/80 border border-emerald-700/50 text-emerald-300 font-quran text-base sm:text-lg rounded-xl px-3 py-2 text-center focus:outline-none"
            >
              {sebhaPhrases.map((phrase, i) => (
                <option key={i} value={phrase}>
                  {phrase}
                </option>
              ))}
            </select>
          </div>

          {/* Big Interactive Tap Bead Circle */}
          <div className="relative my-2">
            <button
              onClick={handleSebhaTap}
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-emerald-700 to-emerald-900 border-4 border-emerald-500/40 text-white shadow-2xl shadow-emerald-900/60 flex flex-col items-center justify-center active:scale-95 transition-transform duration-100 cursor-pointer select-none"
            >
              <span className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight">
                {sebhaCount}
              </span>
              <span className="text-[11px] text-emerald-200 mt-1 uppercase tracking-wider">
                انقر للتسبيح
              </span>
            </button>
          </div>

          {/* Presets: 33, 100, 1000 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">الهدف:</span>
            {[33, 100, 1000].map((t) => (
              <button
                key={t}
                onClick={() => setSebhaTarget(t)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                  sebhaTarget === t
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List of Organized Azkar with Card Counters */}
      <div className="space-y-4">
        {currentCategoryItems.map((zikr) => {
          const isDone = zikr.currentCount >= zikr.targetCount;
          const progressPercent = Math.min(
            100,
            Math.round((zikr.currentCount / zikr.targetCount) * 100)
          );

          return (
            <div
              key={zikr.id}
              onClick={() => handleCountClick(zikr.id)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer select-none space-y-4 ${
                isDone
                  ? 'bg-emerald-950/25 border-emerald-600/50 shadow-md shadow-emerald-950/30'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Dhikr Arabic Text */}
              <p className="font-quran text-lg sm:text-xl text-slate-100 leading-relaxed text-right font-medium">
                {zikr.text}
              </p>

              {/* Virtue & Source Footnote */}
              {(zikr.virtue || zikr.source) && (
                <div className="text-xs text-slate-400 bg-slate-950/50 rounded-xl p-3 border border-slate-800/80 space-y-1">
                  {zikr.virtue && (
                    <div className="text-emerald-400 flex items-start gap-1.5 font-medium leading-normal">
                      <span className="shrink-0">✨</span>
                      <span>{zikr.virtue}</span>
                    </div>
                  )}
                  {zikr.source && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      المصدر: {zikr.source}
                    </div>
                  )}
                </div>
              )}

              {/* Counter Action & Progress Footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                {/* Utilities: Copy & TTS */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCopyText(zikr.text, zikr.id, e)}
                    title="نسخ الذكر"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
                  >
                    {copiedId === zikr.id ? (
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[11px]">{copiedId === zikr.id ? 'تم النسخ' : 'نسخ'}</span>
                  </button>

                  <button
                    onClick={(e) => handleSpeak(zikr.text, e)}
                    title="قراءة الذكر صوتياً"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-[11px]">استماع</span>
                  </button>

                  <button
                    onClick={(e) => handleResetZikr(zikr.id, e)}
                    title="إعادة تعيين هذا الذكر"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Big Interactive Tap Counter */}
                <div className="flex items-center gap-3">
                  <div className="w-32 hidden sm:block">
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCountClick(zikr.id);
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-md ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-300'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>تم بحمد الله ({zikr.targetCount})</span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-base font-extrabold">
                          {zikr.currentCount}
                        </span>
                        <span className="text-slate-400 text-xs">/ {zikr.targetCount}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
