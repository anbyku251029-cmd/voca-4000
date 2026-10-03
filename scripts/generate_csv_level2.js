// Script to export 4000_Essential_English_Words_2.csv
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const { UNITS_DATA_LEVEL2 } = await import('../src/data/level2/index.js');
  
  const rows = [
    'Unit,Word,POS,Meaning (KR),문제,Word List Example,영어본문,한글해석,'
  ];

  for (const u of UNITS_DATA_LEVEL2) {
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

  const csvContent = rows.join('\n');
  const targetPath = path.resolve(__dirname, '../public/4000_Essential_English_Words_2.csv');
  fs.writeFileSync(targetPath, csvContent, 'utf-8');
  console.log('Successfully generated Level 2 CSV:', targetPath, 'Total rows:', rows.length);
}

run().catch(console.error);
