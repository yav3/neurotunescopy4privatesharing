#!/usr/bin/env python3
"""
NeuraPositiveMusic Bucket Analysis & Import
Searches metadata and imports tracks with VAD analysis
"""

import asyncio
from supabase import create_client
import logging
import json
from datetime import datetime
from pathlib import Path
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class NeuraPositiveMusicAnalyzer:
    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase = create_client(supabase_url, supabase_key)
        
    async def analyze_neuralpositivemusic_bucket(self):
        """Analyze neuralpositivemusic bucket for VAD-suitable tracks"""
        logger.info("Analyzing neuralpositivemusic bucket...")
        
        try:
            # List all files in neuralpositivemusic bucket
            files = self.supabase.storage.from_('neuralpositivemusic').list()
            
            audio_files = []
            for file in files:
                if file.get('name', '').lower().endswith(('.mp3', '.wav', '.m4a', '.flac')):
                    audio_files.append(file)
            
            logger.info(f"Found {len(audio_files)} audio files")
            
            # Categorize by filename analysis for VAD potential
            vad_candidates = self.categorize_for_vad(audio_files)
            
            return {
                'total_audio_files': len(audio_files),
                'vad_candidates': vad_candidates,
                'import_recommendations': self.generate_import_recommendations(vad_candidates)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing bucket: {e}")
            return {'error': str(e)}
    
    def categorize_for_vad(self, files):
        """Categorize files by VAD therapeutic potential"""
        categories = {
            'focus_enhancement': [],
            'anxiety_relief': [], 
            'mood_boost': [],
            'sleep_preparation': [],
            'energy_boost': [],
            'uncategorized': []
        }
        
        # VAD keyword mapping
        vad_keywords = {
            'focus_enhancement': ['focus', 'concentration', 'study', 'cognitive', 'alpha', 'productivity'],
            'anxiety_relief': ['calm', 'peace', 'anxiety', 'relief', 'theta', 'gentle', 'sooth'],
            'mood_boost': ['happy', 'joy', 'positive', 'uplifting', 'bright', 'cheerful'],
            'sleep_preparation': ['sleep', 'dream', 'night', 'delta', 'deep', 'rest'],
            'energy_boost': ['energy', 'power', 'dynamic', 'beta', 'motivation', 'drive']
        }
        
        for file in files:
            filename = file['name'].lower()
            clean_name = re.sub(r'[_\-\.]', ' ', Path(filename).stem)
            
            categorized = False
            for category, keywords in vad_keywords.items():
                if any(keyword in clean_name for keyword in keywords):
                    categories[category].append({
                        'filename': file['name'],
                        'size_mb': round(file.get('metadata', {}).get('size', 0) / (1024*1024), 2),
                        'keywords_matched': [kw for kw in keywords if kw in clean_name]
                    })
                    categorized = True
                    break
            
            if not categorized:
                categories['uncategorized'].append({
                    'filename': file['name'],
                    'size_mb': round(file.get('metadata', {}).get('size', 0) / (1024*1024), 2)
                })
        
        return categories
    
    def generate_import_recommendations(self, candidates):
        """Generate import recommendations based on VAD analysis"""
        recommendations = []
        
        # Priority order based on therapeutic need
        priority_goals = [
            ('anxiety_relief', 'High priority - you have 0 tracks in 40-80 BPM range'),
            ('sleep_preparation', 'High priority - very few tracks under 60 BPM'),
            ('focus_enhancement', 'Medium priority - supplement existing tracks'),
            ('mood_boost', 'Low priority - already have good coverage'),
            ('energy_boost', 'Low priority - already have good coverage')
        ]
        
        for goal, reason in priority_goals:
            count = len(candidates.get(goal, []))
            if count > 0:
                recommendations.append({
                    'goal': goal,
                    'candidate_count': count,
                    'priority': reason.split(' - ')[0],
                    'reason': reason.split(' - ')[1],
                    'action': f'Import top {min(count, 20)} tracks for VAD analysis'
                })
        
        return recommendations
    
    async def import_priority_tracks(self, analysis_result, limit_per_goal=10):
        """Import priority tracks to main tracks table"""
        candidates = analysis_result['vad_candidates']
        imported = []
        
        # Import high-priority categories first
        for goal in ['anxiety_relief', 'sleep_preparation', 'focus_enhancement']:
            goal_files = candidates.get(goal, [])[:limit_per_goal]
            
            for file_info in goal_files:
                try:
                    # Create track record with initial VAD estimates
                    vad_estimate = self.estimate_vad_from_filename(file_info['filename'], goal)
                    
                    track_data = {
                        'title': self.clean_title(file_info['filename']),
                        'storage_bucket': 'neuralpositivemusic',
                        'storage_key': file_info['filename'],
                        'audio_status': 'pending_vad_analysis',
                        'valence': vad_estimate['valence'],
                        'arousal': vad_estimate['arousal'], 
                        'dominance': vad_estimate['dominance'],
                        'therapeutic_use': [goal],
                        'mood': goal.replace('_', ' ').title(),
                        'genre': 'Therapeutic',
                        'artist': 'Neural Positive Music'
                    }
                    
                    result = self.supabase.table('tracks').insert(track_data).execute()
                    
                    if not result.data:
                        raise Exception("Insert failed")
                    
                    imported.append({
                        'filename': file_info['filename'],
                        'goal': goal,
                        'track_id': result.data[0]['id'],
                        'vad_estimate': vad_estimate
                    })
                    
                    logger.info(f"Imported: {file_info['filename']} for {goal}")
                    
                except Exception as e:
                    logger.error(f"Failed to import {file_info['filename']}: {e}")
        
        return imported
    
    def estimate_vad_from_filename(self, filename, goal):
        """Estimate VAD values from filename and goal"""
        # Conservative estimates based on therapeutic goal
        vad_estimates = {
            'anxiety_relief': {'valence': 0.65, 'arousal': 0.25, 'dominance': 0.55},
            'sleep_preparation': {'valence': 0.55, 'arousal': 0.15, 'dominance': 0.45},
            'focus_enhancement': {'valence': 0.60, 'arousal': 0.55, 'dominance': 0.65},
            'mood_boost': {'valence': 0.80, 'arousal': 0.60, 'dominance': 0.60},
            'energy_boost': {'valence': 0.75, 'arousal': 0.75, 'dominance': 0.70}
        }
        
        return vad_estimates.get(goal, {'valence': 0.50, 'arousal': 0.50, 'dominance': 0.50})
    
    def clean_title(self, filename):
        """Clean filename for title"""
        title = Path(filename).stem
        title = re.sub(r'[_\-]+', ' ', title)
        title = re.sub(r'\s+', ' ', title)
        return title.title().strip()

async def main():
    SUPABASE_URL = "https://pbtgvcjniayedqlajjzz.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGd2Y2puaWF5ZWRxbGFqanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzM2ODksImV4cCI6MjA2NTUwOTY4OX0.HyVXhnCpXGAj6pX2_11-vbUppI4deicp2OM6Wf976gE"
    
    analyzer = NeuraPositiveMusicAnalyzer(SUPABASE_URL, SUPABASE_KEY)
    
    # Analyze bucket
    print("🔍 Analyzing neuralpositivemusic bucket...")
    analysis = await analyzer.analyze_neuralpositivemusic_bucket()
    
    # Print results
    print("\n" + "="*60)
    print("NEURALPOSITIVEMUSIC VAD ANALYSIS")
    print("="*60)
    
    if 'error' not in analysis:
        candidates = analysis['vad_candidates']
        print(f"\n📊 TOTAL AUDIO FILES: {analysis['total_audio_files']}")
        
        for goal, files in candidates.items():
            if files:
                print(f"\n🎯 {goal.upper().replace('_', ' ')}: {len(files)} candidates")
                for file in files[:3]:  # Show first 3
                    keywords = file.get('keywords_matched', [])
                    kw_str = f" (matched: {', '.join(keywords)})" if keywords else ""
                    print(f"  📁 {file['filename']} ({file['size_mb']} MB){kw_str}")
                if len(files) > 3:
                    print(f"  📁 ... and {len(files) - 3} more")
        
        print(f"\n💡 RECOMMENDATIONS:")
        for rec in analysis['import_recommendations']:
            priority_emoji = "🔴" if rec['priority'] == 'High priority' else "🟡" if rec['priority'] == 'Medium priority' else "🟢"
            print(f"  {priority_emoji} {rec['goal']}: {rec['candidate_count']} files - {rec['reason']}")
        
        # Ask user if they want to import
        print(f"\n🤖 Would you like to import priority tracks? (y/n): ", end="")
        try:
            response = input().strip().lower()
            if response in ['y', 'yes']:
                print("🚀 Importing priority tracks...")
                imported = await analyzer.import_priority_tracks(analysis, limit_per_goal=15)
                print(f"\n✅ Successfully imported {len(imported)} tracks!")
                
                # Group by goal for summary
                by_goal = {}
                for imp in imported:
                    goal = imp['goal']
                    if goal not in by_goal:
                        by_goal[goal] = []
                    by_goal[goal].append(imp)
                
                for goal, tracks in by_goal.items():
                    print(f"  🎯 {goal}: {len(tracks)} tracks")
                    for track in tracks[:3]:
                        print(f"    📁 {track['filename']}")
                    if len(tracks) > 3:
                        print(f"    📁 ... and {len(tracks) - 3} more")
            else:
                print("❌ Import cancelled.")
        except KeyboardInterrupt:
            print("\n❌ Import cancelled.")
    else:
        print(f"❌ Error: {analysis['error']}")
    
    return analysis

if __name__ == "__main__":
    try:
        result = asyncio.run(main())
    except Exception as e:
        print(f"❌ Script failed: {e}")