// Level 4 Data Generator from public/4000_Essential_English_Words_4.csv
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.resolve(__dirname, '../public/4000_Essential_English_Words_4.csv');
const content = fs.readFileSync(csvPath, 'utf-8');

function parseCSVLine(line) {
  const cols = [];
  let inQ = false, cur = '';
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"' && (i === 0 || line[i - 1] !== '\\')) {
      inQ = !inQ;
    } else if (c === ',' && !inQ) {
      cols.push(cur.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  cols.push(cur.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
  return cols;
}

const titles = {
  1: "The History of Chocolate",
  2: "The Island Arc",
  3: "The Young Archer",
  4: "The Fox and the Grapes",
  5: "The Geography Project",
  6: "Jack Frost and Winter",
  7: "The Master Architect",
  8: "The Music Player",
  9: "George's New Family",
  10: "Anton Van Leeuwenhoek",
  11: "The Vain Celebrity",
  12: "The Sun and the North Wind",
  13: "Alex and the Nightmare",
  14: "The Playful Brothers",
  15: "Laika the Space Traveler",
  16: "Gwen in the Gymnasium",
  17: "The Camping Adventure",
  18: "Peter's Great Adventure",
  19: "Isaac's Family Vacation",
  20: "The King and Clara",
  21: "The Bank Investigation",
  22: "The Emperor's Palace Timber",
  23: "The Extinction of Dinosaurs",
  24: "The Traveler at the Inn",
  25: "Eliza in Australia",
  26: "Flight Over the Tropics",
  27: "The Breath of Rainforests",
  28: "Thucydides the Historian",
  29: "Our Mobile Society",
  30: "The Three Brothers"
};

const lines = content.split('\n');
const units = {};
let currentUnit = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  const cols = parseCSVLine(line);
  if (cols[0] && cols[0].startsWith('Unit ')) {
    currentUnit = parseInt(cols[0].replace(/[^0-9]/g, ''), 10);
    units[currentUnit] = {
      unit: currentUnit,
      title: titles[currentUnit] || `Unit ${currentUnit} Vocabulary`,
      words: [],
      sentences: [],
      sentenceTranslations: [],
      rc: []
    };
  }
  if (!currentUnit || !units[currentUnit]) continue;

  const word = cols[1];
  const pos = cols[2];
  const kor = cols[3];
  const q = cols[4];
  const ex = cols[5];
  const storyEn = cols[6];
  const storyKr = cols[7];

  if (word && !word.toLowerCase().includes('word')) {
    units[currentUnit].words.push({
      word,
      pos: pos || 'n.',
      kor: kor || '',
      q: q || '',
      ex: ex || ''
    });
  }

  if (q && q.startsWith('[RC-')) {
    const m = q.match(/\[RC-\d+\]\s*(.+?)(?:\s*\[정답:\s*([^\]]+)\])?$/);
    units[currentUnit].rc.push({
      id: `rc_${currentUnit}_${units[currentUnit].rc.length + 1}`,
      question: m ? m[1] : q,
      answer: m && m[2] ? m[2] : ''
    });
  }

  if (storyEn) {
    units[currentUnit].sentences.push(storyEn);
    units[currentUnit].sentenceTranslations.push(storyKr || '');
  }
}

// Generate chunks
const outDir = path.resolve(__dirname, '../src/data/level4');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function generateGroupCode(start, end, varName) {
  const groupUnits = [];
  for (let u = start; u <= end; u++) {
    const un = units[u];
    if (!un) continue;
    const wordsFormatted = un.words.map((w, idx) => ({
      id: `l4_u${u}_${idx + 1}`,
      unit: u,
      order: idx + 1,
      word: w.word,
      pronunciation: `/${w.word}/`,
      partOfSpeech: w.pos,
      definition: w.kor || `Essential vocabulary: ${w.word}`,
      koreanDefinition: w.kor,
      exampleSentence: w.ex || `We use the word ${w.word} in conversation.`,
      exerciseQuestion: w.q || undefined
    }));

    groupUnits.push({
      unit: u,
      title: un.title,
      words: wordsFormatted,
      story: {
        unit: u,
        title: un.title,
        passage: un.sentences.join(' '),
        sentences: un.sentences,
        sentenceTranslations: un.sentenceTranslations,
        targetWords: wordsFormatted.map(w => w.word),
        readingComprehension: un.rc.length > 0 ? un.rc : undefined
      }
    });
  }

  return `import { UnitData } from '../unitsData';

export const ${varName}: UnitData[] = ${JSON.stringify(groupUnits, null, 2)};
`;
}

fs.writeFileSync(path.join(outDir, 'units1_5.ts'), generateGroupCode(1, 5, 'UNITS_1_5'), 'utf-8');
fs.writeFileSync(path.join(outDir, 'units6_10.ts'), generateGroupCode(6, 10, 'UNITS_6_10'), 'utf-8');
fs.writeFileSync(path.join(outDir, 'units11_15.ts'), generateGroupCode(11, 15, 'UNITS_11_15'), 'utf-8');
fs.writeFileSync(path.join(outDir, 'units16_20.ts'), generateGroupCode(16, 20, 'UNITS_16_20'), 'utf-8');
fs.writeFileSync(path.join(outDir, 'units21_25.ts'), generateGroupCode(21, 25, 'UNITS_21_25'), 'utf-8');
fs.writeFileSync(path.join(outDir, 'units26_30.ts'), generateGroupCode(26, 30, 'UNITS_26_30'), 'utf-8');

const indexCode = `import { UnitData } from '../unitsData';
import { WordItem } from '../../types';
import { UNITS_1_5 } from './units1_5';
import { UNITS_6_10 } from './units6_10';
import { UNITS_11_15 } from './units11_15';
import { UNITS_16_20 } from './units16_20';
import { UNITS_21_25 } from './units21_25';
import { UNITS_26_30 } from './units26_30';

export const UNITS_DATA_LEVEL4: UnitData[] = [
  ...UNITS_1_5,
  ...UNITS_6_10,
  ...UNITS_11_15,
  ...UNITS_16_20,
  ...UNITS_21_25,
  ...UNITS_26_30,
];

export const ALL_WORDS_FLAT_LEVEL4: WordItem[] = UNITS_DATA_LEVEL4.flatMap((u) => u.words);

export const WORDS_BY_LOWERCASE_LEVEL4: Record<string, WordItem> = Object.fromEntries(
  ALL_WORDS_FLAT_LEVEL4.map((w) => [w.word.toLowerCase(), w])
);
`;

fs.writeFileSync(path.join(outDir, 'index.ts'), indexCode, 'utf-8');
console.log('Successfully created Level 4 data files!');
