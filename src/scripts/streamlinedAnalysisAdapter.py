#!/usr/bin/env python3
"""
Streamlined Analysis Supabase Adapter
Sends streamlined key detection results to Supabase Edge Function.
Optimized for the fast key-only analysis pipeline.
"""

import requests
import pandas as pd
import json
import time
import argparse
from pathlib import Path
from typing import Dict, List, Optional

class StreamlinedSupabaseUpdater:
    def __init__(self, supabase_url: str, batch_size: int = 50):
        """
        Initialize the streamlined analysis updater
        
        Args:
            supabase_url: Supabase Edge Function URL for audio analysis
            batch_size: Number of tracks to send per batch (smaller for faster processing)
        """
        self.supabase_url = supabase_url
        self.batch_size = batch_size
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    
    def process_streamlined_csv(self, csv_file: str) -> Dict:
        """
        Process streamlined analysis CSV and update Supabase database
        
        Args:
            csv_file: Path to the streamlined analysis CSV file
            
        Returns:
            Dict with processing results and statistics
        """
        print(f"🚀 Processing streamlined analysis results from: {csv_file}")
        
        # Load the CSV
        try:
            df = pd.read_csv(csv_file)
            print(f"📊 Loaded {len(df)} track analyses")
        except Exception as e:
            return {"error": f"Failed to load CSV: {e}"}
        
        # Validate required columns
        required_columns = ['file_path', 'file_name', 'musical_key', 'camelot', 'tempo_bpm']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            return {"error": f"Missing required columns: {missing_columns}"}
        
        # Filter out failed analyses
        successful_df = df[df['musical_key'] != 'Unknown'].copy()
        failed_count = len(df) - len(successful_df)
        
        print(f"✅ {len(successful_df)} successful analyses, ❌ {failed_count} failed")
        
        if len(successful_df) == 0:
            return {"error": "No successful analyses to process"}
        
        # Process in batches
        total_batches = len(successful_df) // self.batch_size + (1 if len(successful_df) % self.batch_size > 0 else 0)
        results = {
            'total_tracks': len(successful_df),
            'total_batches': total_batches,
            'updated_tracks': 0,
            'errors': [],
            'processing_time': 0,
            'batch_results': []
        }
        
        start_time = time.time()
        
        for batch_num in range(total_batches):
            start_idx = batch_num * self.batch_size
            end_idx = min(start_idx + self.batch_size, len(successful_df))
            batch_df = successful_df.iloc[start_idx:end_idx]
            
            print(f"\n📦 Processing batch {batch_num + 1}/{total_batches} ({len(batch_df)} tracks)")
            
            batch_result = self._process_streamlined_batch(batch_df)
            results['batch_results'].append(batch_result)
            
            if batch_result.get('success'):
                results['updated_tracks'] += batch_result.get('updated_count', 0)
                print(f"   ✅ Updated {batch_result.get('updated_count', 0)} tracks")
            else:
                error_msg = f"Batch {batch_num + 1} failed: {batch_result.get('error', 'Unknown error')}"
                results['errors'].append(error_msg)
                print(f"   ❌ {error_msg}")
            
            # Brief pause between batches to avoid overwhelming the server
            time.sleep(0.5)
        
        results['processing_time'] = time.time() - start_time
        
        # Summary
        print(f"\n{'='*60}")
        print(f"🎯 STREAMLINED ANALYSIS UPDATE COMPLETE")
        print(f"{'='*60}")
        print(f"📊 Total tracks processed: {results['updated_tracks']}/{results['total_tracks']}")
        print(f"⏱️  Total time: {results['processing_time']:.1f} seconds")
        print(f"🚀 Rate: {results['total_tracks']/results['processing_time']:.1f} tracks/second")
        
        if results['errors']:
            print(f"❌ Errors encountered: {len(results['errors'])}")
            for error in results['errors'][:5]:  # Show first 5 errors
                print(f"   - {error}")
        
        return results
    
    def _process_streamlined_batch(self, batch_df: pd.DataFrame) -> Dict:
        """
        Process a single batch of streamlined analysis data
        
        Args:
            batch_df: DataFrame containing batch of tracks to process
            
        Returns:
            Dict with batch processing results
        """
        try:
            # Convert DataFrame to the format expected by the edge function
            tracks_data = []
            
            for _, row in batch_df.iterrows():
                track_data = {
                    'file_path': row['file_path'],
                    'file_name': row['file_name'],
                    'musical_key': row.get('musical_key'),
                    'musical_scale': row.get('musical_scale'),
                    'key_strength': float(row.get('key_strength', 0)),
                    'camelot': row.get('camelot'),
                    'tempo_bpm': float(row.get('tempo_bpm', 0)),
                    'beat_confidence': float(row.get('beat_confidence', 0)),
                    'beats_detected': int(row.get('beats_detected', 0)),
                    'energy_level': float(row.get('energy_level', 0)),
                    'brightness': float(row.get('brightness', 0)),
                    'texture': float(row.get('texture', 0)),
                    'dynamic_range': float(row.get('dynamic_range', 0)),
                    'processing_time': float(row.get('processing_time', 0)),
                    'analysis_method': 'streamlined_key_detection'
                }
                
                # Only include non-null/non-zero values
                filtered_data = {k: v for k, v in track_data.items() 
                               if v is not None and v != '' and (not isinstance(v, (int, float)) or v != 0)}
                
                tracks_data.append(filtered_data)
            
            # Prepare the payload
            payload = {
                'tracks': tracks_data,
                'analysis_type': 'streamlined_batch',
                'batch_size': len(tracks_data),
                'timestamp': time.time()
            }
            
            # Send to Supabase Edge Function
            response = self.session.post(
                self.supabase_url,
                json=payload,
                timeout=60  # Shorter timeout for streamlined processing
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'success': True,
                    'updated_count': result.get('updatedTracks', len(tracks_data)),
                    'response': result
                }
            else:
                return {
                    'success': False,
                    'error': f"HTTP {response.status_code}: {response.text}",
                    'status_code': response.status_code
                }
                
        except requests.exceptions.Timeout:
            return {'success': False, 'error': 'Request timeout'}
        except requests.exceptions.RequestException as e:
            return {'success': False, 'error': f'Request failed: {e}'}
        except Exception as e:
            return {'success': False, 'error': f'Batch processing error: {e}'}
    
    def get_analysis_status(self) -> Dict:
        """
        Get current analysis status from Supabase
        
        Returns:
            Dict with analysis status information
        """
        try:
            response = self.session.get(f"{self.supabase_url}?action=status", timeout=30)
            
            if response.status_code == 200:
                return response.json()
            else:
                return {
                    'error': f'Status check failed: HTTP {response.status_code}',
                    'details': response.text
                }
                
        except Exception as e:
            return {'error': f'Failed to get status: {e}'}


