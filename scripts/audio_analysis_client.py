#!/usr/bin/env python3
"""
Python client for sending audio analysis results to Supabase Edge Function
Integrates with your comprehensive audio analysis pipeline
"""

import asyncio
import httpx
import json
import pandas as pd
from datetime import datetime
from typing import List, Dict, Any
import uuid

class SupabaseAnalysisClient:
    """Client for sending audio analysis results to Supabase Edge Function"""
    
    def __init__(self, edge_function_url: str, api_key: str = None):
        self.edge_function_url = edge_function_url
        self.api_key = api_key
        self.session = None
        
    async def __aenter__(self):
        self.session = httpx.AsyncClient(timeout=30.0)
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.aclose()
    
    async def send_analysis_batch(self, results: List[Dict[str, Any]], batch_id: str = None) -> Dict[str, Any]:
        """Send a batch of analysis results to the Edge Function"""
        
        if not batch_id:
            batch_id = str(uuid.uuid4())[:8]
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        if self.api_key:
            headers['apikey'] = self.api_key
            headers['Authorization'] = f'Bearer {self.api_key}'
        
        payload = {
            'results': results,
            'batch_id': batch_id,
            'processing_info': {
                'timestamp': datetime.now().isoformat(),
                'client_version': '2.0',
                'batch_size': len(results)
            }
        }
        
        print(f"🚀 Sending batch {batch_id} with {len(results)} results to Supabase")
        
        try:
            response = await self.session.post(
                self.edge_function_url,
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Batch {batch_id}: {result.get('processed_count', 0)} tracks processed successfully")
                
                # Log any errors
                if result.get('error_count', 0) > 0:
                    print(f"⚠️  {result.get('error_count')} tracks had errors:")
                    for error in result.get('errors', []):
                        print(f"   - {error.get('track_id')}: {error.get('error')}")
                
                return result
            else:
                error_text = response.text
                print(f"❌ Batch {batch_id} failed: {response.status_code} - {error_text}")
                return {
                    'success': False,
                    'error': f"HTTP {response.status_code}: {error_text}",
                    'batch_id': batch_id
                }
                
        except Exception as e:
            print(f"❌ Network error for batch {batch_id}: {e}")
            return {
                'success': False,
                'error': f"Network error: {str(e)}",
                'batch_id': batch_id
            }
    
    async def send_analysis_results(self, results: List[Dict[str, Any]], batch_size: int = 10) -> List[Dict[str, Any]]:
        """Send all analysis results in batches"""
        
        print(f"📊 Uploading {len(results)} analysis results in batches of {batch_size}")
        batch_results = []
        
        # Process in batches
        for i in range(0, len(results), batch_size):
            batch = results[i:i+batch_size]
            batch_id = f"batch_{i//batch_size + 1:03d}"
            
            result = await self.send_analysis_batch(batch, batch_id)
            batch_results.append(result)
            
            # Small delay between batches to avoid overwhelming the server
            await asyncio.sleep(0.5)
        
        # Summary
        successful_batches = len([r for r in batch_results if r.get('success', False)])
        total_processed = sum(r.get('processed_count', 0) for r in batch_results)
        total_errors = sum(r.get('error_count', 0) for r in batch_results)
        
        print(f"\n📈 Upload Summary:")
        print(f"   Batches: {successful_batches}/{len(batch_results)} successful")
        print(f"   Tracks: {total_processed} processed, {total_errors} errors")
        
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