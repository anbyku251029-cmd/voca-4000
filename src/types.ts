export interface WordItem {
  id: string; // e.g. "u1_1"
  unit: number; // 1 to 30
  order: number; // 1 to 20
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  koreanDefinition?: string;
  exampleSentence: string;
  exampleTranslation?: string;
  exerciseQuestion?: string;
}

export interface UnitStory {
  unit: number;
  title: string;
  passage: string; // Full text
  sentences: string[]; // Segmented for audio highlighting
  sentenceTranslations?: string[]; // Korean translation per sentence
  targetWords: string[];
  readingComprehension?: {
    id: string;
    question: string;
    options?: string[];
    answer: string;
  }[];
}

export type BookLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type AccentColor = 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'teal';

export interface LearningState {
  // Word ID -> status: 'easy' (mastered) | 'hard' (needs work)
  masteryStatus: Record<string, 'easy' | 'hard'>;
  // Word ID -> boolean (starred bookmark)
  bookmarks: Record<string, boolean>;
  // Word ID -> mistake count
  wrongAnswers: Record<string, { count: number; lastFailedAt: number }>;
  // Composite key (e.g. "b1_u1") or legacy unit number -> completion stats
  unitStats: Record<string | number, {
    flashcardsViewed: number;
    quizBestScore?: number;
    quizTotalQuestions?: number;
    storyCompleted?: boolean;
    lastAccessedAt: number;
  }>;
  streak: number;
  lastStudyDate: string;
}

export type LearningStep = 'flashcard' | 'quiz' | 'story' | 'review';

export interface QuizQuestion {
  id: string;
  word: WordItem;
  type: 'definition' | 'fill_blank';
  prompt: string;
  blankSentence?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface SpeechSettings {
  rate: number; // 0.8, 1.0, 1.2
  pitch: number;
  autoPlay: boolean;
  voiceURI?: string;
}
