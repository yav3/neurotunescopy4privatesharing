#!/usr/bin/env python3

import asyncio
import sys
import os
import logging

# Add scripts to path
sys.path.append('./scripts')

from complete_analysis_processor import ComprehensiveAudioProcessor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def execute_full_analysis():
    """Execute the complete analysis pipeline"""
    
    # Use environment variable or default (you'll need to update this)
    DATABASE_URL = os.getenv('DATABASE_URL', 
        "postgresql://postgres.pbtgvcjniayedqlajjzz:YOUR_ACTUAL_PASSWORD@aws-0-us-east-1.pooler.supabase.co:6543/postgres"
    )
    
    EDGE_FUNCTION_URL = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis"
    
    # Create processor
    processor = ComprehensiveAudioProcessor(
        db_connection_string=DATABASE_URL,
        edge_function_url=EDGE_FUNCTION_URL
    )
    
    print("🎵 COMPREHENSIVE AUDIO ANALYSIS PIPELINE")
    print("=" * 50)
    
    # Get status
    status = processor.get_analysis_status()
    print(f"📊 Current Status:")
    print(f"   Total tracks: {status.get('total_tracks', 0)}")
    print(f"   Audio bucket tracks: {status.get('audio_bucket_tracks', 0)}")
    print(f"   Tracks with BPM: {status.get('tracks_with_bpm', 0)}")
    print(f"   Tracks with Camelot: {status.get('tracks_with_camelot', 0)}")
    print(f"   Comprehensive analyzed: {status.get('comprehensive_analyzed', 0)}")
    
    # Get tracks needing analysis
    tracks_to_process = processor.get_audio_bucket_tracks()
    
    if not tracks_to_process:
        print("✅ All audio bucket tracks already have comprehensive analysis!")
        return
    
    print(f"\n🔍 Found {len(tracks_to_process)} tracks needing analysis")
    print("📋 Sample tracks to be processed:")
    for i, track in enumerate(tracks_to_process[:5]):
        print(f"   {i+1}. {track.get('title', 'Unknown')} ({track.get('storage_key', 'No key')})")
    
    if len(tracks_to_process) > 5:
        print(f"   ... and {len(tracks_to_process) - 5} more tracks")
    
    # Confirm execution
    print(f"\n⚡ Starting comprehensive analysis of {len(tracks_to_process)} tracks...")
    print("🕒 Estimated time: 2-3 minutes per batch (15 tracks per batch)")
    
    # Execute analysis
    result = await processor.run_complete_analysis(
        batch_size=25,
        upload_batch_size=15,
        limit=None  # Process ALL tracks
    )
    
    print("\n🎉 ANALYSIS COMPLETE!")
    print("=" * 30)
    print(f"✅ Tracks processed: {result.get('tracks_processed', 0)}")
    
    # Final status
    final_status = processor.get_analysis_status()
    print(f"\n📈 Final Analysis Coverage:")
    print(f"   Audio bucket tracks: {final_status.get('audio_bucket_tracks', 0)}")
    print(f"   Tracks with BPM: {final_status.get('tracks_with_bmp', 0)}")
    print(f"   Tracks with Camelot: {final_status.get('tracks_with_camelot', 0)}")
    print(f"   Comprehensive analyzed: {final_status.get('comprehensive_analyzed', 0)}")
    print(f"   Current version: {final_status.get('current_version_analyzed', 0)}")
    
    return result

if __name__ == "__main__":
    print("🚀 Executing comprehensive audio analysis...")
    print("📝 Make sure to set DATABASE_URL environment variable with your password")
    print("   export DATABASE_URL='postgresql://postgres.pbtgvcjniayedqlajjzz:YOUR_PASSWORD@...'")
    print("\nStarting in 3 seconds...")
    
    import time
    time.sleep(3)
    
    try:
        result = asyncio.run(execute_full_analysis())
        print(f"\n🏆 SUCCESS! Analysis pipeline completed: {result}")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("Please check your DATABASE_URL and try again.")
        sys.exit(1)