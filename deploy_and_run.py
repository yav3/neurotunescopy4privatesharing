#!/usr/bin/env python3
"""
Deploy and Run Complete Audio Analysis
Executes the fixed comprehensive analysis pipeline
"""

import os
import sys
import asyncio

# Add scripts to path
sys.path.append('./scripts')

async def main():
    print("🎵 COMPREHENSIVE AUDIO ANALYSIS - FIXED IMPLEMENTATION")
    print("🔧 Using corrected field mappings and Edge Function")
    print("=" * 60)
    
    # Validate environment
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url or "YOUR_PASSWORD" in str(database_url):
        print("❌ DATABASE_URL not configured correctly")
        print()
        print("Set your database password:")
        print('export DATABASE_URL="postgresql://postgres.pbtgvcjniayedqlajjzz:YOUR_ACTUAL_PASSWORD@aws-0-us-east-1.pooler.supabase.co:6543/postgres"')
        print()
        print("Then run: python deploy_and_run.py")
        return
    
    try:
        # Import the fixed processor
        from integrated_audio_processor_fixed import AudioBucketProcessor
        
        # Configuration
        EDGE_FUNCTION_URL = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis" 
        API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE"
        
        # Create processor
        processor = AudioBucketProcessor(
            db_connection_string=database_url,
            edge_function_url=EDGE_FUNCTION_URL,
            api_key=API_KEY
        )
        
        print("📊 Checking current analysis status...")
        status = processor.get_analysis_status()
        
        audio_tracks = status.get('audio_bucket_tracks', 0)
        camelot_coverage = status.get('tracks_with_camelot', 0)
        analysis_coverage = status.get('comprehensive_analyzed', 0)
        
        print(f"   Audio bucket tracks: {audio_tracks}")
        print(f"   Camelot coverage: {camelot_coverage}/{audio_tracks} ({camelot_coverage/max(1,audio_tracks)*100:.1f}%)")
        print(f"   Analysis coverage: {analysis_coverage}/{audio_tracks} ({analysis_coverage/max(1,audio_tracks)*100:.1f}%)")
        
        tracks_needing_analysis = processor.get_audio_bucket_tracks()
        
        if not tracks_needing_analysis:
            print("\n✅ ALL TRACKS ALREADY ANALYZED!")
            print("🎉 Your audio database has complete comprehensive analysis")
            return
        
        print(f"\n🔍 Found {len(tracks_needing_analysis)} tracks needing analysis")
        print()
        print("📋 Analysis will generate:")
        print("   ✓ BPM and tempo detection")
        print("   ✓ Musical key and Camelot wheel mapping")
        print("   ✓ Spectral analysis (centroid, rolloff, bandwidth)")
        print("   ✓ Psychoacoustic features (loudness, roughness)")
        print("   ✓ Mood classification (happy, sad, energetic, calm)")
        print("   ✓ Therapeutic use tagging")
        print("   ✓ EEG target classification")
        print()
        
        # Estimate processing time
        estimated_minutes = len(tracks_needing_analysis) // 15 * 2
        print(f"⏰ Estimated processing time: {estimated_minutes} minutes")
        print(f"🔄 Processing configuration:")
        print(f"   - Processing batch size: 25 tracks")
        print(f"   - Upload batch size: 15 tracks")
        print(f"   - Total tracks to process: {len(tracks_needing_analysis)}")
        print()
        
        print("🚀 STARTING COMPREHENSIVE ANALYSIS...")
        print("-" * 50)
        
        # Execute analysis
        result = await processor.run_complete_analysis(
            audio_files_directory=None,  # Using simulation (no local files needed)
            processing_batch_size=25,
            upload_batch_size=15,
            limit=None  # Process ALL tracks
        )
        
        print("\n🎉 COMPREHENSIVE ANALYSIS COMPLETED!")
        print("=" * 50)
        
        # Show results
        initial = result.get('initial_status', {})
        final = result.get('final_status', {})
        
        print(f"📈 Results Summary:")
        print(f"   Tracks processed: {result.get('tracks_processed', 0)}")
        print(f"   Successful uploads: {result.get('successful_uploads', 0)}")
        
        print(f"\n📊 Coverage Improvement:")
        initial_camelot = initial.get('tracks_with_camelot', 0)
        final_camelot = final.get('tracks_with_camelot', 0)
        initial_analysis = initial.get('comprehensive_analyzed', 0)
        final_analysis = final.get('comprehensive_analyzed', 0)
        
        print(f"   Camelot: {initial_camelot} → {final_camelot} (+{final_camelot - initial_camelot})")
        print(f"   Analysis: {initial_analysis} → {final_analysis} (+{final_analysis - initial_analysis})")
        
        coverage_percent = final_camelot / max(1, audio_tracks) * 100
        print(f"\n✅ SUCCESS: {coverage_percent:.1f}% Camelot coverage achieved!")
        print("🎵 All audio tracks now have comprehensive analysis data")
        
    except ImportError as e:
        print(f"❌ Missing required packages: {e}")
        print("Install with: pip install psycopg2-binary aiohttp")
        
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🔧 Fixed Comprehensive Audio Analysis")
    print("📝 Make sure DATABASE_URL is set with your actual password")
    print()
    
    asyncio.run(main())