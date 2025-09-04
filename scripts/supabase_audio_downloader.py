#!/usr/bin/env python3
"""
Download audio files from Supabase Storage for local analysis
"""

import os
import asyncio
import aiohttp
import aiofiles
from supabase import create_client, Client
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SupabaseAudioDownloader:
    def __init__(self, supabase_url: str, supabase_key: str, local_dir: str = "./local_audio"):
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.local_dir = Path(local_dir)
        self.supabase = create_client(supabase_url, supabase_key)
        
        # Create local directory
        self.local_dir.mkdir(exist_ok=True)
        
    async def list_audio_files(self):
        """List all files in the audio bucket"""
        try:
            files = self.supabase.storage.from_('audio').list()
            logger.info(f"Found {len(files)} files in audio bucket")
            return files
        except Exception as e:
            logger.error(f"Error listing files: {e}")
            return []
    
    async def download_file(self, file_name: str, session: aiohttp.ClientSession):
        """Download a single file from Supabase Storage"""
        local_path = self.local_dir / file_name
        
        # Skip if file already exists
        if local_path.exists():
            logger.info(f"✓ Already exists: {file_name}")
            return True
            
        try:
            # Get signed URL for download
            signed_url = self.supabase.storage.from_('audio').create_signed_url(file_name, 3600)
            
            if not signed_url or 'signedURL' not in signed_url:
                logger.error(f"Failed to get signed URL for {file_name}")
                return False
                
            download_url = signed_url['signedURL']
            
            # Download file
            async with session.get(download_url) as response:
                if response.status == 200:
                    async with aiofiles.open(local_path, 'wb') as f:
                        async for chunk in response.content.iter_chunked(8192):
                            await f.write(chunk)
                    
                    logger.info(f"✓ Downloaded: {file_name}")
                    return True
                else:
                    logger.error(f"Failed to download {file_name}: HTTP {response.status}")
                    return False
                    
        except Exception as e:
            logger.error(f"Error downloading {file_name}: {e}")
            return False
    
    async def download_all_files(self, max_concurrent: int = 5):
        """Download all audio files with concurrency control"""
        files = await self.list_audio_files()
        
        if not files:
            logger.error("No files found to download")
            return
            
        # Filter for audio files
        audio_files = [f['name'] for f in files if f['name'].endswith(('.mp3', '.wav', '.m4a', '.flac', '.ogg'))]
        
        logger.info(f"Downloading {len(audio_files)} audio files to {self.local_dir}")
        
        # Create semaphore for concurrency control
        semaphore = asyncio.Semaphore(max_concurrent)
        
        async def download_with_semaphore(file_name: str, session: aiohttp.ClientSession):
            async with semaphore:
                return await self.download_file(file_name, session)
        
        # Download files concurrently
        async with aiohttp.ClientSession() as session:
            tasks = [download_with_semaphore(file_name, session) for file_name in audio_files]
            results = await asyncio.gather(*tasks)
            
        successful = sum(results)
        logger.info(f"Download complete: {successful}/{len(audio_files)} files downloaded")
        
        return successful, len(audio_files)

async def main():
    """Download all audio files from Supabase"""
    
    # Configuration
    SUPABASE_URL = "https://pbtgvcjniayedqlajjzz.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE"
    LOCAL_DIR = "./local_audio"
    
    print("📥 Supabase Audio File Downloader")
    print("=" * 40)
    print(f"Source: {SUPABASE_URL}")
    print(f"Bucket: audio")
    print(f"Local directory: {LOCAL_DIR}")
    print()
    
    downloader = SupabaseAudioDownloader(SUPABASE_URL, SUPABASE_KEY, LOCAL_DIR)
    
    successful, total = await downloader.download_all_files(max_concurrent=3)
    
    print(f"\n📊 Download Summary:")
    print(f"✓ Downloaded: {successful}/{total} files")
    print(f"📁 Location: {os.path.abspath(LOCAL_DIR)}")
    
    if successful == total:
        print("🎉 All files downloaded successfully!")
        print("Ready for audio analysis processing")
    else:
        print(f"⚠️ {total - successful} files failed to download")

if __name__ == "__main__":
    asyncio.run(main())