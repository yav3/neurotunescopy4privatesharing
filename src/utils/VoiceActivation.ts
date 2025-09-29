// Voice activation utility for elderly patients

// Simple types to avoid conflicts with built-in declarations
interface SpeechRecognitionAPI extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognitionAPI, ev: Event) => any) | null;
  onend: ((this: SpeechRecognitionAPI, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognitionAPI, ev: any) => any) | null;
  onerror: ((this: SpeechRecognitionAPI, ev: any) => any) | null;
  start(): void;
  stop(): void;
}

export class VoiceActivation {
  private recognition: SpeechRecognitionAPI | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private onCommand: (command: string, confidence: number) => void;
  private onStatusChange: (status: 'listening' | 'idle' | 'processing') => void;
  private activationPhrase = 'hello neurotunes';

  constructor(
    onCommand: (command: string, confidence: number) => void,
    onStatusChange: (status: 'listening' | 'idle' | 'processing') => void
  ) {
    this.onCommand = onCommand;
    this.onStatusChange = onStatusChange;
    this.synthesis = window.speechSynthesis;
    this.initRecognition();
  }

  private initRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition() as SpeechRecognitionAPI;
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      console.log('🎤 Voice recognition started');
      this.isListening = true;
      this.onStatusChange('listening');
    };

    this.recognition.onend = () => {
      console.log('🎤 Voice recognition ended');
      this.isListening = false;
      this.onStatusChange('idle');
      
      // Auto-restart for continuous listening
      if (this.recognition) {
        setTimeout(() => this.start(), 1000);
      }
    };

    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        const transcript = result[0].transcript.toLowerCase().trim();
        const confidence = result[0].confidence;
        
        console.log('🎤 Voice command:', transcript, 'confidence:', confidence);
        
        // Check for activation phrase or process command if already activated
        if (transcript.includes(this.activationPhrase)) {
          this.speak('Yes, how can I help you?');
          return;
        }
        
        this.onCommand(transcript, confidence);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('🎤 Speech recognition error:', event.error);
      this.onStatusChange('idle');
    };
  }

  start() {
    if (!this.recognition) {
      console.warn('Speech recognition not available');
      return;
    }

    try {
      this.recognition.start();
      console.log('🎤 Starting voice activation...');
    } catch (error) {
      console.error('🎤 Error starting recognition:', error);
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.onStatusChange('idle');
    }
  }

  speak(text: string, rate: number = 0.8) {
    // Cancel any ongoing speech
    this.synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate; // Slower speech for elderly users
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Try to use a more natural voice
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Alex')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.onStatusChange('processing');
    };

    utterance.onend = () => {
      this.onStatusChange('listening');
    };

    this.synthesis.speak(utterance);
  }

  isSupported(): boolean {
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  getListeningStatus(): boolean {
    return this.isListening;
  }
}

// Voice command processor
export class VoiceCommandProcessor {
  private navigate: (path: string) => void;
  private voiceActivation: VoiceActivation;

  constructor(navigate: (path: string) => void) {
    this.navigate = navigate;
    this.voiceActivation = new VoiceActivation(
      this.processCommand.bind(this),
      this.onStatusChange.bind(this)
    );
  }

  private onStatusChange(status: 'listening' | 'idle' | 'processing') {
    // Emit status changes for UI updates
    window.dispatchEvent(new CustomEvent('voice-status-change', { detail: status }));
  }

  private processCommand(command: string, confidence: number) {
    console.log('🎯 Processing voice command:', command);
    
    // Require higher confidence for elderly users to avoid false positives
    if (confidence < 0.7) {
      console.log('🎯 Command confidence too low:', confidence);
      return;
    }

    const lowerCommand = command.toLowerCase();

    // Therapeutic goal commands
    if (lowerCommand.includes('anxiety') || lowerCommand.includes('anxious')) {
      this.voiceActivation.speak('Starting anxiety support music');
      this.navigate('/goals/anxiety-support');
      return;
    }

    if (lowerCommand.includes('stress') || lowerCommand.includes('stressed')) {
      this.voiceActivation.speak('Starting stress relief music');
      this.navigate('/goals/stress-anxiety-support');
      return;
    }

    if (lowerCommand.includes('pain') || lowerCommand.includes('hurt')) {
      this.voiceActivation.speak('Starting pain management music');
      this.navigate('/goals/pain-support');
      return;
    }

    if (lowerCommand.includes('sleep') || lowerCommand.includes('tired') || lowerCommand.includes('rest')) {
      this.voiceActivation.speak('Starting sleep support music');
      this.navigate('/goals/depression-support');
      return;
    }

    if (lowerCommand.includes('energy') || lowerCommand.includes('boost') || lowerCommand.includes('motivation')) {
      this.voiceActivation.speak('Starting energy boost music');
      this.navigate('/goals/energy-boost');
      return;
    }

    if (lowerCommand.includes('focus') || lowerCommand.includes('concentrate') || lowerCommand.includes('attention')) {
      this.voiceActivation.speak('Starting focus enhancement music');
      this.navigate('/goals/focus-enhancement');
      return;
    }

    if (lowerCommand.includes('meditation') || lowerCommand.includes('meditate') || lowerCommand.includes('mindful')) {
      this.voiceActivation.speak('Starting meditation music');
      this.navigate('/goals/meditation-support');
      return;
    }

    if (lowerCommand.includes('mood') || lowerCommand.includes('happy') || lowerCommand.includes('uplifting')) {
      this.voiceActivation.speak('Starting mood boosting music');
      this.navigate('/goals/mood-boost');
      return;
    }

    // Navigation commands
    if (lowerCommand.includes('home') || lowerCommand.includes('main') || lowerCommand.includes('start')) {
      this.voiceActivation.speak('Going to home page');
      this.navigate('/');
      return;
    }

    if (lowerCommand.includes('goals') || lowerCommand.includes('choose') || lowerCommand.includes('select')) {
      this.voiceActivation.speak('Showing therapeutic goals');
      this.navigate('/goals');
      return;
    }

    // Playback commands
    if (lowerCommand.includes('play') || lowerCommand.includes('start music')) {
      this.voiceActivation.speak('I need to know what type of music you want. Try saying something like "play anxiety music" or "start focus music"');
      return;
    }

    if (lowerCommand.includes('stop') || lowerCommand.includes('pause')) {
      this.voiceActivation.speak('Stopping music');
      // Trigger stop event
      window.dispatchEvent(new CustomEvent('voice-stop-music'));
      return;
    }

    // Help commands
    if (lowerCommand.includes('help') || lowerCommand.includes('what can') || lowerCommand.includes('commands')) {
      this.voiceActivation.speak('I can help you with anxiety, stress, pain, sleep, energy, focus, meditation, or mood music. Just say "Hello NeuroTunes" and then tell me what you need, like "I need anxiety support" or "play focus music"');
      return;
    }

    // Default response for unrecognized commands
    this.voiceActivation.speak('I didn\'t understand that. Try saying "help" to hear what I can do, or say "Hello NeuroTunes" and then "I need anxiety support" or "play focus music"');
  }

  start() {
    this.voiceActivation.start();
  }

  stop() {
    this.voiceActivation.stop();
  }

  isSupported(): boolean {
    return this.voiceActivation.isSupported();
  }

  speak(text: string) {
    this.voiceActivation.speak(text);
  }
}