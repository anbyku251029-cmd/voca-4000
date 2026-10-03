import React, { useEffect, useState } from 'react';
import { Volume2, X, Sliders, Play, Check } from 'lucide-react';
import { speechService } from '../services/speech';
import { SpeechSettings } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: SpeechSettings;
  onSaveSettings: (settings: SpeechSettings) => void;
}

export const AudioSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [rate, setRate] = useState<number>(settings.rate);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(settings.voiceURI || '');
  const [autoPlay, setAutoPlay] = useState<boolean>(settings.autoPlay);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  useEffect(() => {
    setRate(settings.rate);
    setAutoPlay(settings.autoPlay);
    setSelectedVoiceURI(settings.voiceURI || '');
  }, [settings, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const v = speechService.getVoices();
      setVoices(v);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestSpeech = () => {
    speechService.setRate(rate);
    if (selectedVoiceURI) {
      speechService.setSelectedVoice(selectedVoiceURI);
    }
    setIsPlayingTest(true);
    speechService.speak(
      "Welcome to 4000 Essential English Words Master. Listening to accurate native pronunciation accelerates language acquisition.",
      {
        rate,
        onEnd: () => setIsPlayingTest(false),
        onError: () => setIsPlayingTest(false),
      }
    );
  };

  const handleSave = () => {
    speechService.setRate(rate);
    if (selectedVoiceURI) {
      speechService.setSelectedVoice(selectedVoiceURI);
    }
    onSaveSettings({
      rate,
      pitch: 1.0,
      autoPlay,
      voiceURI: selectedVoiceURI,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                음성 및 재생 설정
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Web Speech API 원어민 발음 옵션
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

        <div className="py-5 space-y-6">
          {/* Rate Selector */}
          <div>
            <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 block mb-2">
              재생 배속 (Speed)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0.8, 1.0, 1.2, 1.4].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setRate(speed)}
                  className={`py-2 px-3 text-sm font-semibold rounded-xl border transition-all ${
                    rate === speed
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {speed === 1.0 ? '1.0x (보통)' : `${speed}x`}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Play on Card Change */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <div>
              <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                플래시카드 자동 발음 재생
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                카드를 넘길 때 단어 원어민 발음을 즉시 재생합니다
              </div>
            </div>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                autoPlay ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  autoPlay ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Voice Selector */}
          {voices.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 block mb-2">
                영어 음성 선택 (Browser Voices)
              </label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="">기본 최적 en-US 음성 (권장)</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Test Listen Button */}
          <button
            onClick={handleTestSpeech}
            disabled={isPlayingTest}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-sm transition"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingTest ? 'text-amber-500 animate-pulse' : ''}`} />
            {isPlayingTest ? '발음 테스트 재생 중...' : '테스트 문장 미리 듣기'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};
