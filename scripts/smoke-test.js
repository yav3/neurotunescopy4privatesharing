#!/usr/bin/env node

/**
 * Smoke test script for API endpoints
 * Run with: node scripts/smoke-test.js
 */

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/api';

async function testEndpoint(name, url, options = {}) {
  console.log(`\n🧪 Testing ${name}...`);
  console.log(`   ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.headers.get('accept-ranges')) {
      console.log(`   Accept-Ranges: ${response.headers.get('accept-ranges')}`);
    }
    
    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`   Response:`, data);
      } else {
        console.log(`   Response: [${contentType}] ${response.body ? 'Has body' : 'No body'}`);
      }
      console.log(`   ✅ ${name} PASSED`);
      return { success: true, data: response };
    } else {
      const text = await response.text();
      console.log(`   Error: ${text}`);
      console.log(`   ❌ ${name} FAILED`);
      return { success: false, error: text };
    }
  } catch (error) {
    console.log(`   Exception: ${error.message}`);
    console.log(`   ❌ ${name} FAILED`);
    return { success: false, error: error.message };
  }
}

async function runSmokeTests() {
  console.log('🔥 API Smoke Test Suite');
  console.log(`📍 Base URL: ${API_BASE_URL}`);
  console.log('=' + '='.repeat(50));

  const tests = [
    {
      name: 'Health Check',
      url: `${API_BASE_URL}/health`,
      options: { method: 'GET' }
    },
    {
      name: 'Playlist Endpoint',
      url: `${API_BASE_URL}/api/playlist`,
      options: {
        method: 'POST',
        body: JSON.stringify({ goal: 'focus', limit: 5 })
      }
    },
    {
      name: 'Debug Storage',
      url: `${API_BASE_URL}/api/debug/storage`,
      options: { method: 'GET' }
    }
  ];

  const results = [];
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url, test.options);
    results.push({ ...test, ...result });
  }

  // Test streaming endpoint if we got tracks from playlist
  const playlistResult = results.find(r => r.name === 'Playlist Endpoint');
  if (playlistResult?.success && playlistResult.data) {
    try {
      const playlistData = await playlistResult.data.json();
      if (playlistData.tracks && playlistData.tracks.length > 0) {
        const trackId = playlistData.tracks[0].id;
        const streamResult = await testEndpoint(
          'Stream Metadata',
          `${API_BASE_URL}/api/stream?id=${encodeURIComponent(trackId)}`,
          { method: 'GET' }
        );
        results.push({ name: 'Stream Metadata', ...streamResult });
      }
    } catch (e) {
      console.log('   ⚠️ Could not test streaming - playlist data unavailable');
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary:');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`   ${status} ${result.name}`);
  });
  
  console.log(`\n🎯 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests PASSED! API is healthy.');
    process.exit(0);
  } else {
    console.log('💥 Some tests FAILED. Check the API configuration.');
    process.exit(1);
  }
}

// Run the tests
runSmokeTests().catch(error => {
  console.error('💥 Smoke test suite crashed:', error);
  process.exit(1);
});