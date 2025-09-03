#!/usr/bin/env python3
"""
Adapter script to process the comprehensive audio analysis output
and update the Supabase database via Edge Function
"""

import requests
import json
import pandas as pd
import os
from pathlib import Path
import argparse
from typing import Dict, List, Any

class SupabaseAudioUpdater:
    def __init__(self, supabase_function_url: str, batch_size: int = 50):
        """
        Initialize the updater with Supabase Edge Function URL
        
        Args:
            supabase_function_url: Full URL to your audio-analysis edge function
            batch_size: Number of tracks to process in each batch
        """
        self.function_url = supabase_function_url
        self.batch_size = batch_size
        
    def process_csv(self, csv_file: str) -> Dict[str, Any]:
        """
        Process the CSV output from comprehensive audio analysis
        
        Args:
            csv_file: Path to the CSV file with audio features
            
        Returns:
            Dictionary with processing results
        """
        print(f"Loading audio features from {csv_file}...")
        
        df = pd.read_csv(csv_file)
        total_tracks = len(df)
        
        print(f"Found {total_tracks} tracks to process")
        
        results = {
            'total_tracks': total_tracks,
            'processed_batches': 0,
            'successful_updates': 0,
            'failed_updates': 0,
            'errors': []
        }
        
        # Process in batches
        for i in range(0, total_tracks, self.batch_size):
            batch_df = df.iloc[i:i + self.batch_size]
            batch_num = (i // self.batch_size) + 1
            total_batches = (total_tracks + self.batch_size - 1) // self.batch_size
            
            print(f"Processing batch {batch_num}/{total_batches} ({len(batch_df)} tracks)...")
            
            batch_result = self._process_batch(batch_df)
            
            results['processed_batches'] += 1
            results['successful_updates'] += batch_result.get('success_count', 0)
            results['failed_updates'] += batch_result.get('error_count', 0)
            
            if batch_result.get('errors'):
                results['errors'].extend(batch_result['errors'])
                
        return results
    
    def _process_batch(self, batch_df: pd.DataFrame) -> Dict[str, Any]:
        """Process a single batch of tracks"""
        
        tracks = []
        
        for _, row in batch_df.iterrows():
            # Convert pandas row to dictionary and clean NaN values
            features = row.to_dict()
            
            # Remove NaN values and convert to JSON-serializable types
            clean_features = {}
            for key, value in features.items():
                if pd.notna(value) and key not in ['file_path', 'file_name']:
                    if isinstance(value, (int, float, str, bool)):
                        clean_features[key] = value
                    elif hasattr(value, 'item'):  # numpy types
                        clean_features[key] = value.item()
            
            track_data = {
                'file_path': features.get('file_path', ''),
                'file_name': features.get('file_name', ''),
                'features': clean_features
            }
            
            tracks.append(track_data)
        
        # Send to Supabase Edge Function
        try:
            response = requests.post(
                self.function_url,
                json={'tracks': tracks},
                headers={'Content-Type': 'application/json'},
                timeout=300  # 5 minute timeout for large batches
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Batch processed: {result.get('success_count', 0)} success, {result.get('error_count', 0)} errors")
                return result
            else:
                error_msg = f"HTTP {response.status_code}: {response.text}"
                print(f"❌ Batch failed: {error_msg}")
                return {
                    'success_count': 0,
                    'error_count': len(tracks),
                    'errors': [error_msg]
                }
                
        except Exception as e:
            error_msg = f"Request failed: {str(e)}"
            print(f"❌ Batch failed: {error_msg}")
            return {
                'success_count': 0,
                'error_count': len(tracks),
                'errors': [error_msg]
            }
    
    def get_analysis_status(self) -> Dict[str, Any]:
        """Get current analysis status from Supabase"""
        try:
            response = requests.get(self.function_url)
            if response.status_code == 200:
                return response.json()
            else:
                return {'error': f"HTTP {response.status_code}: {response.text}"}
        except Exception as e:
            return {'error': str(e)}


def main():
    parser = argparse.ArgumentParser(description='Update Supabase with comprehensive audio analysis')
    parser.add_argument('csv_file', help='Path to the CSV file with audio features')
    parser.add_argument('--url', required=True, help='Supabase Edge Function URL')
    parser.add_argument('--batch-size', type=int, default=50, help='Batch size for processing')
    parser.add_argument('--status-only', action='store_true', help='Only check analysis status')
    
    args = parser.parse_args()
    
    updater = SupabaseAudioUpdater(args.url, args.batch_size)
    
    if args.status_only:
        print("Checking current analysis status...")
        status = updater.get_analysis_status()
        print(json.dumps(status, indent=2))
        return
    
    if not os.path.exists(args.csv_file):
        print(f"Error: CSV file {args.csv_file} not found")
        return
    
    print(f"🎵 Starting audio analysis upload to Supabase")
    print(f"📁 CSV file: {args.csv_file}")
    print(f"🔗 Edge Function: {args.url}")
    print(f"📦 Batch size: {args.batch_size}")
    print("-" * 50)
    
    results = updater.process_csv(args.csv_file)
    
    print("\n" + "=" * 50)
    print("📊 PROCESSING COMPLETE")
    print("=" * 50)
    print(f"Total tracks: {results['total_tracks']}")
    print(f"Batches processed: {results['processed_batches']}")
    print(f"✅ Successful updates: {results['successful_updates']}")
    print(f"❌ Failed updates: {results['failed_updates']}")
    
    if results['errors']:
        print(f"\n⚠️  Errors encountered:")
        for error in results['errors'][:10]:  # Show first 10 errors
            print(f"   • {error}")
        if len(results['errors']) > 10:
            print(f"   ... and {len(results['errors']) - 10} more errors")
    
    # Check final status
    print("\n📈 Current database status:")
    status = updater.get_analysis_status()
    if 'statistics' in status:
        stats = status['statistics']
        print(f"   • Total tracks in DB: {stats.get('total_tracks', 'N/A')}")
        print(f"   • Analyzed tracks: {stats.get('analyzed_tracks', 'N/A')}")
        print(f"   • Tracks with keys: {stats.get('tracks_with_keys', 'N/A')}")
        print(f"   • Analysis coverage: {stats.get('analysis_coverage', 'N/A')}")


if __name__ == "__main__":
    main()