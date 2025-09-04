#!/usr/bin/env python3
"""
Fixed Audio Analysis Client for Supabase Edge Function
Sends comprehensive audio analysis results with proper field mapping
"""

import asyncio
import aiohttp
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SupabaseAnalysisClient:
    """Client for sending audio analysis results to Supabase Edge Function"""
    
    def __init__(self, edge_function_url: str, api_key: str = None):
        self.edge_function_url = edge_function_url
        self.api_key = api_key
        self.session = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=120),
            connector=aiohttp.TCPConnector(limit=10)
        )
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def fix_field_names(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Fix field names to match Edge Function interface"""
        fixed_result = result.copy()
        
        # Map old field names to new ones if present
        field_mapping = {
            'camelot_key': 'camelot',
            'bmp_multifeature': 'bpm',
            'spectral_centroid_mean': 'spectral_centroid',
            'spectral_rolloff_mean': 'spectral_rolloff', 
            'spectral_bandwidth_mean': 'spectral_bandwidth',
            'zero_crossing_rate_mean': 'zero_crossing_rate',
            'onset_rate_per_second': 'onset_rate',
            'pitch_mean_hz': 'pitch_mean',
            'loudness_integrated_lufs': 'loudness_lufs',
            'rms_energy_mean': 'rms_energy',
            'dynamic_range_db': 'dynamic_range',
            'tuning_frequency_hz': 'tuning_frequency',
            'analysis_error': 'error'  # Consolidate error fields
        }
        
        for old_field, new_field in field_mapping.items():
            if old_field in fixed_result:
                fixed_result[new_field] = fixed_result.pop(old_field)
        
        return fixed_result
    
    async def send_analysis_batch(self, results: List[Dict[str, Any]], batch_id: str = None) -> Dict[str, Any]:
        """Send a batch of analysis results to the Edge Function"""
        
        if not batch_id:
            batch_id = f"batch_{uuid.uuid4().hex[:8]}"
        
        # Fix field names for all results
        fixed_results = [self.fix_field_names(result) for result in results]
        
        headers = {
            'Content-Type': 'application/json',
        }
        
        if self.api_key:
            headers['apikey'] = self.api_key
            headers['Authorization'] = f'Bearer {self.api_key}'
        
        payload = {
            'results': fixed_results,
            'batch_id': batch_id,
            'processing_info': {
                'timestamp': datetime.now().isoformat(),
                'client_version': '2.1',
                'batch_size': len(fixed_results)
            }
        }
        
        logger.info(f"📤 Sending batch {batch_id} with {len(fixed_results)} results")
        
        try:
            async with self.session.post(
                self.edge_function_url,
                headers=headers,
                json=payload
            ) as response:
                
                if response.status == 200:
                    result = await response.json()
                    processed = result.get('processed_count', 0)
                    errors = result.get('error_count', 0)
                    logger.info(f"✅ Batch {batch_id}: {processed} processed, {errors} errors")
                    return result
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Batch {batch_id} failed: HTTP {response.status} - {error_text}")
                    return {
                        'success': False,
                        'error': f"HTTP {response.status}: {error_text}",
                        'batch_id': batch_id
                    }
                    
        except asyncio.TimeoutError:
            logger.error(f"❌ Batch {batch_id} timed out")
            return {
                'success': False,
                'error': "Request timed out",
                'batch_id': batch_id
            }
        except Exception as e:
            logger.error(f"❌ Network error for batch {batch_id}: {e}")
            return {
                'success': False,
                'error': f"Network error: {str(e)}",
                'batch_id': batch_id
            }
    
    async def send_analysis_results(self, results: List[Dict[str, Any]], batch_size: int = 10) -> List[Dict[str, Any]]:
        """Send all analysis results in batches with progress tracking"""
        
        total_batches = (len(results) + batch_size - 1) // batch_size
        batch_results = []
        successful_uploads = 0
        failed_uploads = 0
        
        logger.info(f"📊 Uploading {len(results)} results in {total_batches} batches")
        
        # Process in batches
        for i in range(0, len(results), batch_size):
            batch = results[i:i+batch_size]
            batch_num = i // batch_size + 1
            batch_id = f"batch_{batch_num:03d}_{total_batches:03d}"
            
            logger.info(f"📤 Processing batch {batch_num}/{total_batches}")
            
            result = await self.send_analysis_batch(batch, batch_id)
            batch_results.append(result)
            
            if result.get('success', False):
                successful_uploads += len(batch)
            else:
                failed_uploads += len(batch)
            
            # Small delay between batches to avoid overwhelming the server
            await asyncio.sleep(0.5)
        
        logger.info(f"📊 Upload Summary: {successful_uploads} successful, {failed_uploads} failed")
        return batch_results

# Example usage
async def upload_csv_results(csv_file_path: str, edge_function_url: str, api_key: str):
    """Upload analysis results from a CSV file"""
    
    # Read CSV results
    df = pd.read_csv(csv_file_path)
    print(f"📁 Loaded {len(df)} analysis results from {csv_file_path}")
    
    # Convert to list of dictionaries
    results = df.to_dict('records')
    
    # Upload to Supabase
    async with SupabaseAnalysisClient(edge_function_url, api_key) as client:
        batch_results = await client.send_analysis_results(results, batch_size=15)
    
    return batch_results

if __name__ == "__main__":
    # Configuration - update these values
    EDGE_FUNCTION_URL = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis"
    API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE"
    CSV_FILE = "audio_analysis_results.csv"  # Your analysis results CSV
    
    # Run upload
    asyncio.run(upload_csv_results(CSV_FILE, EDGE_FUNCTION_URL, API_KEY))