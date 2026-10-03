import React, { useState } from 'react';
import { X, Search, CheckCircle2, ChevronRight, Award, BookOpen } from 'lucide-react';
import { WordItem, LearningState, BookLevel } from '../types';
import { calculateUnitProgress } from '../utils/storage';
import { BOOKS_CONFIG, getBookInfo, getAccentClasses } from '../utils/theme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentBook: BookLevel;
  onSelectBook: (book: BookLevel) => void;
  currentUnit: number;
  onSelectUnit: (unit: number) => void;
  words: WordItem[];
  learningState: LearningState;
  unitTitles: Record<number, string>;
}

export const UnitSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentBook,
  onSelectBook,
  currentUnit,
  onSelectUnit,
  words,
  learningState,
  unitTitles,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const currentBookInfo = getBookInfo(currentBook);
  const currentAccent = getAccentClasses(currentBookInfo.accent);

  // Group units 1 to 30
  const unitsList = Array.from({ length: 30 }, (_, i) => i + 1);

  const filteredUnits = unitsList.filter((u) => {
    const title = unitTitles[u] || `Unit ${u}`;
    const matchesTitle = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnitNum = `unit ${u}`.includes(searchTerm.toLowerCase()) || `${u}` === searchTerm.trim();
    const unitWords = words.filter((w) => w.unit === u);
    const matchesWord = unitWords.some((w) =>
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.koreanDefinition && w.koreanDefinition.includes(searchTerm))
    );
    return matchesTitle || matchesUnitNum || matchesWord;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${currentAccent.bg} ${currentAccent.text}`}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>유닛 선택 (Book {currentBook} : Unit 1 ~ 30)</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                원하는 유닛을 선택하여 4단계 나선형 학습을 진행하세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level / Book Toggle Tabs (Book 1 ~ 6) */}
        <div className="grid grid-cols-6 gap-1 my-2.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60">
          {BOOKS_CONFIG.map((b) => {
            const isSelected = currentBook === b.book;
            return (
              <button
                key={b.book}
                onClick={() => onSelectBook(b.book)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center ${
                  isSelected
                    ? `${b.colorBadge} shadow-xs font-black`
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title={b.name}
              >
                <span>Book {b.book}</span>
                <span className="text-[9px] opacity-80 hidden sm:inline">Level {b.book}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="py-2">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="유닛 이름, 번호, 또는 포함된 단어 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden transition focus:ring-2 ${currentAccent.ring}`}
            />
          </div>
        </div>

        {/* Units Grid / List */}
        <div className="overflow-y-auto flex-1 space-y-2 py-1 pr-1">
          {filteredUnits.map((u) => {
            const unitWords = words.filter((w) => w.unit === u);
            const { percentage, masteredCount, totalCount, quizScorePercent } = calculateUnitProgress(
              u,
              unitWords,
              learningState,
              currentBook
            );
            const isSelected = u === currentUnit;
            const title = unitTitles[u] || `Unit ${u} Vocabulary`;

            return (
              <button
                key={u}
                onClick={() => {
                  onSelectUnit(u);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                  isSelected
                    ? `${currentAccent.border} ${currentAccent.bg} shadow-xs`
                    : `border-zinc-200 dark:border-zinc-800 hover:${currentAccent.border} bg-white dark:bg-zinc-850`
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? `${currentAccent.bgSolid} text-white shadow-md ring-2 ${currentAccent.ring}`
                        : percentage === 100
                        ? `${currentAccent.bgSolid} text-white shadow-xs`
                        : `${currentAccent.bg} ${currentAccent.text} border ${currentAccent.border} group-hover:${currentAccent.bgSolid} group-hover:text-white`
                    }`}
                  >
                    {u}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${currentAccent.text}`}>
                        Unit {String(u).padStart(2, '0')}
                      </span>
                      {percentage === 100 && (
                        <span className={`flex items-center gap-0.5 text-[10px] font-bold ${currentAccent.text} ${currentAccent.bg} px-1.5 py-0.2 rounded-md border ${currentAccent.border}`}>
                          <CheckCircle2 className="w-3 h-3" />
                          완료
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-16 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className={`h-full rounded-full ${currentAccent.progress}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition ${
                      isSelected ? currentAccent.text : ''
                    }`}
                  />
                </div>
              </button>
            );
          })}

          {filteredUnits.length === 0 && (
            <div className="py-12 text-center text-zinc-400 dark:text-zinc-500">
              검색된 유닛 또는 단어가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
