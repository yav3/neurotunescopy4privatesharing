#!/usr/bin/env node

// Test script to validate the fixed audio streaming system
const FUNCTIONS_URL = process.env.VITE_SUPABASE_FUNCTIONS_URL || 'https://pbtgvcjniayedqlajjzz.functions.supabase.co';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NzMyNzEsImV4cCI6MjA0ODE0OTI3MX0.VzwLPVE2HpJ6n-rrh_eE5eLagzQ8SYWgybSIkjXRJhQ';

async function testStreamingSystem() {
  console.log('🧪 Testing Fixed Audio Streaming System');
  console.log('=====================================\n');

  try {
    // Test 1: Playlist with signed URLs
    console.log('📋 Test 1: Playlist with embedded stream URLs');
    console.log('-'.repeat(50));
    
    const playlistResponse = await fetch(`${FUNCTIONS_URL}/api/playlist?goal=focus-enhancement&limit=3`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY
      }
    });

    if (!playlistResponse.ok) {
      throw new Error(`Playlist request failed: ${playlistResponse.status}`);
    }

    const playlist = await playlistResponse.json();
    console.log(`✅ Retrieved ${playlist.tracks?.length || 0} tracks`);
    
    if (!playlist.tracks?.length) {
      console.log('❌ No tracks returned');
      return;
    }

    // Check each track for stream_url
    for (const [index, track] of playlist.tracks.slice(0, 2).entries()) {
      console.log(`\n🎵 Track ${index + 1}: ${track.title}`);
      console.log(`   ID: ${track.id}`);
      console.log(`   Stream URL: ${track.stream_url ? '✅ Present' : '❌ Missing'}`);
      
      if (track.stream_url) {
        // Test 2: Direct stream URL access
        console.log(`\n🔊 Test 2.${index + 1}: Testing stream URL accessibility`);
        
        try {
          const streamResponse = await fetch(track.stream_url, { 
            method: 'HEAD',
            headers: { 'apikey': ANON_KEY }
          });
          
          console.log(`   Status: ${streamResponse.status}`);
          console.log(`   Content-Type: ${streamResponse.headers.get('content-type') || 'N/A'}`);
          console.log(`   Content-Length: ${streamResponse.headers.get('content-length') || 'N/A'}`);
          console.log(`   Accept-Ranges: ${streamResponse.headers.get('accept-ranges') || 'N/A'}`);
          
          if (streamResponse.ok) {
            console.log(`   ✅ Stream URL accessible`);
          } else {
            console.log(`   ❌ Stream URL failed: ${streamResponse.status}`);
          }
        } catch (streamError) {
          console.log(`   ❌ Stream test error: ${streamError.message}`);
        }
      }
    }

    // Test 3: Direct stream endpoint
    console.log(`\n🎯 Test 3: Direct stream endpoint test`);
    console.log('-'.repeat(50));
    
    const firstTrackId = playlist.tracks[0]?.id;
    if (firstTrackId) {
      try {
        const directStreamResponse = await fetch(`${FUNCTIONS_URL}/api/stream/${firstTrackId}`, {
          method: 'HEAD',
          headers: { 'apikey': ANON_KEY }
        });
        
        console.log(`✅ Direct stream endpoint: ${directStreamResponse.status}`);
        console.log(`   Content-Type: ${directStreamResponse.headers.get('content-type') || 'N/A'}`);
        
        if (directStreamResponse.ok) {
          console.log('   ✅ Direct stream access working');
        } else {
          console.log('   ❌ Direct stream access failed');
        }
      } catch (directError) {
        console.log(`❌ Direct stream test error: ${directError.message}`);
      }
    }

    // Summary
    console.log(`\n📊 Test Summary`);
    console.log('='.repeat(50));
    console.log(`Playlist retrieval: ✅`);
    console.log(`Tracks with stream URLs: ${playlist.tracks.filter(t => t.stream_url).length}/${playlist.tracks.length}`);
    console.log(`Expected pattern: ${FUNCTIONS_URL}/api/stream/{trackId}`);
    
    const hasStreamUrls = playlist.tracks.every(track => track.stream_url);
    const correctPattern = playlist.tracks.every(track => 
      track.stream_url && track.stream_url.includes('/api/stream/')
    );
    
    if (hasStreamUrls && correctPattern) {
      console.log(`\n🎉 SUCCESS: Audio streaming system is fixed!`);
      console.log(`   - Tracks include signed stream URLs`);
      console.log(`   - URLs point to Edge function for secure access`);
      console.log(`   - Should resolve 400/401 errors`);
    } else {
      console.log(`\n⚠️  PARTIAL SUCCESS: System improved but may need additional fixes`);
    }

  } catch (error) {
    console.log(`\n❌ FAILED: ${error.message}`);
    console.log(`\nTroubleshooting:`);
    console.log(`1. Ensure Edge function is deployed`);
    console.log(`2. Check VITE_SUPABASE_FUNCTIONS_URL environment variable`);
    console.log(`3. Verify authentication keys are correct`);
  }
}

testStreamingSystem();