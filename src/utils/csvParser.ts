import { WordItem } from '../types';

/**
 * Robust CSV parser that handles quotes, line breaks, and varied headers (Book 1, 2, 3 formats)
 */
export function parseWordsCSV(csvContent: string): { words: WordItem[]; error?: string } {
  try {
    const lines = parseCSVRows(csvContent);
    if (!lines || lines.length < 2) {
      return { words: [], error: 'CSV 파일 내용이 비어있거나 행이 부족합니다.' };
    }

    const header = lines[0].map(h => h.trim().toLowerCase().replace(/[\s_-]+/g, ''));
    
    // Find column indexes
    const unitIdx = header.findIndex(h => h.includes('unit'));
    const orderIdx = header.findIndex(h => h.includes('order') || h.includes('num') || h.includes('id') || h.includes('번호'));
    const wordIdx = header.findIndex(h => h.includes('word') || h.includes('term') || h.includes('단어'));
    const pronIdx = header.findIndex(h => h.includes('pronun') || h.includes('ipa') || h.includes('발음'));
    const posIdx = header.findIndex(h => h.includes('part') || h.includes('pos') || h.includes('품사'));
    const defIdx = header.findIndex(h => h.includes('def') || h.includes('정의') || h.includes('meaning') || h.includes('뜻'));
    const krDefIdx = header.findIndex(h => h.includes('meaning(kr)') || h.includes('korean') || h.includes('한국어') || (h.includes('meaning') && h.includes('kr')));
    const exIdx = header.findIndex(h => h.includes('examp') || h.includes('sentence') || h.includes('wordlistexample') || h.includes('예문'));
    const exTransIdx = header.findIndex(h => h.includes('한글해석') || h.includes('trans') || h.includes('해석'));
    const exQuestionIdx = header.findIndex(h => h.includes('문제') || h.includes('exerc') || h.includes('question'));

    if (wordIdx === -1) {
      return { words: [], error: "'word'(단어) 열을 찾을 수 없습니다. CSV 헤더를 확인해주세요." };
    }

    const parsedWords: WordItem[] = [];
    let currentCarriedUnit = 1;
    let unitWordCounter: Record<number, number> = {};

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i];
      if (!row || row.length === 0 || (row.length === 1 && !row[0].trim())) continue;

      const word = (row[wordIdx] || '').trim();
      if (!word) continue;

      // Extract unit, handling "Unit 01", "1", or empty carried-forward cells
      let unit = currentCarriedUnit;
      if (unitIdx !== -1 && row[unitIdx] && row[unitIdx].trim()) {
        const rawDigits = row[unitIdx].replace(/[^0-9]/g, '');
        if (rawDigits) {
          const parsed = parseInt(rawDigits, 10);
          if (!isNaN(parsed) && parsed > 0) {
            unit = Math.min(30, parsed);
            currentCarriedUnit = unit;
          }
        }
      }

      unitWordCounter[unit] = (unitWordCounter[unit] || 0) + 1;
      const orderRaw = orderIdx !== -1 ? parseInt(row[orderIdx], 10) : unitWordCounter[unit];
      const order = isNaN(orderRaw) || orderRaw <= 0 ? unitWordCounter[unit] : orderRaw;

      const pronunciation = pronIdx !== -1 ? (row[pronIdx] || '').trim() : `/${word}/`;
      const partOfSpeech = posIdx !== -1 ? (row[posIdx] || '').trim() : 'n.';
      
      let rawDef = defIdx !== -1 ? (row[defIdx] || '').trim() : '';
      let rawKrDef = krDefIdx !== -1 ? (row[krDefIdx] || '').trim() : '';

      // If defIdx column has Korean meaning and rawKrDef is empty
      if (!rawKrDef && rawDef && /[가-힣]/.test(rawDef)) {
        rawKrDef = rawDef;
      }
      const definition = rawDef || `Essential vocabulary term: ${word}`;
      const exampleSentence = exIdx !== -1 ? (row[exIdx] || '').trim() : `We use the word "${word}" in various daily expressions.`;
      const exampleTranslation = exTransIdx !== -1 ? (row[exTransIdx] || '').trim() : undefined;
      const exerciseQuestion = exQuestionIdx !== -1 ? (row[exQuestionIdx] || '').trim() : undefined;

      parsedWords.push({
        id: `u${unit}_${order}`,
        unit,
        order,
        word,
        pronunciation: pronunciation || `/${word}/`,
        partOfSpeech: partOfSpeech || 'word',
        definition: definition || 'No definition available',
        koreanDefinition: rawKrDef || undefined,
        exampleSentence: exampleSentence || `Example sentence with ${word}.`,
        exampleTranslation: exampleTranslation || undefined,
        exerciseQuestion: exerciseQuestion || undefined,
      });
    }

    if (parsedWords.length === 0) {
      return { words: [], error: '유효한 단어 데이터를 추출하지 못했습니다.' };
    }

    return { words: parsedWords };
  } catch (err: any) {
    return { words: [], error: `CSV 파싱 중 오류가 발생했습니다: ${err.message}` };
  }
}

/**
 * Internal RFC 4180 compliant CSV row splitter
 */
function parseCSVRows(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let col = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        col += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(col);
      col = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      row.push(col);
      col = '';
      if (row.length > 0 && row.some(cell => cell.trim().length > 0)) {
        result.push(row);
      }
      row = [];
    } else {
      col += c;
    }
  }

  if (col || row.length > 0) {
    row.push(col);
    if (row.some(cell => cell.trim().length > 0)) {
      result.push(row);
    }
  }

  return result;
}

export function exportWordsToCSV(words: WordItem[]): string {
  const headers = [
    'unit',
    'order',
    'word',
    'pronunciation',
    'part_of_speech',
    'definition',
    'korean_definition',
    'example_sentence',
    'example_translation',
    'exercise_question'
  ];
  const rows = [headers.join(',')];

  for (const w of words) {
    const esc = (txt?: string) => `"${(txt || '').replace(/"/g, '""')}"`;
    rows.push([
      w.unit,
      w.order,
      esc(w.word),
      esc(w.pronunciation),
      esc(w.partOfSpeech),
      esc(w.definition),
      esc(w.koreanDefinition),
      esc(w.exampleSentence),
      esc(w.exampleTranslation),
      esc(w.exerciseQuestion)
    ].join(','));
  }

  return rows.join('\n');
}
