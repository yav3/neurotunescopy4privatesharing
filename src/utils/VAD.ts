// Voice Activity Detection utility
export class VAD {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private stream: MediaStream | null = null;
  private isActive = false;
  private threshold = 50; // Voice activity threshold
  private onVoiceStart: (() => void) | null = null;
  private onVoiceEnd: (() => void) | null = null;
  private silenceTimer: number | null = null;
  private silenceThreshold = 500; // ms of silence before voice end

  constructor(onVoiceStart?: () => void, onVoiceEnd?: () => void) {
    this.onVoiceStart = onVoiceStart || null;
    this.onVoiceEnd = onVoiceEnd || null;
  }

  async init(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.audioContext = new AudioContext({ sampleRate: 16000 });
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);

      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.microphone.connect(this.analyser);
      
      console.log('VAD initialized');
    } catch (error) {
      console.error('VAD initialization failed:', error);
      throw error;
    }
  }

  start(): void {
    if (!this.analyser || !this.dataArray) {
      throw new Error('VAD not initialized');
    }

    const detectVoice = () => {
      if (!this.analyser || !this.dataArray) return;

      this.analyser.getByteFrequencyData(this.dataArray);
      
      // Calculate average energy in voice frequency range (300-3400 Hz)
      const voiceStart = Math.floor(300 / (this.audioContext!.sampleRate / 2) * this.dataArray.length);
      const voiceEnd = Math.floor(3400 / (this.audioContext!.sampleRate / 2) * this.dataArray.length);
      
      let voiceEnergy = 0;
      for (let i = voiceStart; i < voiceEnd; i++) {
        voiceEnergy += this.dataArray[i];
      }
      voiceEnergy /= (voiceEnd - voiceStart);

      const hasVoice = voiceEnergy > this.threshold;

      if (hasVoice && !this.isActive) {
        this.isActive = true;
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
        this.onVoiceStart?.();
      } else if (!hasVoice && this.isActive) {
        if (!this.silenceTimer) {
          this.silenceTimer = window.setTimeout(() => {
            this.isActive = false;
            this.silenceTimer = null;
            this.onVoiceEnd?.();
          }, this.silenceThreshold);
        }
      }

      requestAnimationFrame(detectVoice);
    };

    detectVoice();
    console.log('VAD started');
  }

  stop(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isActive = false;
    console.log('VAD stopped');
  }

  setThreshold(threshold: number): void {
    this.threshold = Math.max(0, Math.min(255, threshold));
  }

  getVoiceActivity(): boolean {
    return this.isActive;
  }
}