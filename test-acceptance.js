#!/usr/bin/env node

// Quick acceptance test script for your Supabase function
// Run with: node test-acceptance.js

const FUNCTION_URL = 'https://pbtgvcjniayedqlajjzz.functions.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE';

async function test(name, url, options = {}) {
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`📡 URL: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        ...options.headers
      },
      ...options
    });
    
    const text = await response.text();
    console.log(`✅ Status: ${response.status}`);
    
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log(`📊 Data:`, JSON.stringify(data, null, 2));
        return { success: true, data, status: response.status };
      } catch {
        console.log(`📝 Text Response:`, text);
        return { success: true, text, status: response.status };
      }
    } else {
      console.log(`❌ Error Response:`, text);
      return { success: false, error: text, status: response.status };
    }
  } catch (error) {
    console.log(`💥 Network Error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Running Acceptance Tests\n');
  
  // Test 1: Health Check
  const health = await test(
    'Health Check (no auth required)',
    `${FUNCTION_URL}/api`
  );
  
  // Test 2: Playlist GET (read-only)
  const playlist = await test(
    'Playlist GET (read-only)',
    `${FUNCTION_URL}/api/playlist?goal=focus-enhancement&limit=5`
  );
  
  // Test 3: Check if we get tracks with focus gate logic
  if (playlist.success && playlist.data?.tracks) {
    console.log('\n🔍 Focus Gate Analysis:');
    const tracks = playlist.data.tracks;
    console.log(`📈 Total tracks returned: ${tracks.length}`);
    
    const focusTerms = ['focus', 'concentration', 'study', 'attention', 'productivity', 'clarity'];
    const withFocusTerms = tracks.filter(track => {
      const title = (track.title || '').toLowerCase();
      return focusTerms.some(term => title.includes(term));
    });
    
    console.log(`🎯 Tracks with focus terms: ${withFocusTerms.length}`);
    console.log(`📊 Tracks without focus terms: ${tracks.length - withFocusTerms.length}`);
    
    if (tracks.length > 0) {
      console.log(`\n📝 Sample track titles:`);
      tracks.slice(0, 3).forEach((track, i) => {
        console.log(`  ${i + 1}. "${track.title}" by ${track.artist || 'Unknown'}`);
      });
    }
  }
  
  // Test 4: Test streaming (basic URL generation)
  if (playlist.success && playlist.data?.tracks?.[0]) {
    const firstTrack = playlist.data.tracks[0];
    await test(
      'Stream URL Test (HEAD request)',
      `${FUNCTION_URL}/api/stream?id=${firstTrack.id}`,
      { method: 'HEAD' }
    );
  }
  
  console.log('\n✨ Tests completed!');
  console.log('\nNext steps:');
  console.log('1. If all tests pass → Your 401s and focus-gate are fixed!');
  console.log('2. If any test fails → Share the error output');
  console.log('3. Check your database for tracks with focus terms: SELECT id, title FROM tracks WHERE title ~* \'focus\' AND audio_status=\'working\' LIMIT 5;');
}

runTests().catch(console.error);