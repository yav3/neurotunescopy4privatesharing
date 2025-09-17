// Validate bucket content matches expected genre
export class BucketContentValidator {
  private static expectedContent = {
    'sonatasforstress': {
      genre: 'Classical Sonatas',
      expectedKeywords: ['sonata', 'classical', 'bach', 'beethoven', 'mozart', 'piano', 'violin'],
      unexpectedKeywords: ['binaural', 'beats', 'frequency', 'hz', 'new age', 'sleep', 'meditation']
    },
    'Chopin': {
      genre: 'Chopin Piano',
      expectedKeywords: ['chopin', 'piano', 'nocturne', 'waltz', 'polonaise', 'etude'],
      unexpectedKeywords: ['binaural', 'beats', 'frequency', 'hz', 'edm', 'electronic']
    },
    'newageworldstressanxietyreduction': {
      genre: 'New Age & World',
      expectedKeywords: ['new age', 'world', 'ambient', 'meditation', 'relaxation'],
      unexpectedKeywords: ['classical', 'sonata', 'mozart', 'beethoven']
    }
  };

  static validateBucketContent(bucketName: string, tracks: any[]): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const expected = this.expectedContent[bucketName as keyof typeof this.expectedContent];
    
    if (!expected) {
      return {
        isValid: true,
        issues: [],
        recommendations: [`No validation rules defined for bucket: ${bucketName}`]
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    console.log(`🔍 Validating bucket "${bucketName}" content for genre: ${expected.genre}`);
    console.log(`📋 Tracks to validate: ${tracks.length}`);

    tracks.slice(0, 10).forEach((track, i) => {
      const title = (track.title || '').toLowerCase();
      const artist = (track.artist || '').toLowerCase();
      const searchText = `${title} ${artist}`;

      console.log(`🎵 Track ${i + 1}: "${track.title}" by "${track.artist || 'Unknown'}"`);

      // Check for unexpected content
      const foundUnexpected = expected.unexpectedKeywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );

      if (foundUnexpected) {
        const foundKeywords = expected.unexpectedKeywords.filter(keyword => 
          searchText.includes(keyword.toLowerCase())
        );
        issues.push(`Track "${track.title}" contains unexpected keywords: ${foundKeywords.join(', ')}`);
        console.warn(`❌ Unexpected content in ${bucketName}:`, track.title);
      }

      // Check for expected content (at least some should match)
      const foundExpected = expected.expectedKeywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );

      if (!foundExpected && i < 5) { // Only check first 5 tracks to avoid spam
        console.log(`⚠️ No expected keywords found in: ${track.title}`);
      }
    });

    // Overall validation
    const unexpectedCount = issues.length;
    const totalChecked = Math.min(tracks.length, 10);
    const unexpectedRatio = unexpectedCount / totalChecked;

    const isValid = unexpectedRatio < 0.3; // Less than 30% unexpected content

    if (!isValid) {
      recommendations.push(`Bucket "${bucketName}" appears to contain wrong content for ${expected.genre}`);
      recommendations.push(`Expected: ${expected.expectedKeywords.join(', ')}`);
      recommendations.push(`Found unexpected: ${expected.unexpectedKeywords.join(', ')}`);
    }

    console.log(`📊 Validation result for ${bucketName}:`, {
      isValid,
      unexpectedRatio: `${(unexpectedRatio * 100).toFixed(1)}%`,
      issues: issues.length,
      recommendations: recommendations.length
    });

    return { isValid, issues, recommendations };
  }

  static logValidationResults(bucketName: string, tracks: any[]) {
    const result = this.validateBucketContent(bucketName, tracks);
    
    if (!result.isValid) {
      console.group(`🚨 CONTENT MISMATCH DETECTED: ${bucketName}`);
      result.issues.forEach(issue => console.warn('❌', issue));
      result.recommendations.forEach(rec => console.info('💡', rec));
      console.groupEnd();
      
      // Show user-friendly message
      import('sonner').then(({ toast }) => {
        toast.error(`Content mismatch detected in ${bucketName}`, {
          description: `This category may contain unexpected music. We're working to fix this.`,
          duration: 5000
        });
      });
    } else {
      console.log(`✅ Bucket content validation passed: ${bucketName}`);
    }

    return result;
  }
}

// Make available for debugging
if (typeof window !== 'undefined') {
  (window as any).BucketContentValidator = BucketContentValidator;
}