import { BookLevel, AccentColor } from '../types';

export interface BookInfo {
  book: BookLevel;
  name: string;
  subtitle: string;
  accent: AccentColor;
  themeLabel: string;
  colorBadge: string;
  activeText: string;
  activeBg: string;
  gradientFrom: string;
  gradientTo: string;
  bannerGradient: string;
  heroBadgeText: string;
  progressBarColor: string;
  ringColor: string;
}

export const BOOKS_CONFIG: BookInfo[] = [
  {
    book: 1,
    name: 'Book 1 (Level 1)',
    subtitle: '기초 필수 600단어',
    accent: 'amber',
    themeLabel: '주황/호박',
    colorBadge: 'bg-amber-500 text-white',
    activeText: 'text-amber-600 dark:text-amber-400',
    activeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-600',
    bannerGradient: 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-amber-500/15',
    heroBadgeText: 'text-amber-200',
    progressBarColor: 'bg-amber-500',
    ringColor: 'ring-amber-500/30',
  },
  {
    book: 2,
    name: 'Book 2 (Level 2)',
    subtitle: '핵심 확장 600단어',
    accent: 'emerald',
    themeLabel: '에메랄드/초록',
    colorBadge: 'bg-emerald-600 text-white',
    activeText: 'text-emerald-600 dark:text-emerald-400',
    activeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800',
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-teal-600',
    bannerGradient: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 shadow-emerald-700/20',
    heroBadgeText: 'text-emerald-200',
    progressBarColor: 'bg-emerald-500',
    ringColor: 'ring-emerald-500/30',
  },
  {
    book: 3,
    name: 'Book 3 (Level 3)',
    subtitle: '심화 실전 600단어',
    accent: 'blue',
    themeLabel: '사파이어/파랑',
    colorBadge: 'bg-blue-600 text-white',
    activeText: 'text-blue-600 dark:text-blue-400',
    activeBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-indigo-600',
    bannerGradient: 'bg-gradient-to-br from-blue-700 via-indigo-700 to-sky-900 shadow-blue-700/20',
    heroBadgeText: 'text-blue-200',
    progressBarColor: 'bg-blue-500',
    ringColor: 'ring-blue-500/30',
  },
  {
    book: 4,
    name: 'Book 4 (Level 4)',
    subtitle: '고급 응용 600단어',
    accent: 'purple',
    themeLabel: '바이올렛/보라',
    colorBadge: 'bg-purple-600 text-white',
    activeText: 'text-purple-600 dark:text-purple-400',
    activeBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-fuchsia-600',
    bannerGradient: 'bg-gradient-to-br from-purple-700 via-fuchsia-800 to-purple-950 shadow-purple-700/25',
    heroBadgeText: 'text-purple-200',
    progressBarColor: 'bg-purple-500',
    ringColor: 'ring-purple-500/30',
  },
  {
    book: 5,
    name: 'Book 5 (Level 5)',
    subtitle: '학술 심층 600단어',
    accent: 'rose',
    themeLabel: '로즈/진홍',
    colorBadge: 'bg-rose-600 text-white',
    activeText: 'text-rose-600 dark:text-rose-400',
    activeBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800',
    gradientFrom: 'from-rose-600',
    gradientTo: 'to-red-600',
    bannerGradient: 'bg-gradient-to-br from-rose-700 via-red-800 to-rose-950 shadow-rose-700/25',
    heroBadgeText: 'text-rose-200',
    progressBarColor: 'bg-rose-500',
    ringColor: 'ring-rose-500/30',
  },
  {
    book: 6,
    name: 'Book 6 (Level 6)',
    subtitle: '최고급 마스터 600단어',
    accent: 'teal',
    themeLabel: '틸/청록',
    colorBadge: 'bg-teal-600 text-white',
    activeText: 'text-teal-600 dark:text-teal-400',
    activeBg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800',
    gradientFrom: 'from-teal-600',
    gradientTo: 'to-cyan-600',
    bannerGradient: 'bg-gradient-to-br from-teal-700 via-cyan-800 to-teal-950 shadow-teal-700/25',
    heroBadgeText: 'text-teal-200',
    progressBarColor: 'bg-teal-500',
    ringColor: 'ring-teal-500/30',
  },
];

export function getBookInfo(book: BookLevel): BookInfo {
  return BOOKS_CONFIG.find((b) => b.book === book) || BOOKS_CONFIG[0];
}

export function getBookAccent(book: BookLevel): AccentColor {
  return getBookInfo(book).accent;
}

export function getAccentClasses(accent: AccentColor = 'blue') {
  switch (accent) {
    case 'amber':
      return {
        text: 'text-amber-600 dark:text-amber-400',
        textDark: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        bgSolid: 'bg-amber-500',
        bgHover: 'hover:bg-amber-600',
        border: 'border-amber-300 dark:border-amber-800',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        button: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25',
        ring: 'ring-amber-400',
        progress: 'bg-amber-500',
        headerIcon: 'bg-gradient-to-tr from-amber-500 to-amber-400 shadow-amber-500/25',
      };
    case 'emerald':
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        textDark: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        bgSolid: 'bg-emerald-600',
        bgHover: 'hover:bg-emerald-700',
        border: 'border-emerald-300 dark:border-emerald-800',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25',
        ring: 'ring-emerald-400',
        progress: 'bg-emerald-500',
        headerIcon: 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/25',
      };
    case 'purple':
      return {
        text: 'text-purple-600 dark:text-purple-400',
        textDark: 'text-purple-500',
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        bgSolid: 'bg-purple-600',
        bgHover: 'hover:bg-purple-700',
        border: 'border-purple-300 dark:border-purple-800',
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
        button: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25',
        ring: 'ring-purple-400',
        progress: 'bg-purple-500',
        headerIcon: 'bg-gradient-to-tr from-purple-600 to-fuchsia-500 shadow-purple-500/25',
      };
    case 'rose':
      return {
        text: 'text-rose-600 dark:text-rose-400',
        textDark: 'text-rose-500',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        bgSolid: 'bg-rose-600',
        bgHover: 'hover:bg-rose-700',
        border: 'border-rose-300 dark:border-rose-800',
        badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
        button: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
        ring: 'ring-rose-400',
        progress: 'bg-rose-500',
        headerIcon: 'bg-gradient-to-tr from-rose-600 to-red-500 shadow-rose-500/25',
      };
    case 'teal':
      return {
        text: 'text-teal-600 dark:text-teal-400',
        textDark: 'text-teal-500',
        bg: 'bg-teal-50 dark:bg-teal-950/40',
        bgSolid: 'bg-teal-600',
        bgHover: 'hover:bg-teal-700',
        border: 'border-teal-300 dark:border-teal-800',
        badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
        button: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25',
        ring: 'ring-teal-400',
        progress: 'bg-teal-500',
        headerIcon: 'bg-gradient-to-tr from-teal-600 to-cyan-500 shadow-teal-500/25',
      };
    case 'blue':
    default:
      return {
        text: 'text-blue-600 dark:text-blue-400',
        textDark: 'text-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        bgSolid: 'bg-blue-600',
        bgHover: 'hover:bg-blue-700',
        border: 'border-blue-300 dark:border-blue-800',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
        button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25',
        ring: 'ring-blue-400',
        progress: 'bg-blue-500',
        headerIcon: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 shadow-blue-500/25',
      };
  }
}
