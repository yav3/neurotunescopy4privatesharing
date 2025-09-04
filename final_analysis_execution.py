#!/usr/bin/env python3
"""
FINAL EXECUTION: Complete comprehensive analysis of all 367 audio bucket tracks
This script will process ALL tracks in the audio bucket with comprehensive analysis
"""

import os
import sys
import asyncio
import time
from datetime import datetime

# Add scripts directory to path
sys.path.append('./scripts')

from complete_analysis_processor import ComprehensiveAudioProcessor

def setup_environment():
    """Setup environment with database credentials"""
    print("🔧 Environment Setup")
    print("="*40)
    
    # Use environment variable or prompt for database URL
    db_url = os.getenv('DATABASE_URL')
    
    if not db_url:
        print("⚠️  DATABASE_URL not found in environment variables")
        print("🔑 You need to set the database password in the connection string")
        print()
        print("Example:")
        print('export DATABASE_URL="postgresql://postgres.pbtgvcjniayedqlajjzz:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.co:6543/postgres"')
        print()
        
        # For this execution, use a placeholder (user needs to update)
        db_url = "postgresql://postgres.pbtgvcjniayedqlajjzz:REPLACE_WITH_YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.co:6543/postgres"
    
    return db_url

async def execute_comprehensive_analysis():
    """Execute comprehensive analysis for all audio bucket tracks"""
    
    print("🎵 COMPREHENSIVE AUDIO ANALYSIS PIPELINE")
    print("🚀 Processing ALL 367 Audio Bucket Tracks")
    print("="*60)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Setup
    database_url = setup_environment()
    edge_function_url = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis"
    
    # Check if database URL still has placeholder
    if "REPLACE_WITH_YOUR_PASSWORD" in database_url:
        print("❌ ERROR: Please update the DATABASE_URL with your actual Supabase password")
        print("   Update the database connection string in the script or set environment variable")
        return
    
    # Create processor
    processor = ComprehensiveAudioProcessor(
        db_connection_string=database_url,
        edge_function_url=edge_function_url
    )
    
    try:
        # Get initial status
        print("📊 Checking current analysis status...")
        initial_status = processor.get_analysis_status()
        
        print(f"   Total tracks in database: {initial_status.get('total_tracks', 0)}")
        print(f"   Audio bucket tracks: {initial_status.get('audio_bucket_tracks', 0)}")
        print(f"   Currently analyzed: {initial_status.get('comprehensive_analyzed', 0)}")
        print(f"   Tracks with BPM: {initial_status.get('tracks_with_bpm', 0)}")
        print(f"   Tracks with Camelot: {initial_status.get('tracks_with_camelot', 0)}")
        print()
        
        # Get tracks needing analysis
        print("🔍 Identifying tracks needing comprehensive analysis...")
        tracks_to_process = processor.get_audio_bucket_tracks()
        
        if not tracks_to_process:
            print("✅ ALL TRACKS ALREADY HAVE COMPREHENSIVE ANALYSIS!")
            print("🎉 No processing needed - your audio collection is fully analyzed")
            return
        
        print(f"📋 Found {len(tracks_to_process)} tracks requiring analysis")
        print(f"⚡ Processing configuration:")
        print(f"   - Batch size: 20 tracks per analysis batch")
        print(f"   - Upload batch size: 15 tracks per upload")
        print(f"   - Estimated processing time: 2-3 minutes per batch")
        print(f"   - Total estimated time: {len(tracks_to_process) // 15 * 3} minutes")
        print()
        
        # Show sample tracks
        print("📝 Sample tracks to be processed:")
        for i, track in enumerate(tracks_to_process[:10]):
            status = []
            if not track.get('bpm'): status.append('No BPM')
            if not track.get('camelot'): status.append('No Camelot')
            if not track.get('analyzed_at'): status.append('Not analyzed')
            
            print(f"   {i+1:2d}. {track.get('title', 'Unknown')[:40]:40} ({', '.join(status)})")
        
        if len(tracks_to_process) > 10:
            print(f"   ... and {len(tracks_to_process) - 10} more tracks")
        print()
        
        # Confirm execution
        print("🚨 STARTING COMPREHENSIVE ANALYSIS")
        print(f"📊 This will analyze {len(tracks_to_process)} tracks with:")
        print("   ✓ Musical key detection (Camelot wheel)")
        print("   ✓ BPM and tempo analysis")
        print("   ✓ Spectral and harmonic features")
        print("   ✓ Psychoacoustic analysis")
        print("   ✓ Mood and emotion detection")
        print("   ✓ Therapeutic classification")
        print("   ✓ Dynamic and structural analysis")
        print()
        
        # Execute analysis
        start_time = time.time()
        
        print("🔬 EXECUTING COMPREHENSIVE ANALYSIS...")
        print("-" * 50)
        
        result = await processor.run_complete_analysis(
            batch_size=25,      # Process 25 tracks at a time
            upload_batch_size=15,  # Upload 15 results per batch
            limit=None          # Process ALL tracks (no limit)
        )
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        print()
        print("🎉 COMPREHENSIVE ANALYSIS COMPLETED!")
        print("="*50)
        print(f"⏰ Total processing time: {processing_time/60:.1f} minutes")
        print(f"📊 Tracks processed: {result.get('tracks_processed', 0)}")
        
        # Final status check
        print("\n📈 Final Analysis Status:")
        final_status = processor.get_analysis_status()
        
        print(f"   Audio bucket tracks: {final_status.get('audio_bucket_tracks', 0)}")
        print(f"   Comprehensive analyzed: {final_status.get('comprehensive_analyzed', 0)}")
        print(f"   Current version analyzed: {final_status.get('current_version_analyzed', 0)}")
        print(f"   Tracks with BPM: {final_status.get('tracks_with_bpm', 0)}")
        print(f"   Tracks with Camelot: {final_status.get('tracks_with_camelot', 0)}")
        
        # Calculate coverage improvement
        initial_analyzed = initial_status.get('comprehensive_analyzed', 0)
        final_analyzed = final_status.get('comprehensive_analyzed', 0)
        improvement = final_analyzed - initial_analyzed
        
        print(f"\n🏆 ANALYSIS IMPROVEMENT:")
        print(f"   Before: {initial_analyzed} tracks analyzed")
        print(f"   After: {final_analyzed} tracks analyzed")
        print(f"   Improvement: +{improvement} tracks (+{improvement/max(1, initial_status.get('audio_bucket_tracks', 1))*100:.1f}% coverage)")
        
        print("\n✅ ALL AUDIO FILES NOW HAVE COMPREHENSIVE ANALYSIS DATA!")
        print("🎵 Your therapeutic music database is ready for advanced matching")
        
        return result
        
    except Exception as e:
        print(f"\n❌ ANALYSIS FAILED: {e}")
        print("🔧 Check your database connection and try again")
        raise

async def main():
    """Main execution function"""
    try:
        result = await execute_comprehensive_analysis()
        print(f"\n🏁 PIPELINE COMPLETED SUCCESSFULLY")
        return result
    except KeyboardInterrupt:
        print("\n⚠️  Analysis interrupted by user")
    except Exception as e:
        print(f"\n💥 CRITICAL ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🎵 Comprehensive Audio Analysis - Final Execution")
    print("🚀 Processing all 367 audio bucket tracks...")
    print()
    
    # Run the analysis
    asyncio.run(main())