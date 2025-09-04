#!/usr/bin/env python3
"""
Comprehensive Data Integrity Validator
Validates all track data before running analysis pipeline
"""

import asyncio
import psycopg2
import logging
from typing import Dict, List, Any, Set, Optional, Tuple
from supabase import create_client, Client
import os
import json
from datetime import datetime
from pathlib import Path
import re

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DataIntegrityValidator:
    def __init__(self, db_connection_string: str, supabase_url: str, supabase_key: str):
        self.db_connection_string = db_connection_string
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.supabase: Client = create_client(supabase_url, supabase_key)
        
    def get_db_connection(self):
        """Get database connection"""
        return psycopg2.connect(self.db_connection_string)
    
    async def validate_track_records(self) -> Dict[str, Any]:
        """Validate all track records in database"""
        logger.info("Validating track records...")
        
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        # Get all tracks
        cursor.execute("""
            SELECT id, title, artist, storage_key, storage_bucket, file_format, 
                   duration_seconds, file_size_bytes, bpm, camelot, audio_status,
                   created_date, updated_at, last_verified_at
            FROM tracks 
            ORDER BY created_date ASC
        """)
        
        columns = [desc[0] for desc in cursor.description]
        tracks = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        validation_results = {
            'total_tracks': len(tracks),
            'data_quality_issues': [],
            'storage_analysis': {},
            'metadata_coverage': {},
            'file_path_issues': {},
            'recommendations': []
        }
        
        # Analyze data quality
        missing_title = [t for t in tracks if not t.get('title') or t['title'].strip() == '']
        missing_storage_key = [t for t in tracks if not t.get('storage_key')]
        missing_bucket = [t for t in tracks if not t.get('storage_bucket')]
        invalid_storage_keys = []
        
        # Check for problematic characters in storage keys
        for track in tracks:
            storage_key = track.get('storage_key', '')
            if storage_key and re.search(r'[<>:"/\\|?*\s]', storage_key):
                invalid_storage_keys.append(track)
        
        validation_results['data_quality_issues'] = {
            'missing_title_count': len(missing_title),
            'missing_storage_key_count': len(missing_storage_key),
            'missing_bucket_count': len(missing_bucket),
            'invalid_storage_keys_count': len(invalid_storage_keys),
            'tracks_with_issues': missing_title + missing_storage_key + missing_bucket
        }
        
        # Storage analysis
        storage_buckets = {}
        duplicate_paths = {}
        
        for track in tracks:
            bucket = track.get('storage_bucket', 'unknown')
            storage_key = track.get('storage_key')
            
            if bucket not in storage_buckets:
                storage_buckets[bucket] = []
            storage_buckets[bucket].append(track['id'])
            
            # Check for duplicate paths
            if storage_key:
                full_path = f"{bucket}/{storage_key}"
                if full_path not in duplicate_paths:
                    duplicate_paths[full_path] = []
                duplicate_paths[full_path].append(track['id'])
        
        # Find actual duplicates
        actual_duplicates = {path: ids for path, ids in duplicate_paths.items() if len(ids) > 1}
        
        validation_results['storage_analysis'] = {
            'buckets_used': storage_buckets,
            'storage_key_issues': invalid_storage_keys,
            'duplicate_path_count': len(actual_duplicates)
        }
        
        validation_results['file_path_issues'] = {
            'duplicate_paths': actual_duplicates,
            'problematic_characters': invalid_storage_keys
        }
        
        # Metadata coverage analysis
        has_bpm = len([t for t in tracks if t.get('bpm')])
        has_camelot = len([t for t in tracks if t.get('camelot')])
        has_duration = len([t for t in tracks if t.get('duration_seconds')])
        has_file_size = len([t for t in tracks if t.get('file_size_bytes')])
        
        validation_results['metadata_coverage'] = {
            'bpm_coverage': f"{has_bpm}/{len(tracks)} ({(has_bpm/len(tracks)*100):.1f}%)" if tracks else "0/0",
            'camelot_coverage': f"{has_camelot}/{len(tracks)} ({(has_camelot/len(tracks)*100):.1f}%)" if tracks else "0/0",
            'duration_coverage': f"{has_duration}/{len(tracks)} ({(has_duration/len(tracks)*100):.1f}%)" if tracks else "0/0",
            'file_size_coverage': f"{has_file_size}/{len(tracks)} ({(has_file_size/len(tracks)*100):.1f}%)" if tracks else "0/0"
        }
        
        # Generate recommendations
        recommendations = []
        if len(missing_title) > 0:
            recommendations.append(f"Fix {len(missing_title)} tracks with missing titles")
        if len(missing_storage_key) > 0:
            recommendations.append(f"Fix {len(missing_storage_key)} tracks with missing storage keys")
        if len(invalid_storage_keys) > 0:
            recommendations.append(f"Sanitize {len(invalid_storage_keys)} storage keys with problematic characters")
        if len(actual_duplicates) > 0:
            recommendations.append(f"Resolve {len(actual_duplicates)} duplicate file path conflicts")
        if has_bpm < len(tracks) * 0.8:
            recommendations.append(f"Run BPM analysis on {len(tracks) - has_bpm} tracks")
        if has_camelot == 0:
            recommendations.append("Run Camelot key analysis on all tracks")
        
        validation_results['recommendations'] = recommendations
        
        logger.info(f"Track validation complete: {len(tracks)} tracks analyzed")
        return validation_results
    
    async def validate_storage_buckets(self) -> Dict[str, Any]:
        """Validate storage bucket contents"""
        logger.info("Validating storage buckets...")
        
        storage_validation = {
            'buckets_checked': [],
            'file_inventory': {},
            'bucket_issues': []
        }
        
        try:
            # Get list of buckets
            buckets = self.supabase.storage.list_buckets()
            
            for bucket in buckets:
                bucket_name = bucket.name
                storage_validation['buckets_checked'].append(bucket_name)
                
                try:
                    # List files in bucket
                    files = self.supabase.storage.from_(bucket_name).list()
                    
                    file_list = []
                    total_size = 0
                    
                    def process_file_list(file_items, prefix=""):
                        nonlocal total_size
                        for item in file_items:
                            if hasattr(item, 'name'):
                                file_path = f"{prefix}{item.name}" if prefix else item.name
                                file_list.append({
                                    'path': file_path,
                                    'size': getattr(item, 'metadata', {}).get('size', 0),
                                    'last_modified': getattr(item, 'updated_at', None)
                                })
                                if hasattr(item, 'metadata') and item.metadata:
                                    total_size += item.metadata.get('size', 0)
                    
                    process_file_list(files)
                    
                    storage_validation['file_inventory'][bucket_name] = {
                        'file_count': len(file_list),
                        'total_size_bytes': total_size,
                        'total_size_mb': round(total_size / (1024*1024), 2),
                        'files': file_list[:10]  # Sample of first 10 files
                    }
                    
                except Exception as e:
                    storage_validation['bucket_issues'].append({
                        'bucket': bucket_name,
                        'error': str(e)
                    })
        
        except Exception as e:
            storage_validation['bucket_issues'].append({
                'general_error': str(e)
            })
        
        # Validate audio bucket specifically
        await self._validate_audio_bucket(storage_validation)
        
        logger.info(f"Storage validation complete: {len(storage_validation['buckets_checked'])} buckets checked")
        return storage_validation
    
    async def _validate_audio_bucket(self, storage_validation: Dict[str, Any]):
        """Specifically validate the audio bucket against database records"""
        logger.info("Cross-referencing audio bucket with database...")
        
        # Get database track file references
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT storage_key, storage_bucket, id, title 
            FROM tracks 
            WHERE storage_key IS NOT NULL 
            AND storage_bucket = 'audio'
        """)
        
        db_files = {row[0]: {'id': row[2], 'title': row[3]} for row in cursor.fetchall()}
        cursor.close()
        conn.close()
        
        # Get actual files in audio bucket
        try:
            bucket_files = set()
            audio_files = self.supabase.storage.from_('audio').list()
            
            def collect_files(file_items, prefix=""):
                for item in file_items:
                    if hasattr(item, 'name'):
                        file_path = f"{prefix}{item.name}" if prefix else item.name
                        if not file_path.endswith('/'):  # Not a folder
                            bucket_files.add(file_path)
            
            collect_files(audio_files)
            
            # Find orphaned files (in bucket but not in database)
            orphaned_files = bucket_files - set(db_files.keys())
            
            # Find missing files (in database but not in bucket)
            missing_files = set(db_files.keys()) - bucket_files
            
            audio_bucket_validation = {
                'database_references': len(db_files),
                'actual_files_in_bucket': len(bucket_files),
                'orphaned_files': list(orphaned_files)[:20],  # First 20
                'missing_files': [
                    {'storage_key': key, 'track_info': db_files[key]} 
                    for key in list(missing_files)[:20]  # First 20
                ],
                'orphaned_count': len(orphaned_files),
                'missing_count': len(missing_files),
                'consistency_score': round(
                    ((len(bucket_files) - len(orphaned_files)) / max(1, len(db_files))) * 100, 1
                )
            }
            
            storage_validation['audio_bucket_validation'] = audio_bucket_validation
            
        except Exception as e:
            storage_validation['bucket_issues'].append({
                'audio_bucket_error': str(e)
            })
    
    async def validate_data_relationships(self) -> Dict[str, Any]:
        """Validate relationships and constraints between data"""
        logger.info("Validating data relationships...")
        
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        # Check for data consistency issues
        cursor.execute("""
            SELECT 
                COUNT(*) as total_tracks,
                COUNT(CASE WHEN title IS NOT NULL AND title != '' THEN 1 END) as has_title,
                COUNT(CASE WHEN storage_key IS NOT NULL THEN 1 END) as has_storage_key,
                COUNT(CASE WHEN audio_status = 'working' THEN 1 END) as status_working,
                COUNT(CASE WHEN bpm IS NOT NULL THEN 1 END) as has_bpm,
                COUNT(CASE WHEN camelot IS NOT NULL THEN 1 END) as has_camelot,
                COUNT(CASE WHEN duration_seconds > 0 THEN 1 END) as has_duration
            FROM tracks
        """)
        
        stats = cursor.fetchone()
        
        relationship_validation = {
            'track_statistics': {
                'total_tracks': stats[0],
                'completeness_scores': {
                    'title_completeness': round((stats[1] / stats[0]) * 100, 1) if stats[0] > 0 else 0,
                    'storage_completeness': round((stats[2] / stats[0]) * 100, 1) if stats[0] > 0 else 0,
                    'working_status_rate': round((stats[3] / stats[0]) * 100, 1) if stats[0] > 0 else 0,
                    'bpm_completeness': round((stats[4] / stats[0]) * 100, 1) if stats[0] > 0 else 0,
                    'camelot_completeness': round((stats[5] / stats[0]) * 100, 1) if stats[0] > 0 else 0,
                    'duration_completeness': round((stats[6] / stats[0]) * 100, 1) if stats[0] > 0 else 0
                }
            }
        }
        
        # Check for tracks ready for analysis
        cursor.execute("""
            SELECT COUNT(*) 
            FROM tracks 
            WHERE storage_key IS NOT NULL 
            AND title IS NOT NULL 
            AND title != ''
            AND audio_status = 'working'
        """)
        
        ready_for_analysis = cursor.fetchone()[0]
        
        relationship_validation['analysis_readiness'] = {
            'tracks_ready_for_analysis': ready_for_analysis,
            'readiness_percentage': round((ready_for_analysis / stats[0]) * 100, 1) if stats[0] > 0 else 0,
            'tracks_needing_preparation': stats[0] - ready_for_analysis
        }
        
        cursor.close()
        conn.close()
        
        logger.info("Data relationship validation complete")
        return relationship_validation
    
    async def run_complete_validation(self) -> Dict[str, Any]:
        """Run complete validation suite"""
        logger.info("Starting comprehensive data validation...")
        
        validation_report = {
            'validation_timestamp': datetime.now().isoformat(),
            'validation_version': '1.0',
            'track_validation': {},
            'storage_validation': {},
            'relationship_validation': {},
            'overall_assessment': {}
        }
        
        # Run all validation components
        validation_report['track_validation'] = await self.validate_track_records()
        validation_report['storage_validation'] = await self.validate_storage_buckets()
        validation_report['relationship_validation'] = await self.validate_data_relationships()
        
        # Generate overall assessment
        track_issues = len(validation_report['track_validation'].get('data_quality_issues', {}).get('tracks_with_issues', []))
        total_tracks = validation_report['track_validation'].get('total_tracks', 0)
        storage_consistency = validation_report['storage_validation'].get('audio_bucket_validation', {}).get('consistency_score', 0)
        readiness_pct = validation_report['relationship_validation'].get('analysis_readiness', {}).get('readiness_percentage', 0)
        
        # Calculate overall health score
        health_score = (
            max(0, 100 - (track_issues / max(1, total_tracks) * 100)) * 0.4 +  # 40% weight on data quality
            storage_consistency * 0.3 +  # 30% weight on storage consistency
            readiness_pct * 0.3  # 30% weight on analysis readiness
        )
        
        validation_report['overall_assessment'] = {
            'data_health_score': round(health_score, 1),
            'critical_issues': track_issues,
            'total_tracks': total_tracks,
            'storage_consistency_score': storage_consistency,
            'analysis_readiness_score': readiness_pct,
            'recommended_actions': validation_report['track_validation'].get('recommendations', []),
            'ready_for_migration': health_score > 70,
            'ready_for_analysis': health_score > 85 and readiness_pct > 80
        }
        
        logger.info(f"Validation complete - Health Score: {health_score:.1f}%")
        return validation_report

async def main():
    """Run comprehensive data validation"""
    
    # Configuration
    DATABASE_URL = os.getenv('DATABASE_URL', 
        "postgresql://postgres.pbtgvcjniayedqlajjzz:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.co:6543/postgres"
    )
    SUPABASE_URL = "https://pbtgvcjniayedqlajjzz.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE"
    
    if "YOUR_PASSWORD" in DATABASE_URL:
        logger.error("Please update DATABASE_URL with your actual database password")
        return
    
    # Create validator
    validator = DataIntegrityValidator(DATABASE_URL, SUPABASE_URL, SUPABASE_KEY)
    
    # Run complete validation
    logger.info("Starting comprehensive data integrity validation...")
    results = await validator.run_complete_validation()
    
    # Save validation report
    report_filename = f"validation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_filename, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    # Print summary report
    assessment = results.get('overall_assessment', {})
    print(f"\n{'='*60}")
    print(f"DATA INTEGRITY VALIDATION REPORT")
    print(f"{'='*60}")
    print(f"Overall Health Score: {assessment.get('data_health_score', 0)}%")
    print(f"Total Tracks: {assessment.get('total_tracks', 0)}")
    print(f"Critical Issues: {assessment.get('critical_issues', 0)}")
    print(f"Storage Consistency: {assessment.get('storage_consistency_score', 0)}%")
    print(f"Analysis Readiness: {assessment.get('analysis_readiness_score', 0)}%")
    print(f"\nReady for Migration: {'Yes' if assessment.get('ready_for_migration') else 'No'}")
    print(f"Ready for Analysis: {'Yes' if assessment.get('ready_for_analysis') else 'No'}")
    
    if assessment.get('recommended_actions'):
        print(f"\nRecommended Actions:")
        for i, action in enumerate(assessment.get('recommended_actions', []), 1):
            print(f"  {i}. {action}")
    
    print(f"\nDetailed report saved to: {report_filename}")
    
    if not assessment.get('ready_for_migration'):
        print(f"\n⚠️  Data needs cleanup before migration. Run data_migration_system.py to fix issues.")
    elif assessment.get('ready_for_analysis'):
        print(f"\n✅ Data is ready for analysis! You can run deploy_and_run.py directly.")
    else:
        print(f"\n🔧 Data needs migration and organization. Run data_migration_system.py next.")
    
    return results

if __name__ == "__main__":
    asyncio.run(main())