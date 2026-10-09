import React, { useState } from 'react';
import { KOTLIN_PROJECT_FILES } from '../data/kotlinCodeData';
import { KotlinFile } from '../types';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  ExternalLink,
  Smartphone,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export const KotlinCodeView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(KOTLIN_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-emerald-950 border border-amber-800/40 p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Smartphone className="w-4 h-4" />
            <span>مشروع أندرويد بلغة كوتلن (Kotlin Jetpack Compose)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            أكواد تطبيق أندرويد الأصلي كاملة
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            تمت برمجة هذا المشروع خصيصاً بنظام أندرويد الحديث باستخدام <span className="text-amber-400 font-semibold">Jetpack Compose</span> و <span className="text-emerald-400 font-semibold">Material 3</span> مع نظام <span className="text-teal-400 font-semibold">WorkManager</span> للتذكير بالصلوات في الخلفية حتى عند إغلاق التطبيق. يمكنك نسخ الأكواد وتشغيلها مباشرة في Android Studio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم نسخ الكود!' : 'نسخ هذا الملف'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>تحميل ({selectedFile.filename})</span>
          </button>
        </div>
      </div>

      {/* Code Explorer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Side: File Explorer List */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2 lg:col-span-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>ملفات المشروع (7 ملفات)</span>
          </div>

          <div className="space-y-1">
            {KOTLIN_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.filename === file.filename;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-mono transition flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.filename}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 uppercase">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Android Studio Quick Guide Box */}
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs space-y-2">
            <span className="text-amber-400 font-bold block flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> خطوات التشغيل:
            </span>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400 leading-relaxed">
              <li>افتح <strong className="text-white">Android Studio</strong></li>
              <li>اختر <strong className="text-white">New Project → Empty Compose Activity</strong></li>
              <li>انسخ ملفات الكود في مساراتها الموضحة</li>
              <li>اضغط <strong className="text-emerald-400">Run App (Shift + F10)</strong></li>
            </ol>
          </div>
        </div>

        {/* Right Side: Code Viewer & Path Info */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 lg:col-span-3 flex flex-col min-h-[500px]">
          {/* File Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-amber-400">
                  {selectedFile.filename}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  ({selectedFile.path})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'منسوخ' : 'نسخ'}</span>
            </button>
          </div>

          {/* Code Body */}
          <div className="mt-3 flex-1 bg-slate-950 rounded-xl p-4 overflow-x-auto font-mono text-xs text-slate-200 border border-slate-800/80 leading-relaxed select-text">
            <pre dir="ltr" className="whitespace-pre">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
