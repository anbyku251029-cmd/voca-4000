import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  BookOpen,
  CheckCircle2,
  X,
  Star,
  ExternalLink,
  Languages,
  HelpCircle,
  Check,
} from 'lucide-react';
import { WordItem, UnitStory, SpeechSettings, AccentColor } from '../types';
import { speechService } from '../services/speech';
import { getAccentClasses } from '../utils/theme';

interface Props {
  story: UnitStory;
  unitWords: WordItem[];
  allWordsMap: Record<string, WordItem>;
  speechSettings: SpeechSettings;
  bookmarks: Record<string, boolean>;
  onToggleBookmark: (wordId: string) => void;
  onStoryCompleted?: () => void;
  accentColor?: AccentColor;
}

export const StoryReaderMode: React.FC<Props> = ({
  story,
  unitWords,
  allWordsMap,
  speechSettings,
  bookmarks,
  onToggleBookmark,
  onStoryCompleted,
  accentColor = 'blue',
}) => {
  const currentAccent = getAccentClasses(accentColor);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(speechSettings.rate || 1.0);
  const [selectedWordPopup, setSelectedWordPopup] = useState<WordItem | null>(null);
  const [isSpeakingPopupWord, setIsSpeakingPopupWord] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);
  const [rcAnswers, setRcAnswers] = useState<Record<string, string>>({});
  const [showRcResults, setShowRcResults] = useState(false);

  const sentenceRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  // When story changes, reset audio state
  useEffect(() => {
    speechService.stop();
    setIsPlaying(false);
    setActiveSentenceIndex(null);
    setSelectedWordPopup(null);
  }, [story.unit]);

  const targetWordsLower = new Set(
    unitWords.map((w) => w.word.toLowerCase())
  );

  // Play a specific sentence
  const playSentence = (index: number) => {
    if (index < 0 || index >= story.sentences.length) {
      setIsPlaying(false);
      setActiveSentenceIndex(null);
      onStoryCompleted?.();
      return;
    }

    setActiveSentenceIndex(index);
    setIsPlaying(true);

    // Auto-scroll sentence into view
    const elem = sentenceRefs.current[index];
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const textToSpeak = story.sentences[index];
    speechService.speak(textToSpeak, {
      rate: playbackRate,
      pitch: speechSettings.pitch,
      voiceURI: speechSettings.voiceURI,
      onEnd: () => {
        // Read next sentence automatically
        if (index + 1 < story.sentences.length) {
          playSentence(index + 1);
        } else {
          setIsPlaying(false);
          setActiveSentenceIndex(null);
          onStoryCompleted?.();
        }
      },
      onError: () => {
        setIsPlaying(false);
      },
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
    } else {
      const startIndex = activeSentenceIndex !== null ? activeSentenceIndex : 0;
      playSentence(startIndex);
    }
  };

  const handleSkipNext = () => {
    speechService.stop();
    const nextIdx = activeSentenceIndex !== null ? activeSentenceIndex + 1 : 0;
    if (nextIdx < story.sentences.length) {
      playSentence(nextIdx);
    } else {
      setIsPlaying(false);
      setActiveSentenceIndex(null);
    }
  };

  const handleSkipPrev = () => {
    speechService.stop();
    const prevIdx = activeSentenceIndex !== null ? Math.max(0, activeSentenceIndex - 1) : 0;
    playSentence(prevIdx);
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlaying && activeSentenceIndex !== null) {
      speechService.stop();
      playSentence(activeSentenceIndex);
    }
  };

  // Click on word to show meaning popup
  const handleWordClick = (rawWord: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
    const found = allWordsMap[clean];
    if (found) {
      setSelectedWordPopup(found);
    }
  };

  // Render sentence with clickable highlight for target vocabulary
  const renderInteractiveSentence = (sentence: string, sIdx: number) => {
    const tokens = sentence.split(/(\s+|[.,!?;:"'()]+)/);

    return (
      <span>
        {tokens.map((token, i) => {
          const cleanToken = token.toLowerCase().replace(/[^a-z]/g, '');
          const isTarget = targetWordsLower.has(cleanToken);

          if (isTarget) {
            return (
              <span
                key={i}
                onClick={(e) => handleWordClick(cleanToken, e)}
                className={`font-extrabold px-1 py-0.5 rounded-md cursor-pointer transition inline-block border-b-2 shadow-2xs ${currentAccent.badge} border-current hover:opacity-90`}
                title="단어 뜻 보기"
              >
                {token}
              </span>
            );
          }
          return <span key={i}>{token}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center pb-24">
      {/* Story Header */}
      <div className="w-full text-center mb-6">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${currentAccent.bg} ${currentAccent.text} ${currentAccent.border}`}>
          <BookOpen className="w-3.5 h-3.5" />
          <span>Unit {story.unit} Contextual Story</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {story.title}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          하이라이트된 핵심 단어를 터치하면 인라인 사전을 바로 확인할 수 있습니다.
        </p>

        {/* Translation Toggle Button */}
        {story.sentenceTranslations && story.sentenceTranslations.length > 0 && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-xs ${
                showTranslations
                  ? `${currentAccent.bgSolid} text-white shadow-md`
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{showTranslations ? '한글 해석 숨기기' : '한글 해석 보기'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Story Reading Passage */}
      <div className="w-full bg-white dark:bg-zinc-850 rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-200/90 dark:border-zinc-750/90 space-y-4 text-left">
        {story.sentences.map((sent, sIdx) => {
          const isActive = activeSentenceIndex === sIdx;
          const translation = story.sentenceTranslations?.[sIdx];

          return (
            <div
              key={sIdx}
              ref={(el) => {
                sentenceRefs.current[sIdx] = el;
              }}
              onClick={() => playSentence(sIdx)}
              className={`p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                isActive
                  ? `${currentAccent.bg} text-zinc-900 dark:text-zinc-50 ring-2 ${currentAccent.ring} shadow-xs`
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              }`}
            >
              <p className="text-base sm:text-lg leading-relaxed">
                <span className="text-xs font-mono font-bold text-zinc-400 mr-2 select-none">
                  {sIdx + 1}
                </span>
                {renderInteractiveSentence(sent, sIdx)}
              </p>
              {showTranslations && translation && (
                <p className="mt-1.5 ml-6 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-normal">
                  {translation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Reading Comprehension Section */}
      {story.readingComprehension && story.readingComprehension.length > 0 && (
        <div className="w-full mt-8 bg-white dark:bg-zinc-850 rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-200/90 dark:border-zinc-750/90 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-700/80 mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${currentAccent.bg} ${currentAccent.text}`}>
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                  독해 이해도 체크 (Reading Comprehension)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  본문 내용을 바탕으로 문제를 풀고 정답을 확인해보세요.
                </p>
              </div>
            </div>
            {Object.keys(rcAnswers).length > 0 && (
              <button
                onClick={() => setShowRcResults(!showRcResults)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${currentAccent.bg} ${currentAccent.text} hover:opacity-80`}
              >
                {showRcResults ? '정답 가리기' : '정답 확인'}
              </button>
            )}
          </div>

          <div className="space-y-6">
            {story.readingComprehension.map((item, idx) => {
              const selected = rcAnswers[item.id];
              return (
                <div key={item.id} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-750">
                  <div className="flex items-start gap-2 mb-3">
                    <span className={`w-6 h-6 rounded-lg text-white font-extrabold text-xs flex items-center justify-center shrink-0 ${currentAccent.bgSolid}`}>
                      Q{idx + 1}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-100">
                      {item.question}
                    </p>
                  </div>

                  {item.options && item.options.length > 1 ? (
                    <div className="space-y-2 ml-8">
                      {item.options.map((opt, optIdx) => {
                        const isChosen = selected === opt;
                        const isCorrectOpt = showRcResults && opt.toLowerCase().includes(item.answer.toLowerCase().slice(0, 10));

                        return (
                          <button
                            key={optIdx}
                            onClick={() => setRcAnswers(prev => ({ ...prev, [item.id]: opt }))}
                            className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-between border ${
                              isCorrectOpt
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold'
                                : isChosen
                                ? `${currentAccent.bg} ${currentAccent.border} ${currentAccent.text} font-semibold`
                                : 'bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750'
                            }`}
                          >
                            <span>{opt}</span>
                            {isChosen && (
                              <Check className={`w-4 h-4 shrink-0 ml-2 ${currentAccent.text}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="ml-8 mt-2">
                      <input
                        type="text"
                        placeholder="정답을 입력하세요..."
                        value={selected || ''}
                        onChange={(e) => setRcAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  )}

                  {showRcResults && (
                    <div className="mt-3 ml-8 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      💡 정답: {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowRcResults(!showRcResults)}
              className={`px-5 py-2.5 rounded-2xl text-white font-bold text-xs shadow-md transition ${currentAccent.button}`}
            >
              {showRcResults ? '정답 가리기' : '정답 및 해설 전체 확인하기'}
            </button>
          </div>
        </div>
      )}

      {/* Inline Popup Dictionary Modal / Bottom Sheet */}
      {selectedWordPopup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  {selectedWordPopup.word}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${currentAccent.badge}`}>
                  {selectedWordPopup.partOfSpeech}
                </span>
                <span className="font-mono text-xs text-zinc-400">
                  {selectedWordPopup.pronunciation}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onToggleBookmark(selectedWordPopup.id)}
                  className={`p-2 rounded-xl transition ${
                    bookmarks[selectedWordPopup.id]
                      ? `${currentAccent.text} ${currentAccent.bg}`
                      : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  title="북마크"
                >
                  <Star
                    className={`w-4 h-4 ${bookmarks[selectedWordPopup.id] ? 'fill-current' : ''}`}
                  />
                </button>
                <button
                  onClick={() => setSelectedWordPopup(null)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3.5 mb-5 text-left">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  영영 정의 (English Definition)
                </div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {selectedWordPopup.definition}
                </p>
              </div>

              {selectedWordPopup.koreanDefinition && (
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                    한글 의미
                  </div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {selectedWordPopup.koreanDefinition}
                  </div>
                </div>
              )}

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  교재 예문 (Example)
                </div>
                <p className={`text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 italic p-2.5 rounded-xl border ${currentAccent.bg} ${currentAccent.border}`}>
                  "{selectedWordPopup.exampleSentence}"
                </p>
                {selectedWordPopup.exampleTranslation && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 pl-1">
                    {selectedWordPopup.exampleTranslation}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsSpeakingPopupWord(true);
                  speechService.speak(selectedWordPopup.word, {
                    rate: playbackRate,
                    pitch: speechSettings.pitch,
                    voiceURI: speechSettings.voiceURI,
                    onEnd: () => setIsSpeakingPopupWord(false),
                    onError: () => setIsSpeakingPopupWord(false),
                  });
                }}
                className={`flex-1 py-3 rounded-2xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${currentAccent.button}`}
              >
                <Volume2 className={`w-4 h-4 ${isSpeakingPopupWord ? 'animate-bounce' : ''}`} />
                <span>원어민 발음 듣기</span>
              </button>
              <button
                onClick={() => setSelectedWordPopup(null)}
                className="px-5 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Audio Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 shadow-2xl p-3 sm:p-4 transition-colors">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Sentence info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold shrink-0 ${currentAccent.text}`}>
                문장 {activeSentenceIndex !== null ? activeSentenceIndex + 1 : 1} / {story.sentences.length}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {activeSentenceIndex !== null
                  ? story.sentences[activeSentenceIndex]
                  : '터치하거나 재생 버튼을 누르세요'}
              </span>
            </div>
            {/* Progress line */}
            <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${currentAccent.progress}`}
                style={{
                  width: `${
                    activeSentenceIndex !== null
                      ? ((activeSentenceIndex + 1) / story.sentences.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Speed selector pills */}
          <div className="flex items-center gap-1 shrink-0 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            {[0.8, 1.0, 1.2].map((spd) => (
              <button
                key={spd}
                onClick={() => handleRateChange(spd)}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition ${
                  playbackRate === spd
                    ? `${currentAccent.bgSolid} text-white shadow-2xs`
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleSkipPrev}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="이전 문장"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className={`w-10 h-10 rounded-2xl text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition ${currentAccent.button}`}
              title={isPlaying ? '일시 정지' : '스토리 읽어주기'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={handleSkipNext}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="다음 문장"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
