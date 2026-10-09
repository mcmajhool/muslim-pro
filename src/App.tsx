import React, { useState } from 'react';
import { CityLocation } from './types';
import { POPULAR_CITIES } from './utils/prayerTimes';
import { HeaderNav } from './components/HeaderNav';
import { PrayerTimesView } from './components/PrayerTimesView';
import { DailyTasksView } from './components/DailyTasksView';
import { AzkarScheduleView } from './components/AzkarScheduleView';
import { RoutineTableView } from './components/RoutineTableView';
import { KotlinCodeView } from './components/KotlinCodeView';
import {
  Clock,
  CheckSquare,
  BookOpen,
  CalendarDays,
  FileCode2,
  Download,
  Wifi,
  BatteryCharging
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'prayers' | 'tasks' | 'azkar' | 'routine' | 'kotlin'>('prayers');
  const [currentCity, setCurrentCity] = useState<CityLocation>(POPULAR_CITIES[3]); // Algiers default or Makkah
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Bottom Navigation Bar tabs for mobile Android navigation
  const navTabs = [
    { id: 'prayers' as const, label: 'الصلوات', icon: <Clock className="w-5 h-5" /> },
    { id: 'tasks' as const, label: 'المهام', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'azkar' as const, label: 'الأذكار', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'routine' as const, label: 'الجدول', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'kotlin' as const, label: 'أندرويد كوتلن', icon: <FileCode2 className="w-5 h-5" /> },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'prayers':
        return <PrayerTimesView currentCity={currentCity} />;
      case 'tasks':
        return <DailyTasksView />;
      case 'azkar':
        return <AzkarScheduleView />;
      case 'routine':
        return <RoutineTableView />;
      case 'kotlin':
        return <KotlinCodeView />;
      default:
        return <PrayerTimesView currentCity={currentCity} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-700 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <HeaderNav
        currentCity={currentCity}
        onCityChange={setCurrentCity}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* Main Body Canvas */}
      <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 pb-24 md:pb-12 w-full max-w-7xl mx-auto">
        {isMobileFrame ? (
          /* Android Smartphone Frame Simulation */
          <div className="w-full max-w-[430px] rounded-[44px] bg-slate-900 border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative my-2">
            {/* Android Status Bar with Camera Punch Hole */}
            <div className="h-7 bg-slate-950 px-6 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none">
              <span>09:41</span>
              {/* Camera punch hole */}
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-slate-300" />
                <BatteryCharging className="w-3 h-3 text-emerald-400" />
                <span>98%</span>
              </div>
            </div>

            {/* Mobile Scrollable Viewport */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[750px] pb-24 space-y-4">
              {renderActiveView()}
            </div>

            {/* Android Bottom Navigation Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 py-2 px-1 z-30">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
                    activeTab === tab.id
                      ? 'text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  <span className="text-[10px] mt-1 whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Fullscreen Responsive Canvas (Desktop & Tablets & Mobile Phones) */
          <div className="w-full space-y-6">
            {renderActiveView()}
          </div>
        )}
      </main>

      {/* Floating Bottom Tab Bar for Smartphone Viewports (< md) when not in frame mode */}
      {!isMobileFrame && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 py-2 px-1">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 transition min-h-[44px] ${
                activeTab === tab.id
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] mt-1 whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            تطبيق مهام المسلم اليومية · جدول الأذكار والصلوات · مصمم بأحدث معايير Android Jetpack Compose & Material 3
          </p>
          <div className="flex items-center gap-4 text-emerald-400">
            <span>«أحب الأعمال إلى الله أدومها وإن قل»</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
