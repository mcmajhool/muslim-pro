import React, { useState, useEffect } from 'react';
import { DailyTask, TaskPeriod } from '../types';
import { DEFAULT_DAILY_TASKS } from '../data/defaultTasks';
import { soundController } from '../utils/audioSynth';
import {
  CheckCircle2,
  Circle,
  Plus,
  RotateCcw,
  Sparkles,
  Flame,
  Award,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Trash2,
  X
} from 'lucide-react';

const STORAGE_KEY = 'muslim_daily_tasks_v1';
const STREAK_KEY = 'muslim_daily_streak_v1';

export const DailyTasksView: React.FC = () => {
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_DAILY_TASKS;
  });

  const [selectedPeriod, setSelectedPeriod] = useState<TaskPeriod | 'all'>('all');
  const [streak, setStreak] = useState<number>(() => {
    try {
      const savedStreak = localStorage.getItem(STREAK_KEY);
      return savedStreak ? parseInt(savedStreak, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPeriod, setNewPeriod] = useState<TaskPeriod>('fajr_morning');
  const [newCategory, setNewCategory] = useState<DailyTask['category']>('sunnah');
  const [newReward, setNewReward] = useState('');
  const [newTimeHint, setNewTimeHint] = useState('');

  // Save tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle task completion
  const handleToggleTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            soundController.playSuccessChime();
          } else {
            soundController.playTasbeehClick();
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      });

      // Check if all completed to celebrate streak
      const allDone = updated.every((t) => t.completed);
      if (allDone) {
        setStreak((s) => {
          const nextS = s + 1;
          localStorage.setItem(STREAK_KEY, String(nextS));
          return nextS;
        });
      }

      return updated;
    });
  };

  // Add custom task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: DailyTask = {
      id: `custom_${Date.now()}`,
      title: newTitle.trim(),
      period: newPeriod,
      category: newCategory,
      reward: newReward.trim() || undefined,
      timeHint: newTimeHint.trim() || undefined,
      completed: false,
      isCustom: true,
    };

    setTasks((prev) => [newTask, ...prev]);
    soundController.playSuccessChime();
    setNewTitle('');
    setNewReward('');
    setNewTimeHint('');
    setIsAddModalOpen(false);
  };

  // Delete custom task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset tasks for a new day
  const handleResetDay = () => {
    if (window.confirm('هل تريد إعادة تعيين مهام اليوم للبدء من جديد؟')) {
      setTasks((prev) => prev.map((t) => ({ ...t, completed: false })));
      soundController.playTasbeehClick();
    }
  };

  // Filter tasks based on selected period
  const filteredTasks = tasks.filter((t) => {
    if (selectedPeriod === 'all') return true;
    return t.period === selectedPeriod;
  });

  const periodTabs: { id: TaskPeriod | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'كافة المهام', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'fajr_morning', label: 'الفجر والصباح', icon: <Sunrise className="w-3.5 h-3.5" /> },
    { id: 'dhuhr_asr', label: 'الظهر والعصر', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'maghrib_isha', label: 'المغرب والعشاء', icon: <Sunset className="w-3.5 h-3.5" /> },
    { id: 'night_sleep', label: 'الليل والنوم', icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Progress & Habit Streak Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Progress Card */}
        <div className="md:col-span-2 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/40 p-5 text-white flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-400 font-semibold tracking-wide">
                متابعة مهام اليوم كمسلم
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                أنجزت {completedCount} من {totalCount} طاعات
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDay}
                title="تصفير مهام اليوم"
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">يوم جديد</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مهمة</span>
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>نسبة الإنجاز اليومي</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak & Consistency Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
              سلسلة الالتزام
            </span>
            <span className="text-[11px] text-slate-400">«أدومه وإن قل»</span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-2">
              <span>{streak}</span>
              <span className="text-sm font-sans font-normal text-slate-300">أيام متتالية</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              «أحب العمل إلى الله أدومه وإن قل» - المحافظة اليومية على الصلاة والورد.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Award className="w-3.5 h-3.5" /> وسام المواظبة
            </span>
            <span>استمر يا بطل!</span>
          </div>
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {periodTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedPeriod(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 font-medium shrink-0 ${
              selectedPeriod === tab.id
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Task Checklist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTasks.map((task) => {
          return (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className={`group cursor-pointer rounded-xl p-4 transition-all border flex items-start justify-between gap-3 select-none ${
                task.completed
                  ? 'bg-emerald-950/20 border-emerald-600/40 text-slate-300 opacity-90'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Checkbox Icon */}
                <button
                  type="button"
                  className="mt-0.5 shrink-0 focus:outline-none"
                  aria-label={task.completed ? 'إلغاء التحديد' : 'تحديد المهمة'}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition" />
                  )}
                </button>

                {/* Task Details */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`text-sm font-semibold leading-tight ${
                        task.completed ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.timeHint && (
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {task.timeHint}
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                  )}

                  {task.reward && (
                    <p className="text-[11px] text-emerald-400/90 flex items-center gap-1 font-quran">
                      <span>✨</span>
                      <span>{task.reward}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Delete custom task button */}
              {task.isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                  title="حذف المهمة المخصصة"
                  className="p-1 rounded text-slate-500 hover:text-red-400 transition shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                إضافة طاعة أو مهمة إسلامية مخصصة
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">اسم المهمة أو الطاعة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: صيام يوم الخميس، حفظ صفحة من سورة البقرة"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">فترة اليوم</label>
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value as TaskPeriod)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="fajr_morning">الفجر والصباح</option>
                    <option value="dhuhr_asr">الظهر والعصر</option>
                    <option value="maghrib_isha">المغرب والعشاء</option>
                    <option value="night_sleep">الليل والنوم</option>
                    <option value="anytime">أي وقت في اليوم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">التصنيف</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DailyTask['category'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="sunnah">سنة مؤكدة</option>
                    <option value="quran">ورد قرآن</option>
                    <option value="dhikr">ذكر ودعاء</option>
                    <option value="akhlaq">صدقة وأخلاق</option>
                    <option value="fard">فريضة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">الوقت المقترح (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: بعد العصر، 05:00 م"
                  value={newTimeHint}
                  onChange={(e) => setNewTimeHint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">فضل العمل أو النية (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: من صام يوماً باعد الله وجهه عن النار سبعين خريفاً"
                  value={newReward}
                  onChange={(e) => setNewReward(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
                >
                  حفظ المهمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
