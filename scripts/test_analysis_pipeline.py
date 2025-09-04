#!/usr/bin/env python3
"""
Test Audio Analysis Pipeline
Quick test with a small batch to verify the system works
"""

import asyncio
import asyncpg
from pathlib import Path
from audio_analysis_client import SupabaseAnalysisClient
from datetime import datetime

async def test_edge_function_connectivity():
    """Test basic connectivity to the Edge Function"""
    
    print("🔌 Testing Edge Function connectivity...")
    
    EDGE_FUNCTION_URL = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis"
    API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE"
    
    # Create test analysis result
    test_results = [
        {
            'track_id': 'test-track-id-123',
            'musical_key': 'C',
            'camelot_key': '8B',
            'key_confidence': 0.89,
            'bpm_multifeature': 120.5,
            'danceability_score': 0.75,
            'mood_happy': 0.6,
            'mood_relaxed': 0.8,
            'comprehensive_analysis': {
                'test': True,
                'timestamp': datetime.now().isoformat()
            },
            'analysis_timestamp': datetime.now().isoformat(),
            'analysis_version': '2.0_test'
        }
    ]
    
    async with SupabaseAnalysisClient(EDGE_FUNCTION_URL, API_KEY) as client:
        result = await client.send_analysis_batch(test_results, "connectivity_test")
        
        if result.get('success'):
            print("✅ Edge Function connectivity test passed!")
            print(f"   Processed: {result.get('processed_count', 0)}")
            print(f"   Errors: {result.get('error_count', 0)}")
            return True
        else:
            print(f"❌ Edge Function test failed: {result.get('error')}")
            return False

async def get_sample_tracks(db_url: str, limit: int = 3):
    """Get a small sample of tracks for testing"""
    
    print(f"🎵 Getting {limit} sample tracks from database...")
    
    conn = await asyncpg.connect(db_url)
    try:
        query = """
            SELECT id, title, storage_key, storage_bucket, artist
            FROM tracks 
            WHERE storage_bucket = 'audio' 
            AND storage_key IS NOT NULL 
            AND storage_key != ''
            ORDER BY title
            LIMIT $1
        """
        
        tracks = await conn.fetch(query, limit)
        
        print(f"📊 Found {len(tracks)} sample tracks:")
        for track in tracks:
            print(f"   - {track['title']} ({track['storage_key']})")
        
        return tracks
        
    finally:
        await conn.close()

async def test_with_sample_tracks(db_url: str, audio_files_dir: str):
    """Test the complete pipeline with sample tracks"""
    
    print("🧪 Testing complete pipeline with sample tracks...")
    
    # Get sample tracks
    tracks = await get_sample_tracks(db_url, limit=3)
    
    if not tracks:
        print("❌ No tracks found for testing")
        return False
    
    # Check if audio files exist
    audio_path = Path(audio_files_dir)
    print(f"📁 Checking audio files in: {audio_path}")
    
    found_files = []
    missing_files = []
    
    for track in tracks:
        file_path = audio_path / track['storage_key']
        if file_path.exists():
            found_files.append(track)
            print(f"   ✅ Found: {track['storage_key']}")
        else:
            missing_files.append(track)
            print(f"   ❌ Missing: {track['storage_key']}")
    
    if not found_files:
        print(f"\n⚠️  No audio files found in {audio_files_dir}")
        print("Please update AUDIO_FILES_DIR to point to your audio files location")
        return False
    
    # Create simulated analysis results for found files
    print(f"\n🔬 Creating test analysis results for {len(found_files)} tracks...")
    
    test_results = []
    for track in found_files:
        result = create_test_analysis_result(track)
        test_results.append(result)
        print(f"   📊 {track['title']} → {result['camelot_key']} @ {result['bpm_multifeature']} BPM")
    
    # Upload to Supabase
    EDGE_FUNCTION_URL = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis"
    API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE"
    
    async with SupabaseAnalysisClient(EDGE_FUNCTION_URL, API_KEY) as client:
        batch_results = await client.send_analysis_results(test_results, batch_size=5)
    
    # Check results
    successful = len([r for r in batch_results if r.get('success')])
    
    if successful > 0:
        print(f"\n✅ Pipeline test successful!")
        print(f"   Uploaded: {successful}/{len(batch_results)} batches")
        print(f"   Ready to process all 367 tracks!")
        return True
    else:
        print(f"\n❌ Pipeline test failed")
        for result in batch_results:
            if not result.get('success'):
                print(f"   Error: {result.get('error')}")
        return False

