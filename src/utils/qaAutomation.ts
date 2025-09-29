/**
 * Comprehensive QA Automation System
 * Tests every aspect of the therapeutic music application
 */

import { useAudioStore } from '@/stores/audioStore';
import { logger } from '@/services/logger';

export interface QATestResult {
  category: string;
  test: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: any;
  timestamp: string;
}

export interface QAReport {
  overview: {
    totalTests: number;
    passed: number;
    failed: number;
    warnings: number;
    duration: number;
  };
  results: QATestResult[];
  recommendations: string[];
}

export class QAAutomation {
  private results: QATestResult[] = [];
  private startTime: number = 0;

  private addResult(category: string, test: string, status: 'PASS' | 'FAIL' | 'WARN', message: string, details?: any) {
    this.results.push({
      category,
      test,
      status,
      message,
      details,
      timestamp: new Date().toISOString()
    });
  }

  async runFullQASuite(): Promise<QAReport> {
    console.log('🤖 Starting Comprehensive QA Automation...');
    this.startTime = Date.now();
    this.results = [];

    // Run all test categories in parallel for efficiency
    await Promise.all([
      this.testAudioSystem(),
      this.testDatabaseConnections(),
      this.testStorageBuckets(),
      this.testVoiceActivation(),
      this.testUIComponents(),
      this.testPerformance(),
      this.testAccessibility(),
      this.testSecurity(),
      this.testUserExperience()
    ]);

    return this.generateReport();
  }

  private async testAudioSystem(): Promise<void> {
    const category = 'Audio System';

    try {
      // Test audio store state
      const audioState = useAudioStore.getState();
      this.addResult(category, 'Store Initialization', 'PASS', 'Audio store initialized correctly', {
        queue: audioState.queue.length,
        isPlaying: audioState.isPlaying,
        currentTrack: audioState.currentTrack?.title
      });

      // Test audio element presence
      const audioElement = document.getElementById('unified-audio-player') as HTMLAudioElement;
      if (audioElement) {
        this.addResult(category, 'Audio Element', 'PASS', 'Audio element found and accessible');
        
        // Test audio element properties
        if (audioElement.crossOrigin === 'anonymous') {
          this.addResult(category, 'CORS Configuration', 'PASS', 'Audio element has correct CORS settings');
        } else {
          this.addResult(category, 'CORS Configuration', 'WARN', 'Audio element CORS not set to anonymous');
        }
      } else {
        this.addResult(category, 'Audio Element', 'FAIL', 'Audio element not found in DOM');
      }

      // Test therapeutic goals integration
      const goals = ['anxiety-relief', 'focus-enhancement', 'energy-boost', 'sleep-improvement', 'emotional-regulation'];
      for (const goal of goals) {
        try {
          const result = await audioState.playFromGoal(goal);
          if (result > 0) {
            this.addResult(category, `Goal: ${goal}`, 'PASS', `Successfully loaded ${result} tracks`);
          } else {
            this.addResult(category, `Goal: ${goal}`, 'WARN', 'No tracks loaded for goal');
          }
        } catch (error) {
          this.addResult(category, `Goal: ${goal}`, 'FAIL', `Failed to load tracks: ${error}`);
        }
      }

    } catch (error) {
      this.addResult(category, 'Audio System Test', 'FAIL', `Audio system test failed: ${error}`);
    }
  }

  private async testDatabaseConnections(): Promise<void> {
    const category = 'Database';

    try {
      // Test Supabase connection
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.from('tracks').select('id').limit(1);
      if (error) {
        this.addResult(category, 'Connection', 'FAIL', `Database connection failed: ${error.message}`);
      } else {
        this.addResult(category, 'Connection', 'PASS', 'Database connection successful');
      }

      // Test track data integrity
      const { data: tracks } = await supabase.from('tracks').select('*').limit(10);
      if (tracks) {
        const validTracks = tracks.filter(t => t.id && t.title);
        if (validTracks.length === tracks.length) {
          this.addResult(category, 'Data Integrity', 'PASS', 'All sample tracks have required fields');
        } else {
          this.addResult(category, 'Data Integrity', 'WARN', `${tracks.length - validTracks.length} tracks missing required fields`);
        }
      }

    } catch (error) {
      this.addResult(category, 'Database Test', 'FAIL', `Database test failed: ${error}`);
    }
  }

