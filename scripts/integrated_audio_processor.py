#!/usr/bin/env python3
"""
Integrated Audio Processor with Supabase Upload
Complete pipeline: analyze audio files → upload to Supabase via Edge Function
"""

import asyncio
import asyncpg
import pandas as pd
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
import json

# Import your comprehensive audio analyzer
from audio_analysis_client import SupabaseAnalysisClient

class IntegratedAudioBucketProcessor:
    """Process audio bucket tracks and upload analysis results to Supabase"""
    
    def __init__(self, db_connection_string: str, edge_function_url: str, api_key: str = None):
        self.db_connection = db_connection_string
        self.edge_function_url = edge_function_url
        self.api_key = api_key
        # Note: You'll need to import your ComprehensiveAudioAnalyzer here
        # self.analyzer = ComprehensiveAudioAnalyzer()
        
    async def get_audio_bucket_tracks(self, limit: int = None):
        """Get tracks from the audio bucket that need analysis"""
        conn = await asyncpg.connect(self.db_connection)
        try:
            query = """
                SELECT id, title, storage_key, file_path, storage_bucket, artist, genre
                FROM tracks 
                WHERE storage_bucket = 'audio' 
                AND storage_key IS NOT NULL 
                AND storage_key != ''
                AND (comprehensive_analysis IS NULL OR analysis_timestamp IS NULL)
                ORDER BY title
            """
            
            if limit:
                query += f" LIMIT {limit}"
                
            tracks = await conn.fetch(query)
            print(f"📊 Found {len(tracks)} tracks needing analysis in audio bucket")
            return tracks
            
        finally:
            await conn.close()
    
    async def get_analysis_status(self):
        """Get current analysis status from database"""
        conn = await asyncpg.connect(self.db_connection)
        try:
            query = """
                SELECT 
                    COUNT(*) as total_tracks,
                    COUNT(CASE WHEN comprehensive_analysis IS NOT NULL THEN 1 END) as analyzed_tracks,
                    COUNT(CASE WHEN camelot IS NOT NULL THEN 1 END) as camelot_detected,
                    COUNT(CASE WHEN bpm IS NOT NULL AND bpm > 0 THEN 1 END) as bpm_detected,
                    COUNT(CASE WHEN mood_happy IS NOT NULL THEN 1 END) as mood_analyzed
                FROM tracks 
                WHERE storage_bucket = 'audio'
                AND storage_key IS NOT NULL 
                AND storage_key != ''
            """
            
            result = await conn.fetchrow(query)
            
            status = {
                'total_tracks': result['total_tracks'],
                'analyzed_tracks': result['analyzed_tracks'],
                'camelot_detected': result['camelot_detected'],
                'bpm_detected': result['bpm_detected'],
                'mood_analyzed': result['mood_analyzed'],
                'completion_percentage': (result['analyzed_tracks'] / result['total_tracks'] * 100) if result['total_tracks'] > 0 else 0
            }
            
            return status
            
        finally:
            await conn.close()
    
    async def simulate_analysis_results(self, tracks: List, audio_files_directory: str):
        """
        Simulate analysis results for testing purposes
        Replace this with your actual ComprehensiveAudioAnalyzer integration
        """
        
        results = []
        
        for track in tracks:
            # Construct file path
            audio_file_path = Path(audio_files_directory) / track['storage_key']
            
            if not audio_file_path.exists():
                # File not found
                result = {
                    'track_id': str(track['id']),
                    'analysis_error': f"File not found: {track['storage_key']}",
                    'analysis_timestamp': datetime.now().isoformat()
                }
                print(f"❌ File not found: {track['title']}")
            else:
                # Simulate successful analysis
                # In real implementation, call: self.analyzer.analyze_track(str(audio_file_path), str(track['id']))
                
                # Generate simulated realistic data
                import random
                
                camelot_keys = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B',
                               '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B']
                musical_keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
                scales = ['major', 'minor']
                
                result = {
                    'track_id': str(track['id']),
                    'musical_key': random.choice(musical_keys),
                    'camelot_key': random.choice(camelot_keys),
                    'key_confidence': round(random.uniform(0.6, 0.95), 3),
                    'bpm_multifeature': round(random.uniform(60, 180), 1),
                    'danceability_score': round(random.uniform(0.2, 0.9), 3),
                    'onset_rate_per_second': round(random.uniform(0.5, 3.0), 3),
                    'spectral_centroid_mean': round(random.uniform(1000, 4000), 1),
                    'spectral_rolloff_mean': round(random.uniform(2000, 8000), 1),
                    'spectral_bandwidth_mean': round(random.uniform(1000, 3000), 1),
                    'zero_crossing_rate_mean': round(random.uniform(0.01, 0.3), 4),
                    'loudness_integrated_lufs': round(random.uniform(-30, -10), 1),
                    'dynamic_complexity': round(random.uniform(0.1, 0.8), 3),
                    'roughness': round(random.uniform(0.0, 0.5), 3),
                    'mood_happy': round(random.uniform(0.0, 1.0), 3),
                    'mood_sad': round(random.uniform(0.0, 1.0), 3),
                    'mood_aggressive': round(random.uniform(0.0, 1.0), 3),
                    'mood_relaxed': round(random.uniform(0.0, 1.0), 3),
                    'mood_acoustic': round(random.uniform(0.0, 1.0), 3),
                    'mood_electronic': round(random.uniform(0.0, 1.0), 3),
                    'pitch_mean_hz': round(random.uniform(80, 400), 1),
                    'tuning_frequency_hz': round(random.uniform(435, 445), 1),
                    'inharmonicity': round(random.uniform(0.0, 0.1), 4),
                    'rms_energy_mean': round(random.uniform(0.01, 0.3), 4),
                    'dynamic_range_db': round(random.uniform(10, 40), 1),
                    'crest_factor': round(random.uniform(5, 20), 1),
                    'comprehensive_analysis': {
                        'analysis_method': 'simulated',
                        'file_analyzed': str(audio_file_path),
                        'genre': track.get('genre'),
                        'artist': track.get('artist')
                    },
                    'analysis_timestamp': datetime.now().isoformat(),
                    'analysis_version': '2.0_simulated'
                }
                
                print(f"✅ Simulated analysis: {track['title']} → {result['camelot_key']} @ {result['bpm_multifeature']} BPM")
            
            results.append(result)
        
        return results
    
    async def process_and_upload_batch(self, tracks: List, audio_files_directory: str, batch_size: int = 10):
        """Process tracks and upload results in batches"""
        
        print(f"🎵 Processing {len(tracks)} tracks from {audio_files_directory}")
        
        # Generate analysis results
        # Replace simulate_analysis_results with actual analysis
        analysis_results = await self.simulate_analysis_results(tracks, audio_files_directory)
        
        # Upload results in batches
        async with SupabaseAnalysisClient(self.edge_function_url, self.api_key) as client:
            batch_results = await client.send_analysis_results(analysis_results, batch_size)
        
        return analysis_results, batch_results
    
    async def run_complete_analysis(self, audio_files_directory: str, batch_size: int = 20, upload_batch_size: int = 10):
        """Run complete analysis pipeline for all audio bucket tracks"""
        
        print("🎼 Starting Complete Audio Bucket Analysis Pipeline")
        print("=" * 60)
        
        # Get initial status
        initial_status = await self.get_analysis_status()
        print(f"📊 Initial Status:")
        print(f"   Total tracks: {initial_status['total_tracks']}")
        print(f"   Already analyzed: {initial_status['analyzed_tracks']}")
        print(f"   Completion: {initial_status['completion_percentage']:.1f}%")
        print()
        
        # Get tracks that need analysis
        tracks = await self.get_audio_bucket_tracks()
        
        if not tracks:
            print("🎉 All tracks are already analyzed!")
            return
        
        print(f"🔍 Found {len(tracks)} tracks needing analysis")
        print()
        
        # Process in batches to manage memory and avoid timeouts
        total_processed = 0
        
        for i in range(0, len(tracks), batch_size):
            batch = tracks[i:i+batch_size]
            batch_num = i//batch_size + 1
            total_batches = (len(tracks) + batch_size - 1) // batch_size
            
            print(f"📦 Processing batch {batch_num}/{total_batches} ({len(batch)} tracks)")
            print(f"   Range: {i+1} to {min(i+batch_size, len(tracks))}")
            
            try:
                results, upload_results = await self.process_and_upload_batch(
                    batch, 
                    audio_files_directory,
                    upload_batch_size
                )
                
                successful_uploads = len([r for r in upload_results if r.get('success', False)])
                total_processed += len(results)
                
                print(f"   ✅ Batch {batch_num} completed: {len(results)} analyzed, {successful_uploads} upload batches successful")
                print()
                
            except Exception as e:
                print(f"   ❌ Batch {batch_num} failed: {e}")
                print()
                continue
        
        # Final status
        final_status = await self.get_analysis_status()
        print("🎯 Final Analysis Status:")
        print(f"   Total tracks: {final_status['total_tracks']}")
        print(f"   Analyzed tracks: {final_status['analyzed_tracks']}")
        print(f"   Camelot keys: {final_status['camelot_detected']}")
        print(f"   BPM detected: {final_status['bpm_detected']}")
        print(f"   Mood analysis: {final_status['mood_analyzed']}")
        print(f"   Completion: {final_status['completion_percentage']:.1f}%")
        print()
        print(f"🎉 Analysis pipeline complete! Processed {total_processed} tracks.")

# Usage example
async def main():
    """Run the integrated audio analysis pipeline"""
    
    # Configuration - Update these values for your environment
    DATABASE_URL = "postgresql://postgres:[YOUR-PASSWORD]@db.pbtgvcjniayedqlajjzz.supabase.co:5432/postgres"
    EDGE_FUNCTION_URL = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis"
    API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE"
    AUDIO_FILES_DIR = "/path/to/your/audio/files"  # Update this path
    
    # Initialize processor
    processor = IntegratedAudioBucketProcessor(DATABASE_URL, EDGE_FUNCTION_URL, API_KEY)
    
    # Run complete analysis
    await processor.run_complete_analysis(
        audio_files_directory=AUDIO_FILES_DIR,
        batch_size=25,  # Tracks per processing batch
        upload_batch_size=15  # Tracks per upload batch
    )

if __name__ == "__main__":
    asyncio.run(main())