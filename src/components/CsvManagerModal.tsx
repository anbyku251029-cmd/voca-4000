import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, CheckCircle2, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { parseWordsCSV, exportWordsToCSV } from '../utils/csvParser';
import { WordItem, BookLevel } from '../types';
import { BOOKS_CONFIG } from '../utils/theme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentWords: WordItem[];
  onImportCustomWords: (words: WordItem[]) => void;
  onResetToDefault: () => void;
  hasCustomWords: boolean;
}

export const CsvManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentWords,
  onImportCustomWords,
  onResetToDefault,
  hasCustomWords,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [previewWords, setPreviewWords] = useState<WordItem[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setPreviewWords(null);

    if (!file.name.endsWith('.csv') && !file.type.includes('csv') && !file.type.includes('text')) {
      setErrorMsg('CSV 파일(.csv)만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        setErrorMsg('파일을 읽는 데 실패했습니다.');
        return;
      }
      const { words, error } = parseWordsCSV(content);
      if (error || !words.length) {
        setErrorMsg(error || '유효한 단어 데이터를 파싱하지 못했습니다.');
      } else {
        const uniqueUnits = new Set(words.map((w) => w.unit)).size;
        setPreviewWords(words);
        setSuccessMsg(
          `성공적으로 검증되었습니다! (${uniqueUnits}개 유닛, 총 ${words.length}개 단어 감지)`
        );
      }
    };
    reader.onerror = () => {
      setErrorMsg('파일을 읽는 도중 오류가 발생했습니다.');
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleApplyImport = () => {
    if (previewWords && previewWords.length > 0) {
      onImportCustomWords(previewWords);
      onClose();
    }
  };

  const handleDownloadCsv = (bookNumber: BookLevel) => {
    const filename = `4000_Essential_English_Words_${bookNumber}.csv`;
    const link = document.createElement('a');
    link.href = `/${filename}`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                CSV 데이터 연동 및 관리
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                4000 Essential English Words 1 ~ 6 데이터 내보내기 및 가져오기
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          {/* Status info */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                현재 데이터셋 상태
              </div>
              <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {hasCustomWords ? '사용자 정의 커스텀 CSV 적용 중' : '4000 Essential English Words Level 1 ~ 6 정품 탑재'}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                현재 유닛 총 {currentWords.length}개 단어 연동됨
              </div>
            </div>
            {hasCustomWords && (
              <button
                onClick={onResetToDefault}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                기본값 복원
              </button>
            )}
          </div>

          {/* Download buttons grid for all 6 books */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
              공식 교재 CSV 다운로드 (Level 1 ~ 6)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BOOKS_CONFIG.map((b) => (
                <button
                  key={b.book}
                  onClick={() => handleDownloadCsv(b.book)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition group text-left ${b.activeBg}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${b.colorBadge}`}>
                      L{b.book}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Book {b.book} (Level {b.book})
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[130px]">
                        {b.subtitle}
                      </div>
                    </div>
                  </div>
                  <Download className={`w-3.5 h-3.5 ${b.activeText} group-hover:scale-110 transition-transform`} />
                </button>
              ))}
            </div>
          </div>

          {/* Upload Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-800/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              CSV 파일을 드래그하거나 터치하여 업로드
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              지원 형식: CSV (unit, order, word, pronunciation, part_of_speech, definition, example_sentence)
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-400 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2.5 text-emerald-700 dark:text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Preview snippet if file loaded */}
          {previewWords && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden text-xs">
              <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-2 font-semibold text-zinc-700 dark:text-zinc-300">
                미리보기 (처음 3개 단어)
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                {previewWords.slice(0, 3).map((w) => (
                  <div key={w.id} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {w.word}
                      </span>{' '}
                      <span className="text-zinc-400">({w.partOfSpeech})</span>
                      <div className="text-zinc-500 dark:text-zinc-400 text-[11px] truncate max-w-[280px]">
                        {w.definition}
                      </div>
                    </div>
                    <span className="text-amber-600 font-medium">U{w.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
          >
            닫기
          </button>
          {previewWords && (
            <button
              onClick={handleApplyImport}
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition"
            >
              이 데이터로 앱에 적용 ({previewWords.length}단어)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