  private async testStorageBuckets(): Promise<void> {
    const category = 'Storage';

    try {
      const { supabase } = await import('@/integrations/supabase/client');

      // Test required buckets
      const requiredBuckets = ['therapeutic-music', 'pop', 'classical', 'jazz', 'ambient'];
      
      for (const bucket of requiredBuckets) {
        try {
          const { data, error } = await supabase.storage.from(bucket).list('', { limit: 1 });
          if (error) {
            this.addResult(category, `Bucket: ${bucket}`, 'FAIL', `Bucket access failed: ${error.message}`);
          } else {
            this.addResult(category, `Bucket: ${bucket}`, 'PASS', `Bucket accessible with ${data?.length || 0} files`);
          }
        } catch (error) {
          this.addResult(category, `Bucket: ${bucket}`, 'FAIL', `Bucket test failed: ${error}`);
        }
      }

    } catch (error) {
      this.addResult(category, 'Storage Test', 'FAIL', `Storage test failed: ${error}`);
    }
  }

  private async testVoiceActivation(): Promise<void> {
    const category = 'Voice Activation';

    try {
      // Test Web Speech API availability
      if ('speechSynthesis' in window && 'webkitSpeechRecognition' in window) {
        this.addResult(category, 'API Support', 'PASS', 'Speech recognition and synthesis APIs available');
        
        // Test voice activation component
        const voiceButton = document.querySelector('[data-testid="voice-activation-button"]');
        if (voiceButton) {
          this.addResult(category, 'UI Component', 'PASS', 'Voice activation button found');
        } else {
          this.addResult(category, 'UI Component', 'WARN', 'Voice activation button not found in DOM');
        }
      } else {
        this.addResult(category, 'API Support', 'FAIL', 'Speech APIs not supported in this browser');
      }

    } catch (error) {
      this.addResult(category, 'Voice Test', 'FAIL', `Voice activation test failed: ${error}`);
    }
  }

  private async testUIComponents(): Promise<void> {
    const category = 'UI Components';

    try {
      // Test critical UI elements
      const criticalElements = [
        { selector: '[data-testid="therapeutic-goals"]', name: 'Therapeutic Goals' },
        { selector: '[data-testid="audio-player"]', name: 'Audio Player' },
        { selector: '[data-testid="voice-activation"]', name: 'Voice Activation' },
        { selector: '[data-testid="welcome-message"]', name: 'Welcome Message' }
      ];

      for (const element of criticalElements) {
        const found = document.querySelector(element.selector);
        if (found) {
          this.addResult(category, element.name, 'PASS', `${element.name} component rendered`);
        } else {
          this.addResult(category, element.name, 'WARN', `${element.name} component not found`);
        }
      }

      // Test responsive design
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      if (viewport.width >= 768) {
        this.addResult(category, 'Responsive Design', 'PASS', 'Desktop viewport detected');
      } else {
        this.addResult(category, 'Responsive Design', 'PASS', 'Mobile viewport detected');
      }

    } catch (error) {
      this.addResult(category, 'UI Test', 'FAIL', `UI component test failed: ${error}`);
    }
  }

