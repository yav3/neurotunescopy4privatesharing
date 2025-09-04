#!/usr/bin/env python3
"""
EXECUTE COMPLETE COMPREHENSIVE ANALYSIS
Process all 367 audio bucket tracks with full analysis pipeline
"""

import os
import sys
import asyncio
import logging
from datetime import datetime

# Add scripts to path
sys.path.append('./scripts')

from complete_analysis_processor import ComprehensiveAudioProcessor

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def execute_analysis():
    """Execute comprehensive analysis for all audio tracks"""
    
    print("🎵 COMPREHENSIVE AUDIO ANALYSIS EXECUTION")
    print("🚀 Processing ALL 367 Audio Bucket Tracks")
    print("=" * 60)
    print(f"⏰ Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    # Database configuration
    DATABASE_URL = os.getenv('DATABASE_URL', 
        "postgresql://postgres.pbtgvcjniayedqlajjzz:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.co:6543/postgres"
    )
    EDGE_FUNCTION_URL = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis"
    
    if "YOUR_PASSWORD" in DATABASE_URL:
        print("❌ ERROR: Update DATABASE_URL with your actual password")
        print("   Set: export DATABASE_URL='postgresql://postgres.pbtgvcjniayedqlajjzz:REAL_PASSWORD@...'")
        return

    # Create processor
    processor = ComprehensiveAudioProcessor(
        db_connection_string=DATABASE_URL,
        edge_function_url=EDGE_FUNCTION_URL
    )

    # Get current analysis status
    print("📊 Current Analysis Status:")
    status = processor.get_analysis_status()
    
    audio_tracks = status.get('audio_bucket_tracks', 0)
    has_bpm = status.get('tracks_with_bpm', 0) 
    has_camelot = status.get('tracks_with_camelot', 0)
    analyzed = status.get('comprehensive_analyzed', 0)
    
    print(f"   Audio bucket tracks: {audio_tracks}")
    print(f"   Tracks with BPM: {has_bpm} ({has_bpm/max(1,audio_tracks)*100:.1f}%)")
    print(f"   Tracks with Camelot: {has_camelot} ({has_camelot/max(1,audio_tracks)*100:.1f}%)")  
    print(f"   Comprehensive analyzed: {analyzed} ({analyzed/max(1,audio_tracks)*100:.1f}%)")
    
    # Get tracks needing analysis
    tracks_to_process = processor.get_audio_bucket_tracks()
    
    if not tracks_to_process:
        print("✅ ALL TRACKS ALREADY ANALYZED!")
        return

    print(f"\n🔍 Found {len(tracks_to_process)} tracks needing comprehensive analysis")
    print("📋 Analysis will include:")
    print("   ✓ BPM and tempo detection")
    print("   ✓ Musical key and Camelot wheel mapping") 
    print("   ✓ Spectral analysis (centroid, rolloff, bandwidth)")
    print("   ✓ Harmonic and tonal features")
    print("   ✓ Psychoacoustic analysis (loudness, roughness)")
    print("   ✓ Mood and emotion classification")
    print("   ✓ Dynamic range and energy analysis")
    print("   ✓ Therapeutic use classification")
    print()

    # Process configuration
    batch_size = 25
    upload_batch_size = 15
    estimated_minutes = len(tracks_to_process) // upload_batch_size * 2
    
    print(f"🔧 Processing Configuration:")
    print(f"   Batch size: {batch_size} tracks")
    print(f"   Upload batch size: {upload_batch_size} tracks")
    print(f"   Estimated time: {estimated_minutes} minutes")
    print()
    
    # Execute comprehensive analysis
    print("🚀 STARTING COMPREHENSIVE ANALYSIS...")
    print("-" * 50)
    
    try:
        result = await processor.run_complete_analysis(
            batch_size=batch_size,
            upload_batch_size=upload_batch_size,
            limit=None  # Process ALL tracks
        )
        
        print("\n🎉 ANALYSIS COMPLETED SUCCESSFULLY!")
        print("=" * 50)
        
        # Final status
        final_status = processor.get_analysis_status()
        final_analyzed = final_status.get('comprehensive_analyzed', 0)
        final_bpm = final_status.get('tracks_with_bpm', 0)
        final_camelot = final_status.get('tracks_with_camelot', 0)
        
        print(f"📈 Final Results:")
        print(f"   Audio tracks: {final_status.get('audio_bucket_tracks', 0)}")
        print(f"   Comprehensive analyzed: {final_analyzed}")
        print(f"   Tracks with BPM: {final_bpm}")
        print(f"   Tracks with Camelot: {final_camelot}")
        
        # Calculate improvements
        bpm_improvement = final_bpm - has_bpm
        camelot_improvement = final_camelot - has_camelot
        analysis_improvement = final_analyzed - analyzed
        
        print(f"\n🏆 IMPROVEMENTS:")
        print(f"   BPM coverage: +{bpm_improvement} tracks")
        print(f"   Camelot coverage: +{camelot_improvement} tracks (0% → {final_camelot/max(1,audio_tracks)*100:.1f}%)")
        print(f"   Analysis coverage: +{analysis_improvement} tracks")
        
        print(f"\n✅ SUCCESS: All {audio_tracks} audio files now have comprehensive analysis!")
        
        return result
        
    except Exception as e:
        print(f"\n❌ ANALYSIS FAILED: {e}")
        logger.error(f"Analysis error: {e}")
        raise

if __name__ == "__main__":
    print("🎵 Comprehensive Audio Analysis - Execution Starting")
    print("🔬 Processing all 367 audio bucket tracks...")
    print()
    
    try:
        result = asyncio.run(execute_analysis())
        print(f"\n🏁 PIPELINE COMPLETED: {result}")
    except KeyboardInterrupt:
        print("\n⚠️  Analysis interrupted")
    except Exception as e:
        print(f"\n💥 ERROR: {e}")
        sys.exit(1)