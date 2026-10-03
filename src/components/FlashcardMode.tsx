import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Star,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Shuffle,
  Eye,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { WordItem, SpeechSettings, AccentColor } from '../types';
import { speechService } from '../services/speech';
import { getAccentClasses } from '../utils/theme';

interface Props {
  words: WordItem[];
  unitNumber: number;
  masteryStatus: Record<string, 'easy' | 'hard'>;
  bookmarks: Record<string, boolean>;
  onMarkWord: (wordId: string, status: 'easy' | 'hard') => void;
  onToggleBookmark: (wordId: string) => void;
  speechSettings: SpeechSettings;
  onAllCompleted?: () => void;
  accentColor?: AccentColor;
}

export const FlashcardMode: React.FC<Props> = ({
  words,
  unitNumber,
  masteryStatus,
  bookmarks,
  onMarkWord,
  onToggleBookmark,
  speechSettings,
  onAllCompleted,
  accentColor = 'blue',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingSentence, setIsSpeakingSentence] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [displayWords, setDisplayWords] = useState<WordItem[]>(words);

  const currentAccent = getAccentClasses(accentColor);

  useEffect(() => {
    setDisplayWords(words);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffled(false);
  }, [words]);

  const currentWord = displayWords[currentIndex];

  if (!currentWord) {
    return (
      <div className="w-full text-center py-12 bg-white dark:bg-zinc-850 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <Sparkles className={`w-8 h-8 ${currentAccent.text} mx-auto mb-3`} />
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
          표시할 단어가 없습니다
        </h3>
        <p className="text-sm text-zinc-500 mt-1">
          다른 유닛을 선택하거나 필터를 확인해 주세요.
        </p>
      </div>
    );
  }

  const isBookmarked = !!bookmarks[currentWord.id];
  const wordStatus = masteryStatus[currentWord.id];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < displayWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onAllCompleted?.();
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleToggleShuffle = () => {
    if (shuffled) {
      setDisplayWords(words);
      setShuffled(false);
      setCurrentIndex(0);
    } else {
      const copy = [...displayWords].sort(() => Math.random() - 0.5);
      setDisplayWords(copy);
      setShuffled(true);
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  };

  const handleSpeakWord = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsSpeaking(true);
    speechService.speak(text, {
      rate: speechSettings.rate,
      pitch: speechSettings.pitch,
      voiceURI: speechSettings.voiceURI,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleSpeakSentence = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsSpeakingSentence(true);
    speechService.speak(text, {
      rate: speechSettings.rate,
      pitch: speechSettings.pitch,
      voiceURI: speechSettings.voiceURI,
      onEnd: () => setIsSpeakingSentence(false),
      onError: () => setIsSpeakingSentence(false),
    });
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'KeyV') {
        e.preventDefault();
        if (currentWord) handleSpeakWord(currentWord.word);
      } else if (e.code === 'KeyB') {
        e.preventDefault();
        if (currentWord) onToggleBookmark(currentWord.id);
      } else if (e.code === 'Digit1') {
        e.preventDefault();
        if (currentWord) onMarkWord(currentWord.id, 'hard');
      } else if (e.code === 'Digit2') {
        e.preventDefault();
        if (currentWord) onMarkWord(currentWord.id, 'easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, displayWords, currentWord, isFlipped]);

  // Auto play speech when word changes if enabled
  useEffect(() => {
    if (speechSettings.autoPlay && currentWord) {
      const timer = setTimeout(() => {
        handleSpeakWord(currentWord.word);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentWord, speechSettings.autoPlay]);

  const handleMark = (status: 'easy' | 'hard') => {
    onMarkWord(currentWord.id, status);
    // Auto advance to next card
    setTimeout(() => {
      handleNext();
    }, 180);
  };

  // Helper to render bold target word in example sentence
  const renderHighlightedSentence = (sentence: string, targetWord: string) => {
    if (!sentence) return null;
    const parts = sentence.split(/(\s+)/);
    return (
      <span>
        {parts.map((part, i) => {
          const isTarget = part.toLowerCase().startsWith(targetWord.toLowerCase().slice(0, 4));
          return isTarget ? (
            <span
              key={i}
              className={`font-black underline decoration-2 underline-offset-2 ${currentAccent.text}`}
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </span>
    );
  };

  // Calculate unit mastery progress
  const easyCount = words.filter((w) => masteryStatus[w.id] === 'easy').length;
  const hardCount = words.filter((w) => masteryStatus[w.id] === 'hard').length;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Top Controls & Status Bar */}
      <div className="w-full flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            {currentIndex + 1} / {displayWords.length}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400">
              알아요 {easyCount}
            </span>
            <span className="text-zinc-300 dark:text-zinc-600">|</span>
            <span className="text-rose-500">
              어려워요 {hardCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleShuffle}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition ${
              shuffled
                ? `${currentAccent.bg} ${currentAccent.text} border ${currentAccent.border}`
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="단어 무작위 셔플"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">셔플</span>
          </button>

          <button
            onClick={() => onToggleBookmark(currentWord.id)}
            className={`p-2 rounded-xl transition ${
              isBookmarked
                ? `${currentAccent.text} ${currentAccent.bg}`
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={isBookmarked ? '북마크 해제' : '북마크 추가'}
          >
            <Star
              className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-300 ${currentAccent.progress}`}
          style={{ width: `${((currentIndex + 1) / displayWords.length) * 100}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="w-full h-[360px] sm:h-[400px] perspective-1000 cursor-pointer select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`w-full h-full relative duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front (Word, Pronunciation, POS, Audio) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-white dark:bg-zinc-850 p-6 sm:p-8 flex flex-col justify-between shadow-xl border border-zinc-200/90 dark:border-zinc-700/80">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${currentAccent.bg} ${currentAccent.text} ${currentAccent.border}`}
              >
                {currentWord.partOfSpeech || 'word'}
              </span>

              {wordStatus && (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    wordStatus === 'easy'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  }`}
                >
                  {wordStatus === 'easy' ? '알아요 (Easy)' : '모르겠어요 (Hard)'}
                </span>
              )}
            </div>

            {/* Center Content */}
            <div className="text-center py-6">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
                {currentWord.word}
              </h2>
              <div className="font-mono text-zinc-500 dark:text-zinc-400 text-base sm:text-lg mb-6">
                {currentWord.pronunciation}
              </div>

              {/* Speaker Button */}
              <button
                onClick={(e) => handleSpeakWord(currentWord.word, e)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-xs ${
                  isSpeaking
                    ? `${currentAccent.bgSolid} text-white scale-105 ring-4 ${currentAccent.ring}`
                    : `${currentAccent.bg} ${currentAccent.text} hover:opacity-90`
                }`}
              >
                <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span>원어민 발음 듣기</span>
              </button>
            </div>

            {/* Bottom flip hint */}
            <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>카드를 탭하여 영영 정의 및 예문 확인</span>
            </div>
          </div>

          {/* Card Back (Definition, Korean Translation, Example Sentence, Audio) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-zinc-900 text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl border border-zinc-800">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${currentAccent.text}`}>
                Meaning & Context
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {currentWord.partOfSpeech}
              </span>
            </div>

            {/* Back Middle: English Definition & Korean & Example */}
            <div className="space-y-4 my-auto overflow-y-auto max-h-[250px] pr-1">
              {/* Definition */}
              <div>
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  English Definition
                </div>
                <p className="text-base sm:text-lg font-bold text-zinc-100 leading-snug">
                  {currentWord.definition}
                </p>
              </div>

              {/* Korean definition */}
              {currentWord.koreanDefinition && (
                <div className="p-2.5 rounded-xl bg-zinc-800/70 border border-zinc-700/60">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                    한글 의미 가이드
                  </div>
                  <div className="text-sm font-semibold text-zinc-200">
                    {currentWord.koreanDefinition}
                  </div>
                </div>
              )}

              {/* Example Sentence */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${currentAccent.text}`}
                  >
                    Example Sentence
                  </span>
                  <button
                    onClick={(e) => handleSpeakSentence(currentWord.exampleSentence, e)}
                    className={`flex items-center gap-1 text-[11px] hover:underline ${currentAccent.text}`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeakingSentence ? 'animate-pulse' : ''}`} />
                    <span>예문 듣기</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 italic bg-zinc-800/40 p-3 rounded-xl border border-zinc-800">
                  "{renderHighlightedSentence(currentWord.exampleSentence, currentWord.word)}"
                </p>
                {currentWord.exampleTranslation && (
                  <p className="text-xs text-zinc-400 mt-1 pl-1">
                    {currentWord.exampleTranslation}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom tap to flip back */}
            <div className="text-center text-xs text-zinc-400 flex items-center justify-center gap-1.5 pt-2 border-t border-zinc-800">
              <RotateCw className="w-3.5 h-3.5" />
              <span>카드를 탭하여 단어 앞면으로 돌아가기</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: "모르겠어요 (Hard)" / "알아요 (Easy)" */}
      <div className="w-full grid grid-cols-2 gap-3 mt-5">
        <button
          onClick={() => handleMark('hard')}
          className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-xs ${
            wordStatus === 'hard'
              ? 'bg-rose-500 text-white shadow-rose-500/20'
              : 'bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40'
          }`}
        >
          <X className="w-4 h-4" />
          <span>모르겠어요 (Hard)</span>
        </button>

        <button
          onClick={() => handleMark('easy')}
          className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-xs ${
            wordStatus === 'easy'
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>알아요 (Easy)</span>
        </button>
      </div>

      {/* Navigation Controls: Prev / Next */}
      <div className="w-full flex items-center justify-between mt-4">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>이전 단어</span>
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
        >
          {isFlipped ? '단어 보기' : '뜻 보기'}
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold transition"
        >
          <span>다음 단어</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