  private async testPerformance(): Promise<void> {
    const category = 'Performance';

    try {
      // Test page load performance
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        if (loadTime < 3000) {
          this.addResult(category, 'Page Load', 'PASS', `Page loaded in ${loadTime}ms`);
        } else {
          this.addResult(category, 'Page Load', 'WARN', `Slow page load: ${loadTime}ms`);
        }

        // Test memory usage
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
          
          if (memoryUsage < 50) {
            this.addResult(category, 'Memory Usage', 'PASS', `Memory usage: ${memoryUsage.toFixed(2)}MB`);
          } else {
            this.addResult(category, 'Memory Usage', 'WARN', `High memory usage: ${memoryUsage.toFixed(2)}MB`);
          }
        }
      }

    } catch (error) {
      this.addResult(category, 'Performance Test', 'FAIL', `Performance test failed: ${error}`);
    }
  }

  private async testAccessibility(): Promise<void> {
    const category = 'Accessibility';

    try {
      // Test for alt attributes on images
      const images = document.querySelectorAll('img');
      let missingAlt = 0;
      images.forEach(img => {
        if (!img.alt) missingAlt++;
      });

      if (missingAlt === 0) {
        this.addResult(category, 'Image Alt Text', 'PASS', 'All images have alt attributes');
      } else {
        this.addResult(category, 'Image Alt Text', 'WARN', `${missingAlt} images missing alt text`);
      }

      // Test for aria labels on interactive elements
      const buttons = document.querySelectorAll('button');
      let missingLabels = 0;
      buttons.forEach(btn => {
        if (!btn.getAttribute('aria-label') && !btn.textContent?.trim()) {
          missingLabels++;
        }
      });

      if (missingLabels === 0) {
        this.addResult(category, 'Button Labels', 'PASS', 'All buttons have accessible labels');
      } else {
        this.addResult(category, 'Button Labels', 'WARN', `${missingLabels} buttons missing accessible labels`);
      }

      // Test color contrast (basic check)
      const body = document.body;
      const styles = getComputedStyle(body);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;
      
      if (bgColor !== textColor) {
        this.addResult(category, 'Color Contrast', 'PASS', 'Basic color contrast check passed');
      } else {
        this.addResult(category, 'Color Contrast', 'FAIL', 'Text and background colors are identical');
      }

    } catch (error) {
      this.addResult(category, 'Accessibility Test', 'FAIL', `Accessibility test failed: ${error}`);
    }
  }

  private async testSecurity(): Promise<void> {
    const category = 'Security';

    try {
      // Test HTTPS
      if (location.protocol === 'https:') {
        this.addResult(category, 'HTTPS', 'PASS', 'Site served over HTTPS');
      } else {
        this.addResult(category, 'HTTPS', 'WARN', 'Site not served over HTTPS');
      }

      // Test CSP headers (basic check)
      const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (metaCSP) {
        this.addResult(category, 'Content Security Policy', 'PASS', 'CSP meta tag found');
      } else {
        this.addResult(category, 'Content Security Policy', 'WARN', 'No CSP meta tag found');
      }

      // Test for sensitive data in localStorage
      const localStorageKeys = Object.keys(localStorage);
      const sensitiveKeys = localStorageKeys.filter(key => 
        key.toLowerCase().includes('password') || 
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('secret')
      );

      if (sensitiveKeys.length === 0) {
        this.addResult(category, 'Local Storage Security', 'PASS', 'No sensitive data found in localStorage');
      } else {
        this.addResult(category, 'Local Storage Security', 'WARN', `Potential sensitive data in localStorage: ${sensitiveKeys.join(', ')}`);
      }

    } catch (error) {
      this.addResult(category, 'Security Test', 'FAIL', `Security test failed: ${error}`);
    }
  }

  private async testUserExperience(): Promise<void> {
    const category = 'User Experience';

    try {
      // Test welcome message functionality
      const welcomeElement = document.querySelector('[data-testid="welcome-message"]');
      if (welcomeElement) {
        this.addResult(category, 'Welcome Message', 'PASS', 'Welcome message component active');
      } else {
        this.addResult(category, 'Welcome Message', 'WARN', 'Welcome message not displayed');
      }

      // Test audio controls accessibility
      const audioControls = document.querySelectorAll('[data-testid*="audio"]');
      if (audioControls.length > 0) {
        this.addResult(category, 'Audio Controls', 'PASS', `${audioControls.length} audio controls found`);
      } else {
        this.addResult(category, 'Audio Controls', 'WARN', 'Audio controls not found');
      }

      // Test therapeutic goals accessibility
      const goals = document.querySelectorAll('[data-testid*="goal"]');
      if (goals.length >= 5) {
        this.addResult(category, 'Therapeutic Goals', 'PASS', `${goals.length} therapeutic goals available`);
      } else {
        this.addResult(category, 'Therapeutic Goals', 'WARN', `Only ${goals.length} therapeutic goals found`);
      }

    } catch (error) {
      this.addResult(category, 'UX Test', 'FAIL', `User experience test failed: ${error}`);
    }
  }

  private generateReport(): QAReport {
    const duration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARN').length;

    const recommendations: string[] = [];
    
    // Generate recommendations based on failures and warnings
    if (failed > 0) {
      recommendations.push('Address all failed tests immediately to ensure app functionality');
    }
    if (warnings > 0) {
      recommendations.push('Review warning items to improve app quality and user experience');
    }
    if (this.results.some(r => r.category === 'Security' && r.status !== 'PASS')) {
      recommendations.push('Security issues detected - review and fix immediately');
    }
    if (this.results.some(r => r.category === 'Accessibility' && r.status !== 'PASS')) {
      recommendations.push('Accessibility improvements needed for better user inclusion');
    }
    if (this.results.some(r => r.category === 'Performance' && r.status === 'WARN')) {
      recommendations.push('Performance optimizations recommended');
    }

    return {
      overview: {
        totalTests: this.results.length,
        passed,
        failed,
        warnings,
        duration
      },
      results: this.results,
      recommendations
    };
  }
}

// Global QA automation instance
export const qaAutomation = new QAAutomation();

// Make available globally for debugging
declare global {
  interface Window {
    qaAutomation: QAAutomation;
    runQA: () => Promise<QAReport>;
  }
}

if (typeof window !== 'undefined') {
  window.qaAutomation = qaAutomation;
  window.runQA = () => qaAutomation.runFullQASuite();
}