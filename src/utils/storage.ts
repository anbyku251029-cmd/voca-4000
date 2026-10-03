import { LearningState, WordItem, SpeechSettings } from '../types';

const STORAGE_KEY_STATE = 'essential_vocab_learning_state_v1';
const STORAGE_KEY_CUSTOM_WORDS = 'essential_vocab_custom_words_v1';
const STORAGE_KEY_THEME = 'essential_vocab_theme';
const STORAGE_KEY_SPEECH = 'essential_vocab_speech_settings';

export const initialLearningState: LearningState = {
  masteryStatus: {},
  bookmarks: {},
  wrongAnswers: {},
  unitStats: {},
  streak: 1,
  lastStudyDate: new Date().toISOString().split('T')[0]
};

export function loadLearningState(): LearningState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATE);
    if (!raw) return initialLearningState;
    const parsed = JSON.parse(raw);

    // Update daily streak
    const today = new Date().toISOString().split('T')[0];
    let currentStreak = parsed.streak || 1;
    if (parsed.lastStudyDate) {
      const lastDate = new Date(parsed.lastStudyDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        // Consecutive day
        currentStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        currentStreak = 1;
      }
    }

    return {
      ...initialLearningState,
      ...parsed,
      streak: currentStreak,
      lastStudyDate: today
    };
  } catch (e) {
    console.error('Failed to load learning state:', e);
    return initialLearningState;
  }
}

export function saveLearningState(state: LearningState): void {
  try {
    localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save learning state:', e);
  }
}

export function loadCustomWords(): WordItem[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_WORDS);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom words:', e);
    return null;
  }
}

export function saveCustomWords(words: WordItem[] | null): void {
  try {
    if (!words) {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_WORDS);
    } else {
      localStorage.setItem(STORAGE_KEY_CUSTOM_WORDS, JSON.stringify(words));
    }
  } catch (e) {
    console.error('Failed to save custom words:', e);
  }
}

export function loadSpeechSettings(): SpeechSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SPEECH);
    if (!raw) return { rate: 1.0, pitch: 1.0, autoPlay: false };
    return JSON.parse(raw);
  } catch {
    return { rate: 1.0, pitch: 1.0, autoPlay: false };
  }
}

export function saveSpeechSettings(settings: SpeechSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SPEECH, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save speech settings:', e);
  }
}

export function loadThemePreference(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveThemePreference(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}

export function calculateUnitProgress(
  unitNumber: number,
  unitWords: WordItem[],
  state: LearningState,
  bookId?: number
): {
  percentage: number;
  masteredCount: number;
  totalCount: number;
  quizScorePercent?: number;
  storyRead: boolean;
} {
  const total = unitWords.length || 20;
  let mastered = 0;

  for (const w of unitWords) {
    if (state.masteryStatus[w.id] === 'easy') {
      mastered++;
    }
  }

  const compositeKey = bookId ? `b${bookId}_u${unitNumber}` : undefined;
  const uStat = (compositeKey && state.unitStats[compositeKey]) || state.unitStats[unitNumber];
  const storyRead = !!uStat?.storyCompleted;
  const quizScorePercent =
    uStat?.quizTotalQuestions && uStat.quizTotalQuestions > 0
      ? Math.round(((uStat.quizBestScore || 0) / uStat.quizTotalQuestions) * 100)
      : undefined;

  const percentage = Math.min(100, Math.round((mastered / total) * 100));

  return {
    percentage,
    masteredCount: mastered,
    totalCount: total,
    quizScorePercent,
    storyRead
  };
}
