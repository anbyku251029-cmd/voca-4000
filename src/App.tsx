import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Layers,
  HelpCircle,
  Headphones,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { WordItem, LearningState, LearningStep, SpeechSettings, BookLevel, AccentColor } from './types';
import { UNITS_DATA, ALL_WORDS_FLAT } from './data/unitsData';
import { UNITS_DATA_LEVEL2, ALL_WORDS_FLAT_LEVEL2 } from './data/level2';
import { UNITS_DATA_LEVEL3, ALL_WORDS_FLAT_LEVEL3 } from './data/level3';
import { UNITS_DATA_LEVEL4, ALL_WORDS_FLAT_LEVEL4 } from './data/level4';
import { UNITS_DATA_LEVEL5, ALL_WORDS_FLAT_LEVEL5 } from './data/level5';
import { UNITS_DATA_LEVEL6, ALL_WORDS_FLAT_LEVEL6 } from './data/level6';
import {
  loadLearningState,
  saveLearningState,
  loadCustomWords,
  saveCustomWords,
  loadSpeechSettings,
  saveSpeechSettings,
  loadThemePreference,
  saveThemePreference,
  calculateUnitProgress,
} from './utils/storage';
import { getBookInfo, getBookAccent, getAccentClasses } from './utils/theme';
import { Header } from './components/Header';
import { HomeUnitGrid } from './components/HomeUnitGrid';
import { FlashcardMode } from './components/FlashcardMode';
import { SmartQuizMode } from './components/SmartQuizMode';
import { StoryReaderMode } from './components/StoryReaderMode';
import { ReviewBookmarkMode } from './components/ReviewBookmarkMode';
import { UnitSelectorModal } from './components/UnitSelectorModal';
import { CsvManagerModal } from './components/CsvManagerModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Active book/level: 1 to 6
  const [currentBook, setCurrentBook] = useState<BookLevel>(() => {
    const saved = localStorage.getItem('4000_essential_current_book');
    const parsed = saved ? parseInt(saved, 10) : 1;
    if (parsed >= 1 && parsed <= 6) return parsed as BookLevel;
    return 1;
  });

  // Loaded vocabulary dataset (default or custom imported)
  const [customWords, setCustomWords] = useState<WordItem[] | null>(null);

  // Learning persistent state
  const [learningState, setLearningState] = useState<LearningState>(loadLearningState);

  // Speech settings
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>(loadSpeechSettings);

  // View state: 'home' | 'study'
  const [viewMode, setViewMode] = useState<'home' | 'study'>('home');
  const [currentUnit, setCurrentUnit] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<LearningStep>('flashcard');

  // Modals
  const [isUnitSelectorOpen, setIsUnitSelectorOpen] = useState(false);
  const [isCsvManagerOpen, setIsCsvManagerOpen] = useState(false);
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);

  // Review flashcard specific words override
  const [reviewOverrideWords, setReviewOverrideWords] = useState<WordItem[] | null>(null);

  // Initialize theme and custom words on mount
  useEffect(() => {
    const savedTheme = loadThemePreference();
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedCustom = loadCustomWords();
    if (savedCustom && savedCustom.length > 0) {
      setCustomWords(savedCustom);
    }
  }, []);

  // Theme toggle
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveThemePreference(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Book change handler
  const handleSelectBook = (book: BookLevel) => {
    setCurrentBook(book);
    localStorage.setItem('4000_essential_current_book', String(book));
    if (customWords) {
      setCustomWords(null);
      saveCustomWords(null);
    }
    setCurrentUnit(1);
    setReviewOverrideWords(null);
  };

  // Base units dataset depending on currentBook
  const currentUnitsData = useMemo(() => {
    switch (currentBook) {
      case 6: return UNITS_DATA_LEVEL6;
      case 5: return UNITS_DATA_LEVEL5;
      case 4: return UNITS_DATA_LEVEL4;
      case 3: return UNITS_DATA_LEVEL3;
      case 2: return UNITS_DATA_LEVEL2;
      case 1:
      default: return UNITS_DATA;
    }
  }, [currentBook]);

  const defaultAllWords = useMemo(() => {
    switch (currentBook) {
      case 6: return ALL_WORDS_FLAT_LEVEL6;
      case 5: return ALL_WORDS_FLAT_LEVEL5;
      case 4: return ALL_WORDS_FLAT_LEVEL4;
      case 3: return ALL_WORDS_FLAT_LEVEL3;
      case 2: return ALL_WORDS_FLAT_LEVEL2;
      case 1:
      default: return ALL_WORDS_FLAT;
    }
  }, [currentBook]);

  const currentBookInfo = getBookInfo(currentBook);
  const bookAccentColor: AccentColor = currentBookInfo.accent;
  const currentAccent = getAccentClasses(bookAccentColor);

  // Active words dataset
  const activeAllWords = useMemo(() => {
    return customWords && customWords.length > 0 ? customWords : defaultAllWords;
  }, [customWords, defaultAllWords]);

  // Map of lowercase words
  const allWordsMap = useMemo(() => {
    return Object.fromEntries(activeAllWords.map((w) => [w.word.toLowerCase(), w]));
  }, [activeAllWords]);

  // Unit titles mapping
  const unitTitles = useMemo(() => {
    const map: Record<number, string> = {};
    for (let u = 1; u <= 30; u++) {
      const foundUnit = currentUnitsData.find((item) => item.unit === u);
      map[u] = foundUnit?.title || `Unit ${u} Vocabulary`;
    }
    return map;
  }, [currentUnitsData]);

  // Words for the current selected unit
  const currentUnitWords = useMemo(() => {
    if (reviewOverrideWords) return reviewOverrideWords;
    return activeAllWords.filter((w) => w.unit === currentUnit);
  }, [activeAllWords, currentUnit, reviewOverrideWords]);

  // Story for current unit
  const currentStory = useMemo(() => {
    const foundUnitData = currentUnitsData.find((item) => item.unit === currentUnit);
    if (foundUnitData?.story) {
      return foundUnitData.story;
    }
    // Fallback if custom unit has no story
    const sentences = [
      `Welcome to Unit ${currentUnit}. Let us practice our new vocabulary in context.`,
      `Every day we make steady progress by listening, speaking, and reviewing.`,
      `Words like ${currentUnitWords.slice(0, 4).map((w) => w.word).join(', ')} expand our expressive power.`,
      `Through consistent practice, English becomes natural and intuitive.`
    ];
    return {
      unit: currentUnit,
      title: `Unit ${currentUnit} Contextual Story`,
      passage: sentences.join(' '),
      sentences,
      targetWords: currentUnitWords.map((w) => w.word),
    };
  }, [currentUnitsData, currentUnit, currentUnitWords]);

  // Save learning state on change
  const updateLearningState = (updater: (prev: LearningState) => LearningState) => {
    setLearningState((prev) => {
      const next = updater(prev);
      saveLearningState(next);
      return next;
    });
  };

  // Mark word easy/hard
  const handleMarkWord = (wordId: string, status: 'easy' | 'hard') => {
    updateLearningState((prev) => ({
      ...prev,
      masteryStatus: {
        ...prev.masteryStatus,
        [wordId]: status,
      },
    }));
  };

  // Toggle star bookmark
  const handleToggleBookmark = (wordId: string) => {
    updateLearningState((prev) => {
      const current = !!prev.bookmarks[wordId];
      const updatedBookmarks = { ...prev.bookmarks };
      if (current) {
        delete updatedBookmarks[wordId];
      } else {
        updatedBookmarks[wordId] = true;
      }
      return {
        ...prev,
        bookmarks: updatedBookmarks,
      };
    });
  };

  // Record wrong answer in quiz
  const handleRecordWrongWord = (wordId: string) => {
    updateLearningState((prev) => {
      const existing = prev.wrongAnswers[wordId] || { count: 0, lastFailedAt: Date.now() };
      return {
        ...prev,
        wrongAnswers: {
          ...prev.wrongAnswers,
          [wordId]: {
            count: existing.count + 1,
            lastFailedAt: Date.now(),
          },
        },
      };
    });
  };

  // Clear wrong word from review
  const handleClearWrongWord = (wordId: string) => {
    updateLearningState((prev) => {
      const updatedWrong = { ...prev.wrongAnswers };
      delete updatedWrong[wordId];
      return {
        ...prev,
        wrongAnswers: updatedWrong,
        masteryStatus: {
          ...prev.masteryStatus,
          [wordId]: 'easy',
        },
      };
    });
  };

  // Record quiz completion score with composite key b{book}_u{unit}
  const handleRecordQuizCompletion = (score: number, total: number) => {
    updateLearningState((prev) => {
      const compKey = `b${currentBook}_u${currentUnit}`;
      const existing = prev.unitStats[compKey] || prev.unitStats[currentUnit] || {
        flashcardsViewed: 20,
        lastAccessedAt: Date.now(),
      };
      const best = Math.max(existing.quizBestScore || 0, score);
      return {
        ...prev,
        unitStats: {
          ...prev.unitStats,
          [compKey]: {
            ...existing,
            quizBestScore: best,
            quizTotalQuestions: total,
            lastAccessedAt: Date.now(),
          },
          [currentUnit]: {
            ...existing,
            quizBestScore: best,
            quizTotalQuestions: total,
            lastAccessedAt: Date.now(),
          },
        },
      };
    });
  };

  // Record story read completion with composite key b{book}_u{unit}
  const handleRecordStoryCompletion = () => {
    updateLearningState((prev) => {
      const compKey = `b${currentBook}_u${currentUnit}`;
      const existing = prev.unitStats[compKey] || prev.unitStats[currentUnit] || {
        flashcardsViewed: 20,
        lastAccessedAt: Date.now(),
      };
      return {
        ...prev,
        unitStats: {
          ...prev.unitStats,
          [compKey]: {
            ...existing,
            storyCompleted: true,
            lastAccessedAt: Date.now(),
          },
          [currentUnit]: {
            ...existing,
            storyCompleted: true,
            lastAccessedAt: Date.now(),
          },
        },
      };
    });
  };

  // Custom words import / reset
  const handleImportCustomWords = (newWords: WordItem[]) => {
    setCustomWords(newWords);
    saveCustomWords(newWords);
    setCurrentUnit(1);
    setViewMode('home');
  };

  const handleResetToDefault = () => {
    setCustomWords(null);
    saveCustomWords(null);
    setCurrentUnit(1);
  };

  const handleSaveSpeechSettings = (newSettings: SpeechSettings) => {
    setSpeechSettings(newSettings);
    saveSpeechSettings(newSettings);
  };

  // Select unit from anywhere
  const handleSelectUnit = (unit: number, step: LearningStep = 'flashcard') => {
    setCurrentUnit(unit);
    setCurrentStep(step);
    setReviewOverrideWords(null);
    setViewMode('study');
  };

  // Start review flashcards with a custom subset
  const handleStartReviewFlashcards = (selectedWords: WordItem[]) => {
    setReviewOverrideWords(selectedWords);
    setCurrentStep('flashcard');
  };

  // Calculate total mastered count
  const totalMasteredCount = Object.values(learningState.masteryStatus).filter(
    (s) => s === 'easy'
  ).length;

  const currentUnitTitle = unitTitles[currentUnit] || `Unit ${currentUnit}`;
  const { percentage: currentUnitProgressPct } = calculateUnitProgress(
    currentUnit,
    activeAllWords.filter((w) => w.unit === currentUnit),
    learningState,
    currentBook
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors antialiased">
      {/* Top Header */}
      <Header
        currentBook={currentBook}
        onSelectBook={handleSelectBook}
        currentUnit={currentUnit}
        unitTitle={currentUnitTitle}
        onOpenUnitSelector={() => setIsUnitSelectorOpen(true)}
        onOpenCsvManager={() => setIsCsvManagerOpen(true)}
        onOpenAudioSettings={() => setIsAudioSettingsOpen(true)}
        streak={learningState.streak}
        totalMastered={totalMasteredCount}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isHomeView={viewMode === 'home'}
        onGoHome={() => {
          setReviewOverrideWords(null);
          setViewMode('home');
        }}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {viewMode === 'home' ? (
          /* Home Unit Grid Dashboard */
          <HomeUnitGrid
            words={activeAllWords}
            learningState={learningState}
            unitTitles={unitTitles}
            onSelectUnit={handleSelectUnit}
            streak={learningState.streak}
            currentBook={currentBook}
            onSelectBook={handleSelectBook}
          />
        ) : (
          /* Unit 4-Step Spiral Learning Workspace */
          <div className="space-y-4 sm:space-y-6">
            {/* Unit Top Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-850 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setReviewOverrideWords(null);
                    setViewMode('home');
                  }}
                  className="p-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition"
                  title="유닛 목록으로 돌아가기"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${currentBookInfo.colorBadge}`}>
                      Book {currentBook}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black text-white ${currentAccent.bgSolid}`}>
                      Unit {currentUnit}
                    </span>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[240px] sm:max-w-md">
                      {currentUnitTitle}
                    </h2>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-2">
                    <span>진행률: {currentUnitProgressPct}%</span>
                    <span>•</span>
                    <span>20개 핵심 어휘 & 스토리</span>
                  </div>
                </div>
              </div>

              {/* Prev / Next Unit Buttons */}
              <div className="flex items-center justify-end gap-1.5 self-end sm:self-auto">
                <button
                  disabled={currentUnit <= 1}
                  onClick={() => {
                    setReviewOverrideWords(null);
                    setCurrentUnit((u) => Math.max(1, u - 1));
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition"
                >
                  &larr; 이전 유닛
                </button>
                <button
                  disabled={currentUnit >= 30}
                  onClick={() => {
                    setReviewOverrideWords(null);
                    setCurrentUnit((u) => Math.min(30, u + 1));
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition"
                >
                  다음 유닛 &rarr;
                </button>
              </div>
            </div>

            {/* Override alert if studying custom review words */}
            {reviewOverrideWords && (
              <div className={`flex items-center justify-between p-3 rounded-2xl border text-xs ${currentAccent.bg} ${currentAccent.border} ${currentAccent.text}`}>
                <div className="flex items-center gap-2 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    오답노트 / 북마크 단어({reviewOverrideWords.length}개) 집중 복습 모드
                  </span>
                </div>
                <button
                  onClick={() => setReviewOverrideWords(null)}
                  className="underline font-bold hover:opacity-80"
                >
                  원래 Unit {currentUnit} 단어로 복귀
                </button>
              </div>
            )}

            {/* 4-Step Spiral Learning Tab Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/80">
              {/* Step 1: Vocab Flashcard */}
              <button
                onClick={() => setCurrentStep('flashcard')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  currentStep === 'flashcard'
                    ? `bg-white dark:bg-zinc-900 ${currentAccent.text} shadow-xs ring-1 ring-black/5 dark:ring-white/10`
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span className="truncate">Step 1: 플래시카드</span>
              </button>

              {/* Step 2: Smart Quiz */}
              <button
                onClick={() => setCurrentStep('quiz')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  currentStep === 'quiz'
                    ? `bg-white dark:bg-zinc-900 ${currentAccent.text} shadow-xs ring-1 ring-black/5 dark:ring-white/10`
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">Step 2: 스마트 퀴즈</span>
              </button>

              {/* Step 3: Contextual Story */}
              <button
                onClick={() => setCurrentStep('story')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  currentStep === 'story'
                    ? `bg-white dark:bg-zinc-900 ${currentAccent.text} shadow-xs ring-1 ring-black/5 dark:ring-white/10`
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Headphones className="w-4 h-4 shrink-0" />
                <span className="truncate">Step 3: 스토리 리더</span>
              </button>

              {/* Step 4: Review & Bookmark */}
              <button
                onClick={() => setCurrentStep('review')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  currentStep === 'review'
                    ? `bg-white dark:bg-zinc-900 ${currentAccent.text} shadow-xs ring-1 ring-black/5 dark:ring-white/10`
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <BookmarkCheck className="w-4 h-4 shrink-0" />
                <span className="truncate">Step 4: 오답노트</span>
              </button>
            </div>

            {/* Step Body */}
            <div className="py-2">
              {currentStep === 'flashcard' && (
                <FlashcardMode
                  words={currentUnitWords}
                  unitNumber={currentUnit}
                  masteryStatus={learningState.masteryStatus}
                  bookmarks={learningState.bookmarks}
                  onMarkWord={handleMarkWord}
                  onToggleBookmark={handleToggleBookmark}
                  speechSettings={speechSettings}
                  onAllCompleted={() => setCurrentStep('quiz')}
                  accentColor={bookAccentColor}
                />
              )}

              {currentStep === 'quiz' && (
                <SmartQuizMode
                  words={currentUnitWords}
                  allWords={activeAllWords}
                  unitNumber={currentUnit}
                  onRecordWrongWord={handleRecordWrongWord}
                  onRecordQuizCompletion={handleRecordQuizCompletion}
                  onGoToStory={() => setCurrentStep('story')}
                  onGoToReview={() => setCurrentStep('review')}
                  accentColor={bookAccentColor}
                />
              )}

              {currentStep === 'story' && (
                <StoryReaderMode
                  story={currentStory}
                  unitWords={currentUnitWords}
                  allWordsMap={allWordsMap}
                  speechSettings={speechSettings}
                  bookmarks={learningState.bookmarks}
                  onToggleBookmark={handleToggleBookmark}
                  onStoryCompleted={handleRecordStoryCompletion}
                  accentColor={bookAccentColor}
                />
              )}

              {currentStep === 'review' && (
                <ReviewBookmarkMode
                  allWords={activeAllWords}
                  bookmarks={learningState.bookmarks}
                  wrongAnswers={learningState.wrongAnswers}
                  currentUnit={currentUnit}
                  onToggleBookmark={handleToggleBookmark}
                  onClearWrongWord={handleClearWrongWord}
                  onStartReviewFlashcards={handleStartReviewFlashcards}
                  accentColor={bookAccentColor}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <UnitSelectorModal
        isOpen={isUnitSelectorOpen}
        onClose={() => setIsUnitSelectorOpen(false)}
        currentBook={currentBook}
        onSelectBook={handleSelectBook}
        currentUnit={currentUnit}
        onSelectUnit={handleSelectUnit}
        words={activeAllWords}
        learningState={learningState}
        unitTitles={unitTitles}
      />

      <CsvManagerModal
        isOpen={isCsvManagerOpen}
        onClose={() => setIsCsvManagerOpen(false)}
        currentWords={activeAllWords}
        onImportCustomWords={handleImportCustomWords}
        onResetToDefault={handleResetToDefault}
        hasCustomWords={!!customWords}
      />

      <AudioSettingsModal
        isOpen={isAudioSettingsOpen}
        onClose={() => setIsAudioSettingsOpen(false)}
        settings={speechSettings}
        onSaveSettings={handleSaveSpeechSettings}
      />
    </div>
  );
}
