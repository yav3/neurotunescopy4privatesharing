// Audio URL Debugging Utility
// Helps diagnose playback issues with encoded URLs

export interface AudioUrlTest {
  bucket: string;
  original: string;
  encoded: string;
  publicUrl: string;
  status: 'untested' | 'working' | 'failed' | 'testing';
  error?: string;
  contentType?: string;
  fileSize?: number;
}

export class AudioUrlDebugger {
  private static readonly SUPABASE_STORAGE_URL = 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public';
  
  /**
   * Test a single audio URL to check if it's accessible
   */
  static async testAudioUrl(
    bucket: string, 
    originalFileName: string, 
    encodedFileName?: string
  ): Promise<AudioUrlTest> {
    const encoded = encodedFileName || encodeURIComponent(originalFileName);
    const publicUrl = `${this.SUPABASE_STORAGE_URL}/${bucket}/${encoded}`;
    
    const result: AudioUrlTest = {
      bucket,
      original: originalFileName,
      encoded,
      publicUrl,
      status: 'testing'
    };
    
    try {
      console.log(`🧪 Testing audio URL: ${publicUrl}`);
      
      const response = await fetch(publicUrl, { 
        method: 'HEAD',
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        result.status = 'working';
        result.contentType = response.headers.get('Content-Type') || undefined;
        const contentLength = response.headers.get('Content-Length');
        result.fileSize = contentLength ? parseInt(contentLength) : undefined;
        
        console.log(`✅ URL working: ${publicUrl}`);
      } else {
        result.status = 'failed';
        result.error = `HTTP ${response.status}: ${response.statusText}`;
        console.log(`❌ URL failed: ${publicUrl} - ${result.error}`);
      }
    } catch (error) {
      result.status = 'failed';
      result.error = error instanceof Error ? error.message : 'Unknown error';
      console.log(`❌ URL error: ${publicUrl} - ${result.error}`);
    }
    
    return result;
  }
  
  /**
   * Test multiple audio URLs in parallel with rate limiting
   */
  static async testMultipleUrls(
    urlTests: Array<{ bucket: string; original: string; encoded?: string }>,
    batchSize: number = 5
  ): Promise<AudioUrlTest[]> {
    const results: AudioUrlTest[] = [];
    
    console.log(`🧪 Testing ${urlTests.length} URLs in batches of ${batchSize}...`);
    
    for (let i = 0; i < urlTests.length; i += batchSize) {
      const batch = urlTests.slice(i, i + batchSize);
      console.log(`📦 Testing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(urlTests.length / batchSize)}`);
      
      const batchResults = await Promise.all(
        batch.map(test => this.testAudioUrl(test.bucket, test.original, test.encoded))
      );
      
      results.push(...batchResults);
      
      // Add small delay between batches to avoid overwhelming the server
      if (i + batchSize < urlTests.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }
  
  /**
   * Analyze URL encoding patterns and suggest fixes
   */
  static analyzeEncodingIssues(tests: AudioUrlTest[]): {
    summary: {
      total: number;
      working: number;
      failed: number;
      workingRate: number;
    };
    commonIssues: string[];
    recommendations: string[];
  } {
    const total = tests.length;
    const working = tests.filter(t => t.status === 'working').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const workingRate = total > 0 ? (working / total) * 100 : 0;
    
    const commonIssues: string[] = [];
    const recommendations: string[] = [];
    
    // Analyze common failure patterns
    const failedTests = tests.filter(t => t.status === 'failed');
    const errorPatterns = new Map<string, number>();
    
    failedTests.forEach(test => {
      if (test.error) {
        const key = test.error.split(':')[0]; // Get error type
        errorPatterns.set(key, (errorPatterns.get(key) || 0) + 1);
      }
    });
    
    // Common encoding issues
    const hasSpecialChars = tests.some(t => /[;,()]/.test(t.original));
    const hasSpaces = tests.some(t => /\s/.test(t.original));
    const hasUnicode = tests.some(t => /[^\x00-\x7F]/.test(t.original));
    
    if (hasSpecialChars) {
      commonIssues.push('Files with special characters (;,()) detected');
      recommendations.push('Ensure all special characters are properly URL-encoded');
    }
    
    if (hasSpaces) {
      commonIssues.push('Files with spaces detected');
      recommendations.push('Ensure spaces are encoded as %20');
    }
    
    if (hasUnicode) {
      commonIssues.push('Files with Unicode characters detected');
      recommendations.push('Ensure Unicode characters are properly UTF-8 encoded');
    }
    
    // Error-based recommendations
    if (errorPatterns.has('HTTP 404')) {
      recommendations.push('Check file names match exactly in storage bucket');
      recommendations.push('Verify bucket names are correct');
    }
    
    if (errorPatterns.has('HTTP 403')) {
      recommendations.push('Check bucket public permissions');
      recommendations.push('Verify storage policies allow public access');
    }
    
    if (errorPatterns.has('AbortError') || errorPatterns.has('TimeoutError')) {
      recommendations.push('Some files are slow to respond - check network connectivity');
    }
    
    return {
      summary: { total, working, failed, workingRate },
      commonIssues,
      recommendations
    };
  }
  
  /**
   * Generate a report of URL test results
   */
  static generateReport(tests: AudioUrlTest[]): string {
    const analysis = this.analyzeEncodingIssues(tests);
    
    let report = `🎵 Audio URL Debug Report\n`;
    report += `=====================================\n\n`;
    
    report += `📊 Summary:\n`;
    report += `- Total URLs tested: ${analysis.summary.total}\n`;
    report += `- Working URLs: ${analysis.summary.working}\n`;
    report += `- Failed URLs: ${analysis.summary.failed}\n`;
    report += `- Success rate: ${analysis.summary.workingRate.toFixed(1)}%\n\n`;
    
    if (analysis.commonIssues.length > 0) {
      report += `⚠️ Common Issues Found:\n`;
      analysis.commonIssues.forEach(issue => {
        report += `- ${issue}\n`;
      });
      report += `\n`;
    }
    
    if (analysis.recommendations.length > 0) {
      report += `💡 Recommendations:\n`;
      analysis.recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
      report += `\n`;
    }
    
    // Show failed URLs for debugging
    const failedTests = tests.filter(t => t.status === 'failed');
    if (failedTests.length > 0 && failedTests.length <= 10) {
      report += `❌ Failed URLs (first 10):\n`;
      failedTests.slice(0, 10).forEach(test => {
        report += `- ${test.bucket}/${test.original}\n`;
        report += `  Error: ${test.error}\n`;
        report += `  URL: ${test.publicUrl}\n\n`;
      });
    }
    
    return report;
  }
}

// Helper function to create URL test data from your file list
export function createUrlTestsFromFileList(fileList: Array<{ bucket: string; original: string; encoded: string }>): Array<{ bucket: string; original: string; encoded: string }> {
  return fileList.map(file => ({
    bucket: file.bucket,
    original: file.original,
    encoded: file.encoded
  }));
}

// Global debugging functions for console access
if (typeof window !== 'undefined') {
  (window as any).testAudioUrl = AudioUrlDebugger.testAudioUrl;
  (window as any).testMultipleAudioUrls = AudioUrlDebugger.testMultipleUrls;
  (window as any).analyzeAudioUrls = AudioUrlDebugger.analyzeEncodingIssues;
  (window as any).generateAudioReport = AudioUrlDebugger.generateReport;
}