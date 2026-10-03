import React, { useState } from 'react';
import {
  Star,
  XCircle,
  Volume2,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Trash2,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { WordItem, AccentColor } from '../types';
import { speechService } from '../services/speech';
import { getAccentClasses } from '../utils/theme';

interface Props {
  allWords: WordItem[];
  bookmarks: Record<string, boolean>;
  wrongAnswers: Record<string, { count: number; lastFailedAt: number }>;
  currentUnit: number;
  onToggleBookmark: (wordId: string) => void;
  onClearWrongWord: (wordId: string) => void;
  onStartReviewFlashcards: (selectedWords: WordItem[]) => void;
  accentColor?: AccentColor;
}

export const ReviewBookmarkMode: React.FC<Props> = ({
  allWords,
  bookmarks,
  wrongAnswers,
  currentUnit,
  onToggleBookmark,
  onClearWrongWord,
  onStartReviewFlashcards,
  accentColor = 'blue',
}) => {
  const currentAccent = getAccentClasses(accentColor);
  const [filterType, setFilterType] = useState<'all' | 'wrong' | 'bookmarked'>('all');
  const [unitScope, setUnitScope] = useState<'current' | 'all'>('current');
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);

  // Filter words
  const reviewWords = allWords.filter((w) => {
    const isBookmarked = !!bookmarks[w.id];
    const isWrong = !!wrongAnswers[w.id] && wrongAnswers[w.id].count > 0;

    if (unitScope === 'current' && w.unit !== currentUnit) {
      return false;
    }

    if (filterType === 'bookmarked') return isBookmarked;
    if (filterType === 'wrong') return isWrong;
    return isBookmarked || isWrong;
  });

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    speechService.speak(text);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedWordId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Title & Stats */}
      <div className="w-full text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-200 dark:border-rose-900/60">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Step 4: Smart Review & Bookmark</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          집중 복습 및 오답 노트
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          퀴즈에서 틀렸거나 별표로 저장한 단어들을 빈틈없이 완벽 마스터하세요.
        </p>
      </div>

      {/* Filter and Scope Controls */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterType === 'all'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            전체 ({allWords.filter((w) => bookmarks[w.id] || wrongAnswers[w.id]?.count > 0).length})
          </button>
          <button
            onClick={() => setFilterType('wrong')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
              filterType === 'wrong'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <XCircle className="w-3 h-3" />
            <span>오답만</span>
          </button>
          <button
            onClick={() => setFilterType('bookmarked')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
              filterType === 'bookmarked'
                ? `${currentAccent.bgSolid} text-white shadow-xs`
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            <span>북마크만</span>
          </button>
        </div>

        {/* Scope Selector: Current Unit vs All Units */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setUnitScope('current')}
            className={`px-3 py-1.5 rounded-xl font-bold transition border ${
              unitScope === 'current'
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-xs'
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
            }`}
          >
            Unit {currentUnit}만
          </button>
          <button
            onClick={() => setUnitScope('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition border ${
              unitScope === 'all'
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-xs'
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
            }`}
          >
            전체 유닛 모아보기
          </button>
        </div>
      </div>

      {/* Action to Start Flashcards on these words */}
      {reviewWords.length > 0 && (
        <div className="w-full mb-4">
          <button
            onClick={() => onStartReviewFlashcards(reviewWords)}
            className={`w-full py-3.5 px-4 rounded-2xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${currentAccent.button}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>이 목록 단어들({reviewWords.length}개)로 플래시카드 집중 암기 시작 &rarr;</span>
          </button>
        </div>
      )}

      {/* Words List */}
      <div className="w-full space-y-2.5">
        {reviewWords.map((w) => {
          const isBookmarked = !!bookmarks[w.id];
          const wrongInfo = wrongAnswers[w.id];
          const isExpanded = expandedWordId === w.id;

          return (
            <div
              key={w.id}
              onClick={() => handleToggleExpand(w.id)}
              className={`p-4 rounded-2xl bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 shadow-xs cursor-pointer transition text-left hover:border-zinc-400 dark:hover:border-zinc-500`}
            >
              {/* Main row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleSpeak(w.word, e)}
                    className={`p-2 rounded-xl transition ${currentAccent.bg} ${currentAccent.text} hover:opacity-80`}
                    title="발음 듣기"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                        {w.word}
                      </span>
                      <span className="text-xs text-zinc-400">({w.partOfSpeech})</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        U{w.unit}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                      {w.pronunciation}
                    </div>
                  </div>
                </div>

                {/* Right badges & Actions */}
                <div className="flex items-center gap-2">
                  {wrongInfo && wrongInfo.count > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      <span>{wrongInfo.count}회 오답</span>
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(w.id);
                    }}
                    className={`p-2 rounded-xl transition ${
                      isBookmarked
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                    }`}
                    title="북마크 토글"
                  >
                    <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>

                  {wrongInfo && wrongInfo.count > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearWrongWord(w.id);
                      }}
                      className="p-2 rounded-xl text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                      title="오답노트에서 제거 (마스터 완료)"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2 animate-in fade-in">
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                      Definition
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                      {w.definition}
                    </p>
                  </div>

                  {w.koreanDefinition && (
                    <div className={`text-xs font-semibold ${currentAccent.text}`}>
                      {w.koreanDefinition}
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                      Example
                    </span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 italic">
                      "{w.exampleSentence}"
                    </p>
                    {w.exampleTranslation && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 pl-0.5">
                        {w.exampleTranslation}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {reviewWords.length === 0 && (
          <div className="py-16 text-center text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-850 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-zinc-700 dark:text-zinc-300">
              복습할 오답이나 북마크 단어가 없습니다!
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              플래시카드에서 별표(Bookmark)를 누르거나 퀴즈를 풀면 자동으로 기록됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
