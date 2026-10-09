import React from 'react';
import { CityLocation } from '../types';
import { POPULAR_CITIES, getArabicHijriDate } from '../utils/prayerTimes';
import { soundController } from '../utils/audioSynth';
import { Volume2, Smartphone, Monitor, MapPin, Sparkles } from 'lucide-react';

interface HeaderNavProps {
  currentCity: CityLocation;
  onCityChange: (city: CityLocation) => void;
  activeTab: 'prayers' | 'tasks' | 'azkar' | 'routine' | 'kotlin';
  onTabChange: (tab: 'prayers' | 'tasks' | 'azkar' | 'routine' | 'kotlin') => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentCity,
  onCityChange,
  activeTab,
  onTabChange,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  const hijriDate = getArabicHijriDate();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top 1-line bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
            <span className="text-xl">🕌</span>
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white block leading-tight">
              مهام المسلم اليومية
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {hijriDate}
            </span>
          </div>
        </div>

        {/* Center Nav Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange('prayers')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'prayers'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            مواقيت الصلاة
          </button>
          <button
            onClick={() => onTabChange('tasks')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            المهام اليومية
          </button>
          <button
            onClick={() => onTabChange('azkar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'azkar'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            جدول الأذكار
          </button>
          <button
            onClick={() => onTabChange('routine')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'routine'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            الجدول المنظم
          </button>
          <button
            onClick={() => onTabChange('kotlin')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'kotlin'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-600/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            مشروع كوتلن (Android)
          </button>
        </nav>

        {/* Right Actions Zone: City Selector & Mobile Preview toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* City Selector */}
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 absolute right-2.5 pointer-events-none" />
            <select
              value={currentCity.id}
              onChange={(e) => {
                const found = POPULAR_CITIES.find((c) => c.id === e.target.value);
                if (found) onCityChange(found);
              }}
              className="bg-slate-800 text-slate-200 text-xs rounded-lg pr-7 pl-3 py-1.5 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer max-w-[130px] sm:max-w-none truncate"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* Test Adhan audio */}
          <button
            onClick={() => soundController.playTakbeerMelody()}
            title="تجربة صوت الأذان والتكبير"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition flex items-center gap-1 text-xs px-2"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">أذان</span>
          </button>

          {/* Toggle Phone Frame Simulator vs Fullscreen */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'تبديل للعرض الموسع' : 'تبديل لشاشة هاتف أندرويد'}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition hidden lg:flex items-center gap-1 text-xs px-2.5"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>عرض الحاسوب</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>هاتف أندرويد</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
