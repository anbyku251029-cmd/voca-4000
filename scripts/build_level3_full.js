// Complete Level 3 Data Builder for Units 6 to 30 and CSV generator
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import units1_5 to merge everything for the CSV and index
import { UNITS_1_5 } from '../src/data/level3/units1_5.ts';

// We will construct units 6-10, 11-15, 16-20, 21-25, 26-30
import { units6_10_raw } from './units_6_10_data.js';
import { units11_15_raw } from './units_11_15_data.js';
import { units16_20_raw } from './units_16_20_data.js';
import { units21_25_raw } from './units_21_25_data.js';
import { units26_30_raw } from './units_26_30_data.js';

function formatUnitGroup(rawGroup, chunkName) {
  const formatted = rawGroup.map(u => ({
    unit: u.unit,
    title: u.title,
    words: u.words.map((w, idx) => ({
      id: `l3_u${u.unit}_${idx + 1}`,
      unit: u.unit,
      order: idx + 1,
      word: w.word,
      pronunciation: w.pronunciation,
      partOfSpeech: w.pos,
      definition: w.def,
      koreanDefinition: w.kor,
      exampleSentence: w.ex,
      exerciseQuestion: w.q
    })),
    story: {
      unit: u.unit,
      title: u.story.title,
      passage: u.story.passage,
      sentences: u.story.sentences,
      sentenceTranslations: u.story.sentenceTranslations,
      targetWords: u.story.targetWords,
      readingComprehension: u.story.readingComprehension
    }
  }));

  const code = `import { UnitData } from '../unitsData';

export const ${chunkName}: UnitData[] = ${JSON.stringify(formatted, null, 2)};
`;
  return { formatted, code };
}

// Write files
const g6_10 = formatUnitGroup(units6_10_raw, 'UNITS_6_10');
fs.writeFileSync(path.resolve(__dirname, '../src/data/level3/units6_10.ts'), g6_10.code, 'utf-8');

const g11_15 = formatUnitGroup(units11_15_raw, 'UNITS_11_15');
fs.writeFileSync(path.resolve(__dirname, '../src/data/level3/units11_15.ts'), g11_15.code, 'utf-8');

const g16_20 = formatUnitGroup(units16_20_raw, 'UNITS_16_20');
fs.writeFileSync(path.resolve(__dirname, '../src/data/level3/units16_20.ts'), g16_20.code, 'utf-8');

const g21_25 = formatUnitGroup(units21_25_raw, 'UNITS_21_25');
fs.writeFileSync(path.resolve(__dirname, '../src/data/level3/units21_25.ts'), g21_25.code, 'utf-8');

const g26_30 = formatUnitGroup(units26_30_raw, 'UNITS_26_30');
fs.writeFileSync(path.resolve(__dirname, '../src/data/level3/units26_30.ts'), g26_30.code, 'utf-8');

// Write index.ts for Level 3
const indexCode = `import { UnitData } from '../unitsData';
import { WordItem } from '../../types';
import { UNITS_1_5 } from './units1_5';
import { UNITS_6_10 } from './units6_10';
import { UNITS_11_15 } from './units11_15';
import { UNITS_16_20 } from './units16_20';
import { UNITS_21_25 } from './units21_25';
import { UNITS_26_30 } from './units26_30';

export const UNITS_DATA_LEVEL3: UnitData[] = [
  ...UNITS_1_5,
  ...UNITS_6_10,
  ...UNITS_11_15,
  ...UNITS_16_20,
  ...UNITS_21_25,
  ...UNITS_26_30,
];

export const ALL_WORDS_FLAT_LEVEL3: WordItem[] = UNITS_DATA_LEVEL3.flatMap((u) => u.words);

export const WORDS_BY_LOWERCASE_LEVEL3: Record<string, WordItem> = Object.fromEntries(
  ALL_WORDS_FLAT_LEVEL3.map((w) => [w.word.toLowerCase(), w])
);
`;

fs.writeFileSync(path.resolve(__dirname, '../src/data/level3/index.ts'), indexCode, 'utf-8');
console.log('Successfully wrote index.ts and all unit files for Level 3.');

// Generate 4000_Essential_English_Words_3.csv
const allUnits = [
  ...UNITS_1_5,
  ...g6_10.formatted,
  ...g11_15.formatted,
  ...g16_20.formatted,
  ...g21_25.formatted,
  ...g26_30.formatted,
];

const rows = [
  'Unit,Word,POS,Meaning (KR),문제,Word List Example,영어본문,한글해석,'
];

for (const u of allUnits) {
  const unitStr = `Unit ${String(u.unit).padStart(2, '0')}`;
  const words = u.words;
  const sentences = u.story.sentences || [];
  const translations = u.story.sentenceTranslations || [];
  const readingQ = u.story.readingComprehension || [];

  const maxRows = Math.max(words.length, sentences.length + readingQ.length);

  for (let i = 0; i < maxRows; i++) {
    const w = words[i];
    const isFirst = i === 0;

    const unitCol = isFirst ? unitStr : '';
    const wordCol = w ? w.word : '';
    const posCol = w ? w.partOfSpeech : '';
    const meaningCol = w ? `"${(w.koreanDefinition || '').replace(/"/g, '""')}"` : '';
    
    let questionCol = '';
    if (w && w.exerciseQuestion) {
      questionCol = `"${w.exerciseQuestion.replace(/"/g, '""')}"`;
    } else if (i >= words.length && i - words.length < readingQ.length) {
      const rq = readingQ[i - words.length];
      const optStr = rq.options ? ` (${rq.options.map((o, oi) => `${String.fromCharCode(97 + oi)}. ${o}`).join(' / ')})` : '';
      questionCol = `"[RC-${i - words.length + 1}] ${rq.question}${optStr} [정답: ${rq.answer}]"`;
    }

    const exampleCol = w ? `"${(w.exampleSentence || '').replace(/"/g, '""')}"` : '';
    const storySentence = i < sentences.length ? `"${sentences[i].replace(/"/g, '""')}"` : '';
    const storyTrans = i < translations.length ? `"${translations[i].replace(/"/g, '""')}"` : '';

    rows.push([
      unitCol,
      wordCol,
      posCol,
      meaningCol,
      questionCol,
      exampleCol,
      storySentence,
      storyTrans,
      ''
    ].join(','));
  }
}

const csvPath = path.resolve(__dirname, '../public/4000_Essential_English_Words_3.csv');
fs.writeFileSync(csvPath, rows.join('\n'), 'utf-8');
console.log('Successfully generated public/4000_Essential_English_Words_3.csv, total rows:', rows.length);
