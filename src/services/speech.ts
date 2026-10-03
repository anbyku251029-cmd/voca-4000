/**
 * Web Speech API Audio Engine for Native English Pronunciation
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private rate: number = 1.0;
  private isSpeakingState: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const available = this.synth.getVoices();
    if (available && available.length > 0) {
      this.voices = available;
      // Prefer high quality en-US voice
      const preferred = available.find(
        (v) =>
          (v.lang === 'en-US' || v.lang === 'en_US') &&
          (v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Natural') ||
            v.name.includes('Premium') ||
            v.name.includes('Daniel') ||
            v.name.includes('US English'))
      ) ||
      available.find((v) => v.lang.startsWith('en-US')) ||
      available.find((v) => v.lang.startsWith('en'));

      if (preferred) {
        this.selectedVoice = preferred;
      }
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.voices.length && this.synth) {
      this.loadVoices();
    }
    return this.voices.filter((v) => v.lang.startsWith('en'));
  }

  public setSelectedVoice(voiceURI: string) {
    const found = this.voices.find((v) => v.voiceURI === voiceURI);
    if (found) {
      this.selectedVoice = found;
    }
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  public getRate(): number {
    return this.rate;
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.error('Error stopping speech:', e);
      }
    }
    this.isSpeakingState = false;
    this.currentUtterance = null;
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public isSpeaking(): boolean {
    return !!(this.synth && (this.synth.speaking || this.isSpeakingState));
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      voiceURI?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
      onBoundary?: (charIndex: number) => void;
    }
  ) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser environment');
      options?.onEnd?.();
      return;
    }

    // Cancel ongoing speech
    this.stop();

    if (!text || !text.trim()) {
      options?.onEnd?.();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = 'en-US';
      utterance.rate = options?.rate ?? this.rate;
      utterance.pitch = options?.pitch ?? 1.0;

      if (options?.voiceURI) {
        const found = this.voices.find((v) => v.voiceURI === options.voiceURI);
        if (found) {
          utterance.voice = found;
        } else if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }
      } else {
        if (!this.selectedVoice) {
          this.loadVoices();
        }
        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }
      }

      utterance.onstart = () => {
        this.isSpeakingState = true;
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeakingState = false;
        this.currentUtterance = null;
        options?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isSpeakingState = false;
        this.currentUtterance = null;
        // Ignore interrupted errors caused by cancel()
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.error('Speech synthesis error:', e);
          options?.onError?.(e);
        } else {
          options?.onEnd?.();
        }
      };

      if (options?.onBoundary) {
        utterance.onboundary = (e) => {
          if (e.name === 'word' || e.name === 'sentence') {
            options.onBoundary?.(e.charIndex);
          }
        };
      }

      this.currentUtterance = utterance;

      // Chrome/Safari bug workaround: sometimes speech is paused automatically
      if (this.synth.paused) {
        this.synth.resume();
      }

      this.synth.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis execution failed:', err);
      this.isSpeakingState = false;
      options?.onError?.(err);
    }
  }
}

export const speechService = new SpeechService();
