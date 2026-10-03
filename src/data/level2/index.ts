import { UnitData } from '../unitsData';
import { WordItem } from '../../types';
import { UNITS_1_5 } from './units1_5';
import { UNITS_6_10 } from './units6_10';
import { UNITS_11_15 } from './units11_15';
import { UNITS_16_20 } from './units16_20';
import { UNITS_21_25 } from './units21_25';
import { UNITS_26_30 } from './units26_30';

export const UNITS_DATA_LEVEL2: UnitData[] = [
  ...UNITS_1_5,
  ...UNITS_6_10,
  ...UNITS_11_15,
  ...UNITS_16_20,
  ...UNITS_21_25,
  ...UNITS_26_30,
];

export const ALL_WORDS_FLAT_LEVEL2: WordItem[] = UNITS_DATA_LEVEL2.flatMap((u) => u.words);

export const WORDS_BY_LOWERCASE_LEVEL2: Record<string, WordItem> = Object.fromEntries(
  ALL_WORDS_FLAT_LEVEL2.map((w) => [w.word.toLowerCase(), w])
);
