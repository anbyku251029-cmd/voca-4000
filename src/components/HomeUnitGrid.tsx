import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  ChevronRight,
  Flame,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Layers,
} from 'lucide-react';
import { WordItem, LearningState, BookLevel } from '../types';
import { calculateUnitProgress } from '../utils/storage';
import { BOOKS_CONFIG, getBookInfo, getAccentClasses } from '../utils/theme';

interface Props {
  words: WordItem[];
  learningState: LearningState;
  unitTitles: Record<number, string>;
  onSelectUnit: (unit: number, step?: 'flashcard' | 'quiz' | 'story' | 'review') => void;
  streak: number;
  currentBook?: BookLevel;
  onSelectBook?: (book: BookLevel) => void;
}

export const HomeUnitGrid: React.FC<Props> = ({
  words,
  learningState,
  unitTitles,
  onSelectUnit,
  streak,
  currentBook = 1,
  onSelectBook,
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const currentBookInfo = getBookInfo(currentBook);
  const currentAccent = getAccentClasses(currentBookInfo.accent);
  const unitsList = Array.from({ length: 30 }, (_, i) => i + 1);

  // Calculate overall stats
  const totalWords = words.length || 600;
  const totalMastered = Object.values(learningState.masteryStatus).filter(
    (s) => s === 'easy'
  ).length;
  const overallPercentage = Math.round((totalMastered / totalWords) * 100);

  const filteredUnits = unitsList.filter((u) => {
    const unitWords = words.filter((w) => w.unit === u);
    const { percentage } = calculateUnitProgress(u, unitWords, learningState, currentBook);

    if (filter === 'completed' && percentage < 100) return false;
    if (filter === 'in_progress' && (percentage === 0 || percentage === 100)) return false;

    if (search.trim()) {
      const title = unitTitles[u] || `Unit ${u}`;
      const matchTitle = title.toLowerCase().includes(search.toLowerCase());
      const matchNum = `${u}` === search.trim() || `unit ${u}`.includes(search.toLowerCase());
      const matchWords = unitWords.some((w) =>
        w.word.toLowerCase().includes(search.toLowerCase()) ||
        (w.koreanDefinition && w.koreanDefinition.includes(search))
      );
      return matchTitle || matchNum || matchWords;
    }

    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hero Learning Progress Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden text-left transition-all ${currentBookInfo.bannerGradient}`}
      >
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${currentBookInfo.heroBadgeText}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{currentBookInfo.name} 인터랙티브 보카 마스터</span>
            </div>

            {/* Book 1 ~ 6 Switcher in Hero */}
            {onSelectBook && (
              <div className="inline-flex items-center p-1 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 gap-1 flex-wrap">
                {BOOKS_CONFIG.map((b) => (
                  <button
                    key={b.book}
                    onClick={() => onSelectBook(b.book)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      currentBook === b.book
                        ? 'bg-white text-zinc-950 shadow-xs font-black'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>Book {b.book}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 opacity-90" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {currentBookInfo.name} : {currentBookInfo.subtitle}
            </h2>
          </div>
          <p className="text-white/85 text-xs sm:text-sm max-w-xl leading-relaxed mb-6">
            플래시카드 단어 암기, 스마트 퀴즈 평가, 원어민 음성 본문 리딩, 오답 복습까지 4단계 나선형 시스템으로 완벽 마스터하세요.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15">
            <div>
              <div className="text-xs text-white/70 font-semibold mb-0.5">전체 진행률</div>
              <div className="text-xl font-black">{overallPercentage}%</div>
            </div>
            <div>
              <div className="text-xs text-white/70 font-semibold mb-0.5">학습 완료 단어</div>
              <div className="text-xl font-black">
                {totalMastered} <span className="text-xs font-normal opacity-70">/ {totalWords}</span>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-xs text-white/70 font-semibold mb-0.5">연속 학습 일수</div>
              <div className="text-xl font-black flex items-center gap-1">
                <Flame className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span>{streak}일</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-black/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="유닛 이름, 번호, 또는 포함된 단어 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden transition focus:ring-2 ${currentAccent.ring}`}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              filter === 'all'
                ? `${currentAccent.bgSolid} text-white shadow-xs`
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            전체 ({unitsList.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              filter === 'in_progress'
                ? `${currentAccent.bgSolid} text-white shadow-xs`
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            학습 중
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              filter === 'completed'
                ? `${currentAccent.bgSolid} text-white shadow-xs`
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            완료
          </button>
        </div>
      </div>

      {/* 30 Units Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredUnits.map((unitNum) => {
          const unitWords = words.filter((w) => w.unit === unitNum);
          const { percentage, masteredCount, totalCount, quizScorePercent } = calculateUnitProgress(
            unitNum,
            unitWords,
            learningState,
            currentBook
          );

          const isCompleted = percentage === 100;
          const isInProgress = percentage > 0 && percentage < 100;
          const title = unitTitles[unitNum] || `Unit ${unitNum} Vocabulary`;

          return (
            <div
              key={unitNum}
              onClick={() => onSelectUnit(unitNum)}
              className={`group bg-white dark:bg-zinc-900 rounded-3xl p-5 pt-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between text-left relative overflow-hidden ${
                isCompleted
                  ? `${currentAccent.border} shadow-sm`
                  : isInProgress
                  ? `${currentAccent.border} shadow-sm ring-1 ${currentAccent.ring}`
                  : `border-zinc-200 dark:border-zinc-800 hover:${currentAccent.border}`
              }`}
            >
              {/* Top Accent Color Bar */}
              <div
                className={`h-1.5 w-full absolute top-0 left-0 transition-opacity ${
                  isCompleted || isInProgress
                    ? currentAccent.bgSolid
                    : `${currentAccent.bgSolid} opacity-40 group-hover:opacity-100`
                }`}
              />

              <div>
                {/* Card Top: Unit Number & Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm transition-all group-hover:scale-105 ${
                        isCompleted
                          ? `${currentAccent.bgSolid} text-white shadow-md`
                          : isInProgress
                          ? `${currentAccent.bgSolid} text-white shadow-md ring-2 ${currentAccent.ring}`
                          : `${currentAccent.bg} ${currentAccent.text} border ${currentAccent.border} group-hover:${currentAccent.bgSolid} group-hover:text-white`
                      }`}
                    >
                      {unitNum}
                    </span>
                    <span className={`text-xs font-bold ${currentAccent.text}`}>
                      Unit {String(unitNum).padStart(2, '0')}
                    </span>
                  </div>

                  {isCompleted ? (
                    <span className={`flex items-center gap-1 text-[11px] font-extrabold ${currentAccent.text} ${currentAccent.bg} px-2 py-0.5 rounded-full border ${currentAccent.border}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      완료
                    </span>
                  ) : isInProgress ? (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${currentAccent.bg} ${currentAccent.border} ${currentAccent.text}`}
                    >
                      {percentage}% 진행
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-zinc-400">
                      미학습
                    </span>
                  )}
                </div>

                {/* Unit Title */}
                <h3
                  className={`font-extrabold text-base text-zinc-900 dark:text-zinc-100 mb-1.5 leading-snug line-clamp-1 transition-colors group-hover:${currentAccent.text}`}
                >
                  {title}
                </h3>

                {/* Vocabulary Preview pills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {unitWords.slice(0, 3).map((w) => (
                    <span
                      key={w.id}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400"
                    >
                      {w.word}
                    </span>
                  ))}
                  {unitWords.length > 3 && (
                    <span className="text-[10px] text-zinc-400 self-center">
                      +{unitWords.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar & Footer */}
              <div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-2.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${currentAccent.progress}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium">
                    마스터 {masteredCount} / {totalCount}단어
                  </span>
                  {quizScorePercent !== undefined && (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                      <Award className="w-3 h-3" />
                      {quizScorePercent}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
