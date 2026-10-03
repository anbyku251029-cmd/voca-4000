import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  Award,
  RefreshCw,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { WordItem, QuizQuestion, AccentColor } from '../types';
import { speechService } from '../services/speech';
import { getAccentClasses } from '../utils/theme';

interface Props {
  words: WordItem[];
  allWords: WordItem[];
  unitNumber: number;
  onRecordWrongWord: (wordId: string) => void;
  onRecordQuizCompletion: (score: number, total: number) => void;
  onGoToStory: () => void;
  onGoToReview: () => void;
  accentColor?: AccentColor;
}

export const SmartQuizMode: React.FC<Props> = ({
  words,
  allWords,
  unitNumber,
  onRecordWrongWord,
  onRecordQuizCompletion,
  onGoToStory,
  onGoToReview,
  accentColor = 'blue',
}) => {
  const currentAccent = getAccentClasses(accentColor);
  const [quizType, setQuizType] = useState<'mixed' | 'definition' | 'blank' | 'exercise'>('mixed');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [failedQuestions, setFailedQuestions] = useState<QuizQuestion[]>([]);
  const [streakCombo, setStreakCombo] = useState(0);

  // Check if unit words have exercise questions
  const hasExerciseQuestions = words.some((w) => !!w.exerciseQuestion);

  // Generate quiz questions
  const generateQuiz = (type: 'mixed' | 'definition' | 'blank' | 'exercise') => {
    if (!words || words.length === 0) return;

    // Shuffle unit words
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const newQuestions: QuizQuestion[] = [];

    shuffledWords.forEach((targetWord, idx) => {
      // Determine question type
      let qType: 'definition' | 'fill_blank' = 'definition';
      if (type === 'blank') qType = 'fill_blank';
      else if (type === 'definition') qType = 'definition';
      else if (type === 'exercise' && targetWord.exerciseQuestion) {
        // Parse exercise question
        const rawQ = targetWord.exerciseQuestion;
        const answerMatch = rawQ.match(/\[정답:\s*([^\]]+)\]/);
        const answerText = answerMatch ? answerMatch[1].trim() : targetWord.word;

        // Extract options if format has (a. ... / b. ...)
        const optMatch = rawQ.match(/\(([^)]+)\)/);
        let parsedOpts: { id: string; text: string; isCorrect: boolean }[] = [];

        if (optMatch) {
          const rawOpts = optMatch[1].split('/').map((o) => o.trim());
          const cleanAnswer = answerText.replace(/^[a-d]\.\s*/i, '').trim().toLowerCase();
          const answerLetterMatch = answerText.match(/^([a-d])\./i);
          const answerLetter = answerLetterMatch ? answerLetterMatch[1].toLowerCase() : null;

          parsedOpts = rawOpts.map((opt, oIdx) => {
            const cleanOpt = opt.replace(/^[a-d]\.\s*/i, '').trim().toLowerCase();
            const optLetterMatch = opt.match(/^([a-d])\./i);
            const optLetter = optLetterMatch ? optLetterMatch[1].toLowerCase() : null;

            let isMatch = false;
            if (answerLetter && optLetter) {
              isMatch = answerLetter === optLetter;
            } else if (cleanAnswer === cleanOpt) {
              isMatch = true;
            } else if (cleanAnswer.includes(cleanOpt) || cleanOpt.includes(cleanAnswer)) {
              isMatch = true;
            }
            return {
              id: `opt_${oIdx}_${targetWord.id}`,
              text: opt,
              isCorrect: isMatch,
            };
          });

          // Ensure exactly one option is marked correct!
          const correctCount = parsedOpts.filter((o) => o.isCorrect).length;
          if (correctCount === 0 && parsedOpts.length > 0) {
            parsedOpts[0].isCorrect = true;
          } else if (correctCount > 1) {
            let firstFound = false;
            parsedOpts = parsedOpts.map((o) => {
              if (o.isCorrect) {
                if (!firstFound) {
                  firstFound = true;
                  return o;
                }
                return { ...o, isCorrect: false };
              }
              return o;
            });
          }
        }

        // If options could not be cleanly parsed or only 1 option found
        if (parsedOpts.length < 2) {
          const distractorPool = words
            .filter((w) => w.id !== targetWord.id && w.word !== targetWord.word)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

          parsedOpts = [
            { id: targetWord.id, text: answerText, isCorrect: true },
            ...distractorPool.map((d) => ({ id: d.id, text: d.word, isCorrect: false })),
          ].sort(() => Math.random() - 0.5);
        }

        // Clean prompt by removing [정답: ...] part
        const cleanPrompt = rawQ.replace(/\[정답:[^\]]+\]/, '').trim();

        newQuestions.push({
          id: `q_ex_${idx}_${targetWord.id}`,
          word: targetWord,
          type: 'definition',
          prompt: `교재 실전 연습문제:`,
          blankSentence: cleanPrompt,
          options: parsedOpts,
          explanation: `정답: ${answerText} | 단어: "${targetWord.word}" (${targetWord.koreanDefinition || targetWord.definition})`,
        });
        return;
      } else {
        qType = idx % 2 === 0 ? 'definition' : 'fill_blank';
      }

      // Pick 3 distractors from unit or global words
      const distractorPool = words
        .filter(
          (w) =>
            w.id !== targetWord.id &&
            w.word !== targetWord.word &&
            w.definition !== targetWord.definition
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      if (distractorPool.length < 3) {
        // Fallback from global words if unit has few words
        const additional = allWords
          .filter(
            (w) =>
              w.id !== targetWord.id &&
              w.word !== targetWord.word &&
              w.definition !== targetWord.definition &&
              !distractorPool.some((d) => d.id === w.id)
          )
          .slice(0, 3 - distractorPool.length);
        distractorPool.push(...additional);
      }

      if (qType === 'definition') {
        const isWordToDef = Math.random() > 0.3; // 70% word to definition, 30% def to word

        if (isWordToDef) {
          const options = [
            { id: targetWord.id, text: targetWord.definition, isCorrect: true },
            ...distractorPool.map((d) => ({ id: d.id, text: d.definition, isCorrect: false })),
          ].sort(() => Math.random() - 0.5);

          newQuestions.push({
            id: `q_${idx}_${targetWord.id}`,
            word: targetWord,
            type: 'definition',
            prompt: `다음 단어의 올바른 영영 정의를 고르세요:`,
            options,
            explanation: `"${targetWord.word}" (${targetWord.partOfSpeech})는 "${targetWord.definition}"을(를) 의미합니다.`,
          });
        } else {
          const options = [
            {
              id: targetWord.id,
              text: `${targetWord.word} (${targetWord.partOfSpeech})`,
              isCorrect: true,
            },
            ...distractorPool.map((d) => ({
              id: d.id,
              text: `${d.word} (${d.partOfSpeech})`,
              isCorrect: false,
            })),
          ].sort(() => Math.random() - 0.5);

          newQuestions.push({
            id: `q_${idx}_${targetWord.id}`,
            word: targetWord,
            type: 'definition',
            prompt: `다음 영영 정의에 해당하는 단어를 고르세요:`,
            options,
            explanation: `정답: "${targetWord.word}" - ${targetWord.definition}`,
          });
        }
      } else {
        // Fill in the blank
        const sentence = targetWord.exampleSentence;
        const blankRegex = new RegExp(`\\b${targetWord.word}[a-zA-Z]*\\b`, 'i');
        const blankSentence = sentence.replace(blankRegex, '________');

        const options = [
          { id: targetWord.id, text: targetWord.word, isCorrect: true },
          ...distractorPool.map((d) => ({ id: d.id, text: d.word, isCorrect: false })),
        ].sort(() => Math.random() - 0.5);

        newQuestions.push({
          id: `q_${idx}_${targetWord.id}`,
          word: targetWord,
          type: 'fill_blank',
          prompt: `예문의 빈칸에 들어갈 가장 알맞은 단어를 고르세요:`,
          blankSentence,
          options,
          explanation: `원문: "${targetWord.exampleSentence}"`,
        });
      }
    });

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setQuizFinished(false);
    setFailedQuestions([]);
    setStreakCombo(0);
  };

  useEffect(() => {
    generateQuiz(quizType);
  }, [words, unitNumber]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: { id: string; text: string; isCorrect: boolean }) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.isCorrect) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      setStreakCombo((prev) => prev + 1);
    } else {
      setIsCorrect(false);
      setStreakCombo(0);
      onRecordWrongWord(currentQ.word.id);
      setFailedQuestions((prev) => [...prev, currentQ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setQuizFinished(true);
      onRecordQuizCompletion(score + (isCorrect ? 1 : 0), questions.length);
    }
  };

  const handleSpeak = (text: string) => {
    speechService.speak(text);
  };

  // Keyboard shortcut: numbers 1, 2, 3, 4 to choose option, Space / Enter for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (!isAnswered && currentQ?.options) {
        if (e.key === '1' && currentQ.options[0]) handleSelectOption(currentQ.options[0]);
        else if (e.key === '2' && currentQ.options[1]) handleSelectOption(currentQ.options[1]);
        else if (e.key === '3' && currentQ.options[2]) handleSelectOption(currentQ.options[2]);
        else if (e.key === '4' && currentQ.options[3]) handleSelectOption(currentQ.options[3]);
      } else if (isAnswered && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQ, currentIndex, questions.length]);

  if (quizFinished) {
    const accuracy = Math.round((score / (questions.length || 1)) * 100);

    return (
      <div className="w-full max-w-lg mx-auto bg-white dark:bg-zinc-850 rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-200/90 dark:border-zinc-750/90 text-center animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center mb-4">
          <Award className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-1">
          Unit {unitNumber} 퀴즈 완료!
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          학습한 단어들을 훌륭하게 테스트하였습니다.
        </p>

        {/* Score Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
          <div>
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              획득 점수
            </div>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              {score} / {questions.length}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              정답률
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Failed words note */}
        {failedQuestions.length > 0 && (
          <div className="text-left mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
            <div className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 shrink-0" />
              오답노트에 {failedQuestions.length}개 단어가 자동 저장되었습니다:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {failedQuestions.map((q) => (
                <span
                  key={q.id}
                  onClick={() => handleSpeak(q.word.word)}
                  className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-zinc-900 text-rose-700 dark:text-rose-300 rounded-lg border border-rose-200 dark:border-rose-800 cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/40 flex items-center gap-1"
                >
                  {q.word.word}
                  <Volume2 className="w-3 h-3 text-rose-400" />
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => generateQuiz(quizType)}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white shadow-md transition flex items-center justify-center gap-2 ${currentAccent.button}`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>퀴즈 다시 풀기</span>
          </button>

          {failedQuestions.length > 0 && (
            <button
              onClick={onGoToReview}
              className="w-full py-3 px-4 rounded-2xl font-bold text-sm bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 transition flex items-center justify-center gap-2"
            >
              <span>오답노트에서 틀린 단어 복습</span>
            </button>
          )}

          <button
            onClick={onGoToStory}
            className="w-full py-3 px-4 rounded-2xl font-bold text-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Step 3: 스토리 오디오 리더로 이동 &rarr;</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return <div className="py-12 text-center text-zinc-500">퀴즈 로딩 중...</div>;
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Quiz Filter Tabs & Stats Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        {/* Mode selector pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold overflow-x-auto max-w-[280px] sm:max-w-none">
          <button
            onClick={() => {
              setQuizType('mixed');
              generateQuiz('mixed');
            }}
            className={`px-2 py-1 rounded-lg transition shrink-0 ${
              quizType === 'mixed'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            종합
          </button>
          <button
            onClick={() => {
              setQuizType('definition');
              generateQuiz('definition');
            }}
            className={`px-2 py-1 rounded-lg transition shrink-0 ${
              quizType === 'definition'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            뜻 맞추기
          </button>
          <button
            onClick={() => {
              setQuizType('blank');
              generateQuiz('blank');
            }}
            className={`px-2 py-1 rounded-lg transition shrink-0 ${
              quizType === 'blank'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            예문 빈칸
          </button>
          {hasExerciseQuestions && (
            <button
              onClick={() => {
                setQuizType('exercise');
                generateQuiz('exercise');
              }}
              className={`px-2 py-1 rounded-lg transition shrink-0 flex items-center gap-1 ${
                quizType === 'exercise'
                  ? `${currentAccent.bgSolid} text-white shadow-xs`
                  : `${currentAccent.text} hover:opacity-80`
              }`}
            >
              <span>실전 문제</span>
              <span className={`w-1.5 h-1.5 rounded-full ${currentAccent.bgSolid}`} />
            </button>
          )}
        </div>

        {/* Combo Badge */}
        {streakCombo > 1 && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-bold animate-bounce shadow-xs ${currentAccent.bgSolid}`}>
            <Sparkles className="w-3 h-3" />
            <span>{streakCombo}연속 정답!</span>
          </div>
        )}

        {/* Index counter */}
        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
          Q {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-300 ${currentAccent.progress}`}
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 shadow-lg mb-4 text-left">
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${currentAccent.text}`}>
          {currentQ.type === 'fill_blank' ? 'Fill In The Blank (예문 빈칸)' : 'Definition Match (뜻 맞추기)'}
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          {currentQ.prompt}
        </p>

        {/* Target display */}
        {currentQ.type === 'fill_blank' ? (
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 font-medium text-base sm:text-lg text-zinc-800 dark:text-zinc-100 leading-relaxed">
            "{currentQ.blankSentence}"
          </div>
        ) : (
          <div className={`flex items-center justify-between p-4 rounded-2xl border ${currentAccent.bg} ${currentAccent.border}`}>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {currentQ.word.word}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                {currentQ.word.pronunciation} • {currentQ.word.partOfSpeech}
              </div>
            </div>
            <button
              onClick={() => handleSpeak(currentQ.word.word)}
              className={`p-2.5 rounded-xl transition shadow-xs ${currentAccent.bg} ${currentAccent.text} hover:opacity-80`}
              title="발음 듣기"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* 4 Choices */}
      <div className="w-full space-y-2.5 mb-4">
        {currentQ.options.map((opt, i) => {
          let btnStyle = 'bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600';

          if (isAnswered) {
            if (opt.isCorrect) {
              btnStyle = `${currentAccent.bg} border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold ring-2 ring-emerald-400/50`;
            } else if (selectedOptionId === opt.id) {
              btnStyle =
                'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-300 font-bold';
            } else {
              btnStyle = 'opacity-40 bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800';
            }
          }

          return (
            <button
              key={opt.id + i}
              disabled={isAnswered}
              onClick={() => handleSelectOption(opt)}
              className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all shadow-xs flex items-center justify-between ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="leading-snug">{opt.text}</span>
              </div>
              {isAnswered && opt.isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
              )}
              {isAnswered && !opt.isCorrect && selectedOptionId === opt.id && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate Feedback Card on Answer */}
      {isAnswered && (
        <div
          className={`w-full p-4 rounded-2xl border mb-4 text-left animate-in slide-in-from-bottom-2 ${
            isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>정답입니다! 훌륭합니다.</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>아쉽네요! 오답노트에 추가되었습니다.</span>
              </>
            )}
          </div>
          <p className="text-xs leading-relaxed opacity-90">{currentQ.explanation}</p>
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <button
          onClick={handleNextQuestion}
          className={`w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${currentAccent.button}`}
        >
          <span>
            {currentIndex < questions.length - 1 ? '다음 문제로 &rarr;' : '퀴즈 결과 보기'}
          </span>
        </button>
      )}
    </div>
  );
};
