#!/usr/bin/env python3
"""
Data Migration & Storage Cleanup System
Fixes data integrity issues and creates organized storage structure
"""

import asyncio
import psycopg2
import logging
from pathlib import Path
from typing import List, Dict, Any, Set, Optional, Tuple
from supabase import create_client, Client
import os
import re
import shutil
from datetime import datetime
import json
import hashlib

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DataMigrationManager:
    def __init__(self, db_connection_string: str, supabase_url: str, supabase_key: str):
        self.db_connection_string = db_connection_string
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.supabase: Client = create_client(supabase_url, supabase_key)
        
        # Define organized bucket structure
        self.organized_buckets = {
            'verified-audio': 'Verified audio files ready for analysis',
            'analyzed-results': 'Processed analysis results and metadata',
            'problem-files': 'Files with issues requiring manual review'
        }
    
    def get_db_connection(self):
        """Get database connection"""
        return psycopg2.connect(self.db_connection_string)
    
    def sanitize_filename(self, filename: str) -> str:
        """Create safe, consistent filename"""
        # Remove or replace problematic characters
        sanitized = re.sub(r'[<>:"/\\|?*]', '_', filename)
        sanitized = re.sub(r'\s+', '_', sanitized)  # Replace spaces with underscores
        sanitized = re.sub(r'_+', '_', sanitized)   # Collapse multiple underscores
        sanitized = sanitized.strip('_')            # Remove leading/trailing underscores
        
        # Limit length
        if len(sanitized) > 200:
            name, ext = os.path.splitext(sanitized)
            sanitized = name[:195] + ext
        
        return sanitized
    
    def generate_organized_path(self, track: Dict[str, Any]) -> str:
        """Generate organized file path for track"""
        track_id = track['id']
        title = track.get('title', 'Unknown_Track')
        artist = track.get('artist', 'Unknown_Artist')
        
        # Get file extension from original storage key or default
        original_key = track.get('storage_key', '')
        if '.' in original_key:
            extension = Path(original_key).suffix
        else:
            extension = '.mp3'  # Default
        
        # Create organized filename
        safe_title = self.sanitize_filename(title)
        safe_artist = self.sanitize_filename(artist) if artist else None
        
        if safe_artist and safe_artist != 'Unknown_Artist':
            filename = f"track_{track_id}_{safe_artist}_{safe_title}{extension}"
        else:
            filename = f"track_{track_id}_{safe_title}{extension}"
        
        return filename
    
    async def create_organized_buckets(self) -> Dict[str, Any]:
        """Create organized bucket structure"""
        logger.info("Creating organized bucket structure...")
        
        results = {
            'created_buckets': [],
            'existing_buckets': [],
            'errors': []
        }
        
        try:
            # Get existing buckets
            existing_buckets = self.supabase.storage.list_buckets()
            existing_names = {bucket.name for bucket in existing_buckets}
            
            # Create new organized buckets
            for bucket_name, description in self.organized_buckets.items():
                if bucket_name not in existing_names:
                    try:
                        self.supabase.storage.create_bucket(
                            bucket_name,
                            options={"public": False}
                        )
                        results['created_buckets'].append({
                            'name': bucket_name,
                            'description': description
                        })
                        logger.info(f"Created bucket: {bucket_name}")
                    except Exception as e:
                        results['errors'].append({
                            'bucket': bucket_name,
                            'error': str(e)
                        })
                        logger.error(f"Failed to create bucket {bucket_name}: {e}")
                else:
                    results['existing_buckets'].append(bucket_name)
                    logger.info(f"Bucket already exists: {bucket_name}")
            
            return results
            
        except Exception as e:
            logger.error(f"Error creating organized buckets: {e}")
            return {'error': str(e)}
    
    async def fix_storage_key_issues(self, tracks_with_issues: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Fix storage key formatting issues"""
        logger.info(f"Fixing storage key issues for {len(tracks_with_issues)} tracks...")
        
        results = {
            'fixed_tracks': [],
            'failed_tracks': [],
            'total_processed': 0
        }
        
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        try:
            for track in tracks_with_issues:
                track_id = track['id']
                original_key = track.get('storage_key', '')
                
                # Generate clean storage key
                cleaned_key = self.sanitize_filename(original_key) if original_key else None
                
                if cleaned_key and cleaned_key != original_key:
                    try:
                        # Update database
                        cursor.execute("""
                            UPDATE tracks 
                            SET storage_key = %s, 
                                updated_at = %s,
                                last_verified_at = %s
                            WHERE id = %s
                        """, (cleaned_key, datetime.now(), datetime.now(), track_id))
                        
                        results['fixed_tracks'].append({
                            'track_id': track_id,
                            'title': track.get('title'),
                            'old_key': original_key,
                            'new_key': cleaned_key
                        })
                        
                    except Exception as e:
                        results['failed_tracks'].append({
                            'track_id': track_id,
                            'error': str(e)
                        })
                
                results['total_processed'] += 1
            
            conn.commit()
            cursor.close()
            conn.close()
            
            logger.info(f"Fixed {len(results['fixed_tracks'])} storage key issues")
            return results
            
        except Exception as e:
            conn.rollback()
            cursor.close()
            conn.close()
            logger.error(f"Error fixing storage keys: {e}")
            return {'error': str(e)}
    
    async def resolve_duplicate_paths(self, duplicate_groups: Dict[str, List[str]]) -> Dict[str, Any]:
        """Resolve duplicate storage path conflicts"""
        logger.info(f"Resolving {len(duplicate_groups)} duplicate path conflicts...")
        
        results = {
            'resolved_duplicates': [],
            'failed_resolutions': [],
            'total_processed': 0
        }
        
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        try:
            for storage_key, track_ids in duplicate_groups.items():
                if len(track_ids) <= 1:
                    continue
                
                # Get full track info for all duplicates
                cursor.execute("""
                    SELECT id, title, artist, created_date, file_size_bytes, duration_seconds
                    FROM tracks 
                    WHERE id = ANY(%s)
                    ORDER BY created_date ASC
                """, (track_ids,))
                
                duplicate_tracks = cursor.fetchall()
                
                # Keep the oldest track with the original path
                primary_track = duplicate_tracks[0]
                duplicate_track_ids = [track[0] for track in duplicate_tracks[1:]]
                
                # Generate new unique paths for duplicates
                for i, track in enumerate(duplicate_tracks[1:], 1):
                    track_id = track[0]
                    title = track[1] or 'Unknown'
                    
                    # Generate new unique path
                    base_name, ext = os.path.splitext(storage_key)
                    new_key = f"{base_name}_duplicate_{i}{ext}"
                    
                    try:
                        cursor.execute("""
                            UPDATE tracks 
                            SET storage_key = %s,
                                updated_at = %s,
                                last_verified_at = %s
                            WHERE id = %s
                        """, (new_key, datetime.now(), datetime.now(), track_id))
                        
                        results['resolved_duplicates'].append({
                            'track_id': track_id,
                            'title': title,
                            'old_key': storage_key,
                            'new_key': new_key
                        })
                        
                    except Exception as e:
                        results['failed_resolutions'].append({
                            'track_id': track_id,
                            'error': str(e)
                        })
                
                results['total_processed'] += len(track_ids)
            
            conn.commit()
            cursor.close()
            conn.close()
            
            logger.info(f"Resolved {len(results['resolved_duplicates'])} duplicate path conflicts")
            return results
            
        except Exception as e:
            conn.rollback()
            cursor.close()
            conn.close()
            logger.error(f"Error resolving duplicates: {e}")
            return {'error': str(e)}
    
    async def migrate_verified_tracks(self, limit: int = None) -> Dict[str, Any]:
        """Migrate verified tracks to organized storage structure"""
        logger.info("Starting verified track migration...")
        
        # Get tracks that are ready for migration (have valid storage keys and basic metadata)
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT id, title, artist, storage_key, storage_bucket, file_format, 
                   duration_seconds, file_size_bytes, bpm, camelot
            FROM tracks 
            WHERE storage_key IS NOT NULL 
            AND storage_key != ''
            AND title IS NOT NULL
            AND title != ''
            ORDER BY created_date ASC
        """
        
        if limit:
            query += f" LIMIT {limit}"
        
        cursor.execute(query)
        columns = [desc[0] for desc in cursor.description]
        tracks = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        logger.info(f"Found {len(tracks)} tracks ready for migration")
        
        migration_results = {
            'total_tracks': len(tracks),
            'successfully_migrated': [],
            'failed_migrations': [],
            'skipped_tracks': []
        }
        
        # Process tracks in batches
        batch_size = 10
        for i in range(0, len(tracks), batch_size):
            batch = tracks[i:i + batch_size]
            batch_results = await self._migrate_track_batch(batch)
            
            migration_results['successfully_migrated'].extend(batch_results['successful'])
            migration_results['failed_migrations'].extend(batch_results['failed'])
            migration_results['skipped_tracks'].extend(batch_results['skipped'])
            
            # Small delay between batches
            await asyncio.sleep(0.5)
        
        # Update migration summary
        migration_results['summary'] = {
            'total_processed': len(tracks),
            'successful_count': len(migration_results['successfully_migrated']),
            'failed_count': len(migration_results['failed_migrations']),
            'skipped_count': len(migration_results['skipped_tracks']),
            'success_rate': round(
                (len(migration_results['successfully_migrated']) / len(tracks)) * 100, 1
            ) if len(tracks) > 0 else 0
        }
        
        logger.info(f"Migration complete: {migration_results['summary']}")
        return migration_results
    
    async def _migrate_track_batch(self, tracks: List[Dict[str, Any]]) -> Dict[str, List]:
        """Migrate a batch of tracks"""
        results = {
            'successful': [],
            'failed': [],
            'skipped': []
        }
        
        for track in tracks:
            try:
                # Check if file exists in original location
                original_bucket = track.get('storage_bucket', 'audio')
                original_key = track['storage_key']
                
                # Try to get file info to verify it exists
                try:
                    file_info = self.supabase.storage.from_(original_bucket).info(original_key)
                    if not file_info:
                        results['skipped'].append({
                            'track_id': track['id'],
                            'reason': 'File not found in original location',
                            'original_path': f"{original_bucket}/{original_key}"
                        })
                        continue
                except:
                    results['skipped'].append({
                        'track_id': track['id'],
                        'reason': 'Cannot access original file',
                        'original_path': f"{original_bucket}/{original_key}"
                    })
                    continue
                
                # Generate organized path
                organized_path = self.generate_organized_path(track)
                
                # Determine target bucket based on track quality
                if track.get('bpm') and track.get('camelot'):
                    target_bucket = 'verified-audio'  # Has analysis data
                else:
                    target_bucket = 'verified-audio'  # Still verified, just needs analysis
                
                # Copy file to organized location
                try:
                    # Download from original location
                    file_data = self.supabase.storage.from_(original_bucket).download(original_key)
                    
                    # Upload to organized location
                    self.supabase.storage.from_(target_bucket).upload(
                        organized_path, 
                        file_data,
                        file_options={"upsert": True}
                    )
                    
                    # Update database record
                    await self._update_track_location(
                        track['id'], 
                        target_bucket, 
                        organized_path,
                        track
                    )
                    
                    results['successful'].append({
                        'track_id': track['id'],
                        'title': track.get('title'),
                        'old_location': f"{original_bucket}/{original_key}",
                        'new_location': f"{target_bucket}/{organized_path}"
                    })
                    
                except Exception as e:
                    results['failed'].append({
                        'track_id': track['id'],
                        'error': f"Migration failed: {str(e)}",
                        'original_path': f"{original_bucket}/{original_key}"
                    })
                
            except Exception as e:
                results['failed'].append({
                    'track_id': track['id'],
                    'error': f"Processing failed: {str(e)}"
                })
        
        return results
    
    async def _update_track_location(self, track_id: str, new_bucket: str, new_key: str, track_data: Dict):
        """Update track database record with new organized location"""
        
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                UPDATE tracks 
                SET storage_bucket = %s,
                    storage_key = %s,
                    updated_at = %s,
                    last_verified_at = %s,
                    audio_status = 'working'
                WHERE id = %s
            """, (
                new_bucket,
                new_key,
                datetime.now(),
                datetime.now(),
                track_id
            ))
            
            conn.commit()
            cursor.close()
            conn.close()
            
        except Exception as e:
            conn.rollback()
            cursor.close()
            conn.close()
            raise e
    
    async def cleanup_orphaned_files(self, orphaned_files: List[str], bucket_name: str = 'audio') -> Dict[str, Any]:
        """Clean up orphaned files (exist in storage but not in database)"""
        logger.info(f"Cleaning up {len(orphaned_files)} orphaned files...")
        
        results = {
            'moved_to_review': [],
            'deletion_errors': [],
            'total_processed': 0
        }
        
        for file_key in orphaned_files:
            try:
                # Move orphaned files to problem-files bucket for manual review
                file_data = self.supabase.storage.from_(bucket_name).download(file_key)
                
                # Create timestamped filename for review bucket
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                review_filename = f"orphaned_{timestamp}_{os.path.basename(file_key)}"
                
                # Upload to review bucket
                self.supabase.storage.from_('problem-files').upload(
                    review_filename,
                    file_data,
                    file_options={"upsert": True}
                )
                
                # Delete from original location
                self.supabase.storage.from_(bucket_name).remove([file_key])
                
                results['moved_to_review'].append({
                    'original_path': f"{bucket_name}/{file_key}",
                    'review_path': f"problem-files/{review_filename}"
                })
                
            except Exception as e:
                results['deletion_errors'].append({
                    'file_key': file_key,
                    'error': str(e)
                })
            
            results['total_processed'] += 1
        
        logger.info(f"Moved {len(results['moved_to_review'])} orphaned files to review bucket")
        return results
    
    async def run_complete_migration(self, validation_results: Dict[str, Any] = None) -> Dict[str, Any]:
        """Run complete data migration and cleanup process"""
        logger.info("Starting complete data migration and cleanup...")
        
        migration_report = {
            'migration_timestamp': datetime.now().isoformat(),
            'steps_completed': [],
            'errors': [],
            'summary': {}
        }
        
        try:
            # Step 1: Create organized bucket structure
            logger.info("Step 1: Creating organized bucket structure...")
            bucket_results = await self.create_organized_buckets()
            migration_report['steps_completed'].append({
                'step': 'create_buckets',
                'results': bucket_results
            })
            
            # Step 2: Fix storage key issues (if validation results provided)
            if validation_results and validation_results.get('track_validation'):
                storage_issues = validation_results['track_validation'].get('storage_analysis', {}).get('storage_key_issues', [])
                
                if storage_issues:
                    logger.info(f"Step 2: Fixing {len(storage_issues)} storage key issues...")
                    fix_results = await self.fix_storage_key_issues(storage_issues)
                    migration_report['steps_completed'].append({
                        'step': 'fix_storage_keys',
                        'results': fix_results
                    })
            
            # Step 3: Resolve duplicate paths
            if validation_results and validation_results.get('track_validation'):
                duplicates = validation_results['track_validation'].get('file_path_issues', {}).get('duplicate_paths', {})
                
                if duplicates:
                    logger.info(f"Step 3: Resolving {len(duplicates)} duplicate path conflicts...")
                    duplicate_results = await self.resolve_duplicate_paths(duplicates)
                    migration_report['steps_completed'].append({
                        'step': 'resolve_duplicates',
                        'results': duplicate_results
                    })
            
            # Step 4: Migrate verified tracks to organized structure
            logger.info("Step 4: Migrating tracks to organized structure...")
            migration_results = await self.migrate_verified_tracks(limit=50)  # Start with 50 tracks
            migration_report['steps_completed'].append({
                'step': 'migrate_tracks',
                'results': migration_results
            })
            
            # Step 5: Clean up orphaned files
            if validation_results and validation_results.get('storage_validation'):
                orphaned_files = validation_results['storage_validation'].get('audio_bucket_validation', {}).get('orphaned_files', [])
                
                if orphaned_files:
                    logger.info(f"Step 5: Cleaning up {len(orphaned_files)} orphaned files...")
                    cleanup_results = await self.cleanup_orphaned_files(orphaned_files)
                    migration_report['steps_completed'].append({
                        'step': 'cleanup_orphaned',
                        'results': cleanup_results
                    })
            
            # Create final summary
            migration_report['summary'] = {
                'total_steps': len(migration_report['steps_completed']),
                'buckets_created': len(bucket_results.get('created_buckets', [])),
                'tracks_migrated': migration_results.get('summary', {}).get('successful_count', 0),
                'migration_success_rate': migration_results.get('summary', {}).get('success_rate', 0),
                'ready_for_analysis': True
            }
            
            logger.info("Complete migration finished successfully!")
            return migration_report
            
        except Exception as e:
            logger.error(f"Migration process failed: {e}")
            migration_report['errors'].append({
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })
            return migration_report

async def main():
    """Run complete data migration process"""
    
    # Configuration
    DATABASE_URL = os.getenv('DATABASE_URL', 
        "postgresql://postgres.pbtgvcjniayedqlajjzz:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.co:6543/postgres"
    )
    SUPABASE_URL = "https://pbtgvcjniayedqlajjzz.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE"
    
    if "YOUR_PASSWORD" in DATABASE_URL:
        logger.error("Update DATABASE_URL with your actual password")
        return
    
    # Create migration manager
    migrator = DataMigrationManager(DATABASE_URL, SUPABASE_URL, SUPABASE_KEY)
    
    # Load validation results if available
    validation_results = None
    validation_files = [f for f in os.listdir('.') if f.startswith('validation_report_') and f.endswith('.json')]
    
    if validation_files:
        latest_validation = sorted(validation_files)[-1]
        logger.info(f"Loading validation results from: {latest_validation}")
        
        with open(latest_validation, 'r') as f:
            validation_results = json.load(f)
    else:
        logger.warning("No validation results found. Run data validation first for best results.")
    
    # Run complete migration
    logger.info("Starting complete data migration and cleanup...")
    results = await migrator.run_complete_migration(validation_results)
    
    # Save migration report
    report_filename = f"migration_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_filename, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    # Print summary
    summary = results.get('summary', {})
    print(f"\n{'='*60}")
    print(f"DATA MIGRATION REPORT")
    print(f"{'='*60}")
    print(f"Steps Completed: {summary.get('total_steps', 0)}")
    print(f"Buckets Created: {summary.get('buckets_created', 0)}")
    print(f"Tracks Migrated: {summary.get('tracks_migrated', 0)}")
    print(f"Success Rate: {summary.get('migration_success_rate', 0)}%")
    print(f"Ready for Analysis: {'Yes' if summary.get('ready_for_analysis') else 'No'}")
    
    logger.info(f"Migration report saved to: {report_filename}")
    
    if summary.get('ready_for_analysis'):
        logger.info("Your data is now organized and ready for the audio analysis pipeline!")
    else:
        logger.warning("Some issues remain. Review the migration report and fix remaining problems.")
    
    return results

if __name__ == "__main__":
    asyncio.run(main())