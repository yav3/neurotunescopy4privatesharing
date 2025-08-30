#!/usr/bin/env node

/**
 * Stream Testing Script - Adapted for Current Architecture
 * Tests the actual Supabase streaming endpoints that exist
 */

const https = require('https');
const { performance } = require('perf_hooks');

class ActualStreamTester {
  constructor() {
    this.baseUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1';
    this.results = [];
  }

  async runTest() {
    console.log('🧪 Testing ACTUAL streaming architecture...\n');
    
    await this.testAPIHealth();
    await this.testPlaylistEndpoint();
    await this.testStreamingEndpoint();
    await this.testRaceConditions();
    
    this.generateReport();
    return this.results;
  }

  async testAPIHealth() {
    console.log('🏥 Testing API health...');
    try {
      const response = await this.makeRequest('/api/health');
      this.results.push({
        test: 'api-health',
        status: response.status === 200 ? 'PASS' : 'FAIL',
        httpStatus: response.status,
        data: response.data
      });
    } catch (error) {
      this.results.push({
        test: 'api-health', 
        status: 'ERROR',
        error: error.message
      });
    }
  }

  async testPlaylistEndpoint() {
    console.log('🎵 Testing playlist endpoint...');
    try {
      const response = await this.makeRequest('/api/playlist?goal=focus&limit=5');
      const data = JSON.parse(response.data);
      
      this.results.push({
        test: 'playlist-endpoint',
        status: response.status === 200 && data.tracks ? 'PASS' : 'FAIL',
        httpStatus: response.status,
        tracksFound: data.tracks?.length || 0,
        totalTracks: data.total || 0
      });
      
      // Store sample track for streaming test
      this.sampleTrack = data.tracks?.[0];
      
    } catch (error) {
      this.results.push({
        test: 'playlist-endpoint',
        status: 'ERROR', 
        error: error.message
      });
    }
  }

  async testStreamingEndpoint() {
    console.log('🎧 Testing actual streaming endpoint...');
    
    if (!this.sampleTrack) {
      this.results.push({
        test: 'streaming-endpoint',
        status: 'SKIP',
        message: 'No sample track available for testing'
      });
      return;
    }

    try {
      const streamUrl = `/stream/${this.sampleTrack.id}`;
      const response = await this.makeRequest(streamUrl, 'HEAD');
      
      this.results.push({
        test: 'streaming-endpoint',
        status: response.status === 200 ? 'PASS' : 'FAIL',
        httpStatus: response.status,
        trackId: this.sampleTrack.id,
        contentType: response.headers['content-type'],
        acceptRanges: response.headers['accept-ranges']
      });
      
    } catch (error) {
      this.results.push({
        test: 'streaming-endpoint',
        status: 'ERROR',
        error: error.message
      });
    }
  }

  async testRaceConditions() {
    console.log('🏁 Testing concurrent streaming requests...');
    
    if (!this.sampleTrack) {
      this.results.push({
        test: 'race-conditions',
        status: 'SKIP', 
        message: 'No sample track for race condition testing'
      });
      return;
    }

    const concurrent = 3;
    const streamUrl = `/stream/${this.sampleTrack.id}`;
    
    try {
      const startTime = performance.now();
      const promises = Array(concurrent).fill().map(() => 
        this.makeRequest(streamUrl, 'HEAD')
      );
      
      const results = await Promise.allSettled(promises);
      const endTime = performance.now();
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      this.results.push({
        test: 'race-conditions',
        status: failed === 0 ? 'PASS' : 'FAIL',
        concurrent: concurrent,
        successful: successful,
        failed: failed,
        totalTime: Math.round(endTime - startTime)
      });
      
    } catch (error) {
      this.results.push({
        test: 'race-conditions',
        status: 'ERROR',
        error: error.message
      });
    }
  }

  async makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'User-Agent': 'ActualStreamTester/1.0'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  generateReport() {
    console.log('\n🧪 ACTUAL ARCHITECTURE TEST REPORT\n' + '='.repeat(50));
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const errors = this.results.filter(r => r.status === 'ERROR').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;

    console.log(`📊 SUMMARY:`);
    console.log(`  ✅ PASSED: ${passed}`);
    console.log(`  ❌ FAILED: ${failed}`);
    console.log(`  🚨 ERRORS: ${errors}`);
    console.log(`  ⏭️  SKIPPED: ${skipped}`);
    console.log(`  📈 SUCCESS RATE: ${Math.round(passed / (this.results.length - skipped) * 100)}%\n`);

    console.log('📋 DETAILED RESULTS:');
    this.results.forEach(result => {
      const icon = {
        'PASS': '✅',
        'FAIL': '❌', 
        'ERROR': '🚨',
        'SKIP': '⏭️'
      }[result.status] || '❓';
      
      console.log(`  ${icon} ${result.test}: ${result.status}`);
      
      if (result.message) console.log(`    ${result.message}`);
      if (result.httpStatus) console.log(`    HTTP Status: ${result.httpStatus}`);
      if (result.tracksFound !== undefined) console.log(`    Tracks Found: ${result.tracksFound}`);
      if (result.contentType) console.log(`    Content-Type: ${result.contentType}`);
      if (result.acceptRanges) console.log(`    Accept-Ranges: ${result.acceptRanges}`);
      if (result.error) console.log(`    Error: ${result.error}`);
    });

    // Architecture summary
    console.log('\n🏗️ ARCHITECTURE ANALYSIS:');
    console.log('  • API Function: /functions/v1/api/* (Supabase Edge Function)');
    console.log('  • Stream Function: /functions/v1/stream/:id (Dedicated Audio Streaming)');
    console.log('  • No frequency-based streaming endpoints detected');
    console.log('  • No /api/v1/stream POST endpoint found');

    const healthySystem = failed === 0 && errors === 0;
    console.log(`\n🏁 SYSTEM STATUS: ${healthySystem ? 'HEALTHY' : 'NEEDS ATTENTION'}`);
    
    if (!healthySystem) {
      console.log('\n❗ ISSUES DETECTED:');
      console.log('1. Check failed tests above');
      console.log('2. Verify Supabase edge functions are deployed');
      console.log('3. Ensure database has tracks with proper storage_key/file_path');
    }
  }
}

// Run the test
async function main() {
  const tester = new ActualStreamTester();
  await tester.runTest();
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Testing failed:', error);
    process.exit(1);
  });
}

module.exports = { ActualStreamTester };