def main():
    parser = argparse.ArgumentParser(description='Upload streamlined audio analysis to Supabase')
    parser.add_argument('csv_file', help='CSV file with streamlined analysis results')
    parser.add_argument('--supabase-url', required=True, 
                       help='Supabase Edge Function URL (e.g., https://xxx.supabase.co/functions/v1/audio-analysis)')
    parser.add_argument('--batch-size', type=int, default=50,
                       help='Batch size for processing (default: 50)')
    parser.add_argument('--status-only', action='store_true',
                       help='Only check analysis status, do not process CSV')
    
    args = parser.parse_args()
    
    # Initialize updater
    updater = StreamlinedSupabaseUpdater(
        supabase_url=args.supabase_url,
        batch_size=args.batch_size
    )
    
    if args.status_only:
        print("📊 Checking analysis status...")
        status = updater.get_analysis_status()
        print(json.dumps(status, indent=2))
        return
    
    # Validate CSV file
    csv_path = Path(args.csv_file)
    if not csv_path.exists():
        print(f"❌ Error: CSV file not found: {csv_path}")
        return
    
    # Process the streamlined analysis results
    print(f"🎵 Starting streamlined analysis upload...")
    print(f"📁 CSV file: {csv_path}")
    print(f"🌐 Supabase URL: {args.supabase_url}")
    print(f"📦 Batch size: {args.batch_size}")
    print("-" * 60)
    
    results = updater.process_streamlined_csv(args.csv_file)
    
    if results.get('error'):
        print(f"❌ Processing failed: {results['error']}")
        return
    
    # Final status check
    print(f"\n📊 Checking final analysis status...")
    final_status = updater.get_analysis_status()
    if not final_status.get('error'):
        print(json.dumps(final_status, indent=2))


if __name__ == "__main__":
    main()