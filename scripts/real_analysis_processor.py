#!/usr/bin/env python3
"""
Real Audio Analysis Processor
Downloads files from Supabase Storage and performs actual audio analysis
"""

import asyncio
import psycopg2
import logging
import os
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime

from supabase_audio_downloader import SupabaseAudioDownloader
from real_audio_analyzer import RealAudioAnalyzer
from complete_analysis_processor import ComprehensiveAudioProcessor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RealAnalysisProcessor(ComprehensiveAudioProcessor):
    def __init__(self, db_connection_string: str, edge_function_url: str, 
                 supabase_url: str, supabase_key: str, local_audio_dir: str = "./local_audio"):
        super().__init__(db_connection_string, edge_function_url)
        
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.local_audio_dir = Path(local_audio_dir)
        
        # Initialize downloader and analyzer
        self.downloader = SupabaseAudioDownloader(supabase_url, supabase_key, str(local_audio_dir))
        self.analyzer = RealAudioAnalyzer()
        
    async def ensure_audio_files_downloaded(self) -> bool:
        """Ensure all audio files are downloaded locally"""
        logger.info("📥 Checking local audio files...")
        
        # Check if we already have files
        if self.local_audio_dir.exists():
            existing_files = list(self.local_audio_dir.glob("*.mp3")) + list(self.local_audio_dir.glob("*.wav"))
            if len(existing_files) >= 350:  # Most files already downloaded
                logger.info(f"✅ Found {len(existing_files)} audio files locally")
                return True
        
        # Download files if needed
        logger.info("📥 Downloading audio files from Supabase Storage...")
        successful, total = await self.downloader.download_all_files(max_concurrent=3)
        
        if successful < total * 0.9:  # Less than 90% success rate
            logger.error(f"❌ Download failed: {successful}/{total} files downloaded")
            return False
            
        logger.info(f"✅ Downloaded {successful}/{total} audio files")
        return True
    
    def get_local_audio_path(self, storage_key: str) -> str:
        """Get local path for a storage key"""
        return str(self.local_audio_dir / storage_key)
    
    async def real_analysis_results(self, tracks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Perform real audio analysis on tracks (replaces simulation)
        """
        logger.info(f"🔬 Starting real audio analysis for {len(tracks)} tracks")
        
        results = []
        processed = 0
        
        for track in tracks:
            try:
                storage_key = track.get('storage_key')
                if not storage_key:
                    logger.warning(f"⚠️ No storage key for track {track['id']}")
                    continue
                
                # Get local audio file path
                audio_path = self.get_local_audio_path(storage_key)
                
                if not os.path.exists(audio_path):
                    logger.warning(f"⚠️ Audio file not found: {audio_path}")
                    results.append({
                        'track_id': str(track['id']),
                        'error': f'Audio file not found: {storage_key}',
                        'timestamp': datetime.utcnow().isoformat()
                    })
                    continue
                
                # Perform real audio analysis
                logger.info(f"🎵 Analyzing: {track.get('title', storage_key)}")
                analysis_result = await self.analyzer.analyze_track(audio_path, str(track['id']))
                
                # Set timestamp
                analysis_result['analyzed_at'] = datetime.utcnow().isoformat()
                
                results.append(analysis_result)
                processed += 1
                
                if processed % 10 == 0:
                    logger.info(f"📊 Progress: {processed}/{len(tracks)} tracks analyzed")
                    
            except Exception as e:
                logger.error(f"❌ Failed to analyze track {track['id']}: {e}")
                results.append({
                    'track_id': str(track['id']),
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                })
        
        logger.info(f"✅ Real analysis complete: {processed}/{len(tracks)} successful")
        return results
    
    async def run_real_analysis_pipeline(self, batch_size: int = 25, upload_batch_size: int = 10, limit: int = None):
        """Run complete real audio analysis pipeline"""
        
        logger.info("🚀 Starting Real Audio Analysis Pipeline")
        
        # Step 1: Download audio files
        if not await self.ensure_audio_files_downloaded():
            raise Exception("Failed to download audio files")
        
        # Step 2: Get tracks needing analysis
        logger.info("🔍 Fetching tracks needing analysis...")
        tracks = self.get_audio_bucket_tracks(limit=limit)
        
        if not tracks:
            logger.info("✅ All tracks already analyzed!")
            return
            
        logger.info(f"📋 Found {len(tracks)} tracks for real analysis")
        
        # Step 3: Process tracks in batches
        total_batches = (len(tracks) + batch_size - 1) // batch_size
        successful_uploads = 0
        failed_uploads = 0
        
        for i in range(0, len(tracks), batch_size):
            batch = tracks[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            
            logger.info(f"🔬 Processing batch {batch_num}/{total_batches} ({len(batch)} tracks)")
            
            # Perform real analysis on batch
            analysis_results = await self.real_analysis_results(batch)
            
            # Upload results in sub-batches
            for j in range(0, len(analysis_results), upload_batch_size):
                upload_batch = analysis_results[j:j + upload_batch_size]
                upload_batch_id = f"{batch_num}.{j//upload_batch_size + 1}"
                
                logger.info(f"📤 Uploading sub-batch {upload_batch_id} ({len(upload_batch)} results)")
                
                result = await self.send_analysis_batch(upload_batch, upload_batch_id)
                
                if result.get('success', False):
                    successful_uploads += len(upload_batch)
                    logger.info(f"✅ Upload successful: {upload_batch_id}")
                else:
                    failed_uploads += len(upload_batch)
                    logger.error(f"❌ Upload failed: {upload_batch_id}")
                
                # Small delay between uploads
                await asyncio.sleep(1)
        
        # Final summary
        logger.info(f"\n🎉 Real Analysis Pipeline Complete!")
        logger.info(f"   Total tracks processed: {len(tracks)}")
        logger.info(f"   Successful uploads: {successful_uploads}")
        logger.info(f"   Failed uploads: {failed_uploads}")
        
        # Get final status
        final_status = self.get_analysis_status()
        logger.info(f"📊 Final Status: {final_status}")
        
        return {
            'tracks_processed': len(tracks),
            'successful_uploads': successful_uploads,
            'failed_uploads': failed_uploads,
            'final_status': final_status
        }

async def main():
    """Execute real audio analysis"""
    
    # Configuration
    DATABASE_URL = os.getenv('DATABASE_URL', 
        "postgresql://postgres.pbtgvcjniayedqlajjzz:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.co:6543/postgres"
    )
    EDGE_FUNCTION_URL = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis"
    SUPABASE_URL = "https://pbtgvcjniayedqlajjzz.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE"
    
    if "YOUR_PASSWORD" in DATABASE_URL:
        print("❌ Set DATABASE_URL with your actual password")
        return
    
    # Create real analysis processor
    processor = RealAnalysisProcessor(
        db_connection_string=DATABASE_URL,
        edge_function_url=EDGE_FUNCTION_URL,
        supabase_url=SUPABASE_URL,
        supabase_key=SUPABASE_KEY
    )
    
    # Run analysis (limit to 5 for testing, remove limit for full processing)
    result = await processor.run_real_analysis_pipeline(
        batch_size=10,
        upload_batch_size=5,
        limit=None  # Remove limit to process all tracks
    )
    
    print(f"🏁 Analysis complete: {result}")

if __name__ == "__main__":
    asyncio.run(main())