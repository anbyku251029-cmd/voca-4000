import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle,
  FileSpreadsheet,
  Moon,
  Sun,
  Volume2,
  ChevronDown,
  BookOpen,
  Check,
} from 'lucide-react';
import { BookLevel } from '../types';
import { BOOKS_CONFIG, getBookInfo, getAccentClasses } from '../utils/theme';

interface Props {
  currentBook: BookLevel;
  onSelectBook: (book: BookLevel) => void;
  currentUnit: number;
  unitTitle: string;
  onOpenUnitSelector: () => void;
  onOpenCsvManager: () => void;
  onOpenAudioSettings: () => void;
  streak: number;
  totalMastered: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isHomeView: boolean;
  onGoHome: () => void;
}

export const Header: React.FC<Props> = ({
  currentBook,
  onSelectBook,
  currentUnit,
  unitTitle,
  onOpenUnitSelector,
  onOpenCsvManager,
  onOpenAudioSettings,
  streak,
  totalMastered,
  theme,
  onToggleTheme,
  isHomeView,
  onGoHome,
}) => {
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);
  const bookDropdownRef = useRef<HTMLDivElement>(null);

  const currentBookInfo = getBookInfo(currentBook);
  const currentAccent = getAccentClasses(currentBookInfo.accent);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        bookDropdownRef.current &&
        !bookDropdownRef.current.contains(e.target as Node)
      ) {
        setIsBookDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand & Unit Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 text-left group shrink-0"
            title="홈으로 이동"
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform ${currentAccent.headerIcon}`}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="hidden md:block">
              <div
                className={`text-xs font-black tracking-wider uppercase ${currentAccent.text}`}
              >
                4000 Essential
              </div>
              <div className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight">
                Words Master
              </div>
            </div>
          </button>

          {/* Book / Level Selector Dropdown Menu */}
          <div className="relative shrink-0" ref={bookDropdownRef}>
            <button
              onClick={() => setIsBookDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition font-bold text-xs sm:text-sm ${currentAccent.bg} ${currentAccent.border} ${currentAccent.text} hover:opacity-90 shadow-xs`}
              title="교재 레벨 선택 (Book 1 ~ 6)"
            >
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${currentBookInfo.colorBadge}`}>
                Book {currentBook}
              </span>
              <span className="hidden sm:inline font-extrabold">
                {currentBookInfo.name}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isBookDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Overlay */}
            {isBookDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-white dark:bg-zinc-850 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-750 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  학습 교재 선택 (Level 1 ~ 6)
                </div>
                <div className="space-y-1">
                  {BOOKS_CONFIG.map((item) => {
                    const isSelected = item.book === currentBook;
                    return (
                      <button
                        key={item.book}
                        onClick={() => {
                          onSelectBook(item.book);
                          setIsBookDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition ${
                          isSelected
                            ? `${item.activeBg} border`
                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${item.colorBadge}`}
                          >
                            B{item.book}
                          </span>
                          <div>
                            <div className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className={`shrink-0 ${item.activeText}`}>
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Unit selector pill button */}
          <button
            onClick={onOpenUnitSelector}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition group text-left max-w-[140px] sm:max-w-[200px] shadow-xs ${currentAccent.bg} ${currentAccent.border} hover:opacity-90`}
          >
            <span
              className={`font-black text-xs shrink-0 ${currentAccent.text}`}
            >
              Unit {currentUnit}
            </span>
            <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold truncate">
              {unitTitle}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 shrink-0" />
          </button>
        </div>

        {/* Right Action Badges and Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Daily Streak */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400 text-xs font-bold"
            title={`${streak}일 연속 학습 중!`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{streak}일</span>
          </div>

          {/* Mastered Words Count */}
          <div
            className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
            title={`총 ${totalMastered}단어 마스터 완료`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{totalMastered}</span>
          </div>

          {/* CSV File Manage Button */}
          <button
            onClick={onOpenCsvManager}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold border border-zinc-200 dark:border-zinc-700/60 transition"
            title="CSV 데이터 관리 (Book 1, 2, 3 내보내기/가져오기)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">CSV 관리</span>
          </button>

          {/* Audio TTS Settings */}
          <button
            onClick={onOpenAudioSettings}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition"
            title="음성 발음 설정 (TTS)"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition"
            title={theme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