def create_test_analysis_result(track):
    """Create realistic test analysis data"""
    
    import random
    
    camelot_keys = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B',
                   '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B']
    musical_keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    
    return {
        'track_id': str(track['id']),
        'musical_key': random.choice(musical_keys),
        'camelot_key': random.choice(camelot_keys),
        'key_confidence': round(random.uniform(0.7, 0.95), 3),
        'bpm_multifeature': round(random.uniform(80, 160), 1),
        'danceability_score': round(random.uniform(0.3, 0.9), 3),
        'onset_rate_per_second': round(random.uniform(1.0, 4.0), 3),
        'spectral_centroid_mean': round(random.uniform(1500, 3500), 1),
        'spectral_rolloff_mean': round(random.uniform(3000, 7000), 1),
        'mood_happy': round(random.uniform(0.1, 0.9), 3),
        'mood_sad': round(random.uniform(0.0, 0.6), 3),
        'mood_relaxed': round(random.uniform(0.2, 0.8), 3),
        'mood_aggressive': round(random.uniform(0.0, 0.4), 3),
        'comprehensive_analysis': {
            'test_mode': True,
            'track_title': track['title'],
            'storage_key': track['storage_key'],
            'analysis_timestamp': datetime.now().isoformat()
        },
        'analysis_timestamp': datetime.now().isoformat(),
        'analysis_version': '2.0_test'
    }

async def main():
    """Run all pipeline tests"""
    
    print("🧪 Audio Analysis Pipeline Test Suite")
    print("=" * 50)
    
    # Configuration - UPDATE THESE PATHS
    DATABASE_URL = "postgresql://postgres:[YOUR-PASSWORD]@db.pbtgvcjniayedqlajjzz.supabase.co:5432/postgres"
    AUDIO_FILES_DIR = "/path/to/your/audio/files"  # UPDATE THIS PATH
    
    # Test 1: Edge Function connectivity
    print("\n1️⃣  Testing Edge Function connectivity...")
    connectivity_ok = await test_edge_function_connectivity()
    
    if not connectivity_ok:
        print("❌ Edge Function connectivity failed. Check your setup.")
        return
    
    print("✅ Edge Function is working!")
    
    # Test 2: Database connection and sample tracks
    print("\n2️⃣  Testing database connection...")
    try:
        tracks = await get_sample_tracks(DATABASE_URL, limit=3)
        if tracks:
            print("✅ Database connection working!")
        else:
            print("⚠️  No tracks found in database")
            return
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("Please update DATABASE_URL with your correct password")
        return
    
    # Test 3: Complete pipeline
    print("\n3️⃣  Testing complete pipeline...")
    pipeline_ok = await test_with_sample_tracks(DATABASE_URL, AUDIO_FILES_DIR)
    
    if pipeline_ok:
        print("\n🎉 All tests passed! Your pipeline is ready.")
        print("\nNext steps:")
        print("1. Update AUDIO_FILES_DIR in integrated_audio_processor.py")
        print("2. Replace simulation with your ComprehensiveAudioAnalyzer")
        print("3. Run: python integrated_audio_processor.py")
    else:
        print("\n⚠️  Pipeline test had issues. Please review the errors above.")

if __name__ == "__main__":
    asyncio.run(main())