#!/usr/bin/env python3
"""
Execute complete analysis for all audio bucket tracks
"""

import asyncio
import sys
import os

# Add the scripts directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'scripts'))

from complete_analysis_processor import ComprehensiveAudioProcessor

async def main():
    # Database configuration - update this with your actual credentials
    DATABASE_URL = "postgresql://postgres.pbtgvcjniayedqlajjzz:YOUR_PASSWORD_HERE@aws-0-us-east-1.pooler.supabase.co:6543/postgres"
    EDGE_FUNCTION_URL = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis"
    
    print("🚀 Starting comprehensive audio analysis for all 367 audio bucket tracks...")
    print("⚠️  Make sure to update DATABASE_URL with your actual password")
    
    # Create processor
    processor = ComprehensiveAudioProcessor(
        db_connection_string=DATABASE_URL,
        edge_function_url=EDGE_FUNCTION_URL
    )
    
    # Check current status
    print("\n📊 Checking current analysis status...")
    status = processor.get_analysis_status()
    print(f"Audio bucket tracks: {status.get('audio_bucket_tracks', 0)}")
    print(f"Tracks with BPM: {status.get('tracks_with_bpm', 0)}")
    print(f"Tracks with Camelot: {status.get('tracks_with_camelot', 0)}")
    print(f"Comprehensive analyzed: {status.get('comprehensive_analyzed', 0)}")
    
    # Get tracks needing analysis
    tracks_needing_analysis = processor.get_audio_bucket_tracks()
    print(f"\n🔍 Found {len(tracks_needing_analysis)} tracks needing analysis")
    
    if len(tracks_needing_analysis) == 0:
        print("✅ All tracks already have complete analysis!")
        return
    
    # Run complete analysis
    print(f"\n🔬 Processing {len(tracks_needing_analysis)} tracks...")
    print("This will take approximately 30-60 minutes for all tracks")
    
    result = await processor.run_complete_analysis(
        batch_size=20,
        upload_batch_size=15,
        limit=None  # Process all tracks
    )
    
    print(f"\n🏁 Analysis completed!")
    print(f"Tracks processed: {result.get('tracks_processed', 0)}")
    print(f"Upload results: {result.get('upload_result', {})}")
    
    # Final status check
    final_status = processor.get_analysis_status()
    print(f"\n📈 Final Status:")
    print(f"Audio bucket tracks: {final_status.get('audio_bucket_tracks', 0)}")
    print(f"Tracks with BPM: {final_status.get('tracks_with_bpm', 0)}")
    print(f"Tracks with Camelot: {final_status.get('tracks_with_camelot', 0)}")
    print(f"Comprehensive analyzed: {final_status.get('comprehensive_analyzed', 0)}")
    print(f"Current version analyzed: {final_status.get('current_version_analyzed', 0)}")

if __name__ == "__main__":
    asyncio.run(main())