import React, { useState } from 'react';
import { IDEAL_MUSLIM_ROUTINE } from '../data/scheduleData';
import { HourlyRoutineItem } from '../types';
import {
  CalendarDays,
  Clock,
  Sparkles,
  Heart,
  Briefcase,
  BookOpen,
  Coffee,
  CheckCircle2,
  Printer
} from 'lucide-react';

export const RoutineTableView: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<HourlyRoutineItem['category'] | 'all'>('all');

  const getCategoryBadge = (category: HourlyRoutineItem['category']) => {
    switch (category) {
      case 'ibadah':
        return { label: 'عبادة وصلاة', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
      case 'quran':
        return { label: 'قرآن وتدبر', color: 'text-teal-400 bg-teal-950/60 border-teal-800' };
      case 'work':
        return { label: 'عمل ودراسة', color: 'text-blue-400 bg-blue-950/60 border-blue-800' };
      case 'rest':
        return { label: 'راحة ونوم', color: 'text-purple-400 bg-purple-950/60 border-purple-800' };
      case 'family':
        return { label: 'أسرة وصلة رحم', color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
    }
  };

  const getCategoryIcon = (category: HourlyRoutineItem['category']) => {
    switch (category) {
      case 'ibadah':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'quran':
        return <BookOpen className="w-4 h-4 text-teal-400" />;
      case 'work':
        return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'rest':
        return <Coffee className="w-4 h-4 text-purple-400" />;
      case 'family':
        return <Heart className="w-4 h-4 text-amber-400" />;
    }
  };

  const filteredRoutine = IDEAL_MUSLIM_ROUTINE.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Overview Intro Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/40 p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <CalendarDays className="w-4 h-4" />
            <span>الخطة اليومية النموذجية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            جدول يوم المسلم المنظم بالساعات
          </h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            مخطط زمني متوازن يجمع بين طاعة الله والصلوات الخمس، والإنتاجية في العمل وطلب العلم، والراحة البدنية وبر الوالدين والأهل، مستوحى من هدي النبي صلى الله عليه وسلم.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-2 shadow-sm transition shrink-0"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>طباعة الجدول / PDF</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap font-medium ${
            filterCategory === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          كافة أوقات اليوم
        </button>
        <button
          onClick={() => setFilterCategory('ibadah')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap font-medium ${
            filterCategory === 'ibadah'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          الصلوات والعبادة
        </button>
        <button
          onClick={() => setFilterCategory('quran')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap font-medium ${
            filterCategory === 'quran'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          القرآن الكريم
        </button>
        <button
          onClick={() => setFilterCategory('work')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap font-medium ${
            filterCategory === 'work'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          العمل والإنتاجية
        </button>
        <button
          onClick={() => setFilterCategory('family')}
          className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap font-medium ${
            filterCategory === 'family'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          الأسرة وصلة الرحم
        </button>
      </div>

      {/* Chronological Timetable Rows */}
      <div className="space-y-3">
        {filteredRoutine.map((item, index) => {
          const badge = getCategoryBadge(item.category);
          const icon = getCategoryIcon(item.category);

          return (
            <div
              key={index}
              className="rounded-xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-slate-700 hover:bg-slate-900/90"
            >
              {/* Left Column: Time & Category */}
              <div className="flex items-center gap-3 sm:w-60 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.timeRange}</span>
                  </div>
                  <span
                    className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Center Column: Title & Description */}
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>

              {/* Right Column: Recommendation from Sunnah */}
              <div className="sm:w-72 shrink-0 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs">
                <span className="text-[10px] text-amber-400 font-semibold block mb-0.5">
                  توجيه نبوي:
                </span>
                <p className="text-slate-300 font-quran leading-relaxed">{item.recommendation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
