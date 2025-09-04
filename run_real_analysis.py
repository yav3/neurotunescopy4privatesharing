#!/usr/bin/env python3
"""
REAL AUDIO ANALYSIS EXECUTION
Downloads files from Supabase Storage and performs actual audio analysis
"""

import os
import sys
import asyncio

# Add scripts to path
sys.path.append('./scripts')

from real_analysis_processor import RealAnalysisProcessor

async def main():
    print("🎵 REAL AUDIO ANALYSIS PIPELINE")
    print("📥 Downloads files from Supabase Storage")
    print("🔬 Uses librosa for actual audio analysis")
    print("=" * 50)
    
    # Check requirements
    try:
        import librosa
        import numpy
        import psycopg2
        print("✅ Required packages available")
    except ImportError as e:
        print(f"❌ Missing package: {e}")
        print("Install with: pip install -r requirements.txt")
        return
    
    # Configuration
    DATABASE_URL = os.getenv('DATABASE_URL')
    if not DATABASE_URL or "YOUR_PASSWORD" in DATABASE_URL:
        print("❌ Set DATABASE_URL environment variable:")
        print('export DATABASE_URL="postgresql://postgres.pbtgvcjniayedqlajjzz:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.co:6543/postgres"')
        return
    
    EDGE_FUNCTION_URL = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis"
    SUPABASE_URL = "https://pbtgvcjniayedqlajjzz.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE"
    
    # Create processor
    processor = RealAnalysisProcessor(
        db_connection_string=DATABASE_URL,
        edge_function_url=EDGE_FUNCTION_URL,
        supabase_url=SUPABASE_URL,
        supabase_key=SUPABASE_KEY
    )
    
    print("\n📊 Checking current status...")
    status = processor.get_analysis_status()
    print(f"Audio tracks: {status.get('audio_bucket_tracks', 0)}")
    print(f"Need analysis: {len(processor.get_audio_bucket_tracks())}")
    
    print(f"\n🚀 Starting real analysis pipeline...")
    print("This will:")
    print("1. Download audio files from Supabase Storage")
    print("2. Analyze each file with librosa")
    print("3. Extract BPM, key, Camelot, mood, spectral features")
    print("4. Upload comprehensive results to database")
    
    try:
        # Run with small batch for testing (increase for production)
        result = await processor.run_real_analysis_pipeline(
            batch_size=5,      # Analyze 5 tracks at a time
            upload_batch_size=3,  # Upload 3 results at a time
            limit=10          # Test with 10 tracks first (remove for all)
        )
        
        print(f"\n🎉 Analysis completed: {result}")
        
    except Exception as e:
        print(f"\n❌ Analysis failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🔬 Real Audio Analysis - Starting...")
    print("Make sure you have: pip install librosa psycopg2-binary aiohttp supabase")
    
    asyncio.run(main())