#!/usr/bin/env python3
"""
Streamlined Audio Key Detection Pipeline
Fast key detection for therapeutic music with Camelot wheel integration.
Optimized for speed: ~10-30 seconds per track vs 5+ minutes for comprehensive analysis.
"""

import librosa
import numpy as np
import pandas as pd
from essentia.standard import *
import json
import os
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed
import argparse
import time
import warnings
warnings.filterwarnings('ignore')


class StreamlinedKeyAnalyzer:
    def __init__(self, sample_rate=22050, duration=60):
        """
        Initialize with optimized settings for speed
        
        Args:
            sample_rate: Lower sample rate for faster processing
            duration: Analyze only first N seconds (60s is sufficient for key detection)
        """
        self.sr = sample_rate
        self.duration = duration
        
        # Camelot wheel mapping
        self.camelot_map = {
            ('C', 'major'): '8B', ('C', 'minor'): '5A',
            ('C#', 'major'): '3B', ('C#', 'minor'): '12A',
            ('Db', 'major'): '3B', ('Db', 'minor'): '12A',
            ('D', 'major'): '10B', ('D', 'minor'): '7A',
            ('D#', 'major'): '5B', ('D#', 'minor'): '2A',
            ('Eb', 'major'): '5B', ('Eb', 'minor'): '2A',
            ('E', 'major'): '12B', ('E', 'minor'): '9A',
            ('F', 'major'): '7B', ('F', 'minor'): '4A',
            ('F#', 'major'): '2B', ('F#', 'minor'): '11A',
            ('Gb', 'major'): '2B', ('Gb', 'minor'): '11A',
            ('G', 'major'): '9B', ('G', 'minor'): '6A',
            ('G#', 'major'): '4B', ('G#', 'minor'): '1A',
            ('Ab', 'major'): '4B', ('Ab', 'minor'): '1A',
            ('A', 'major'): '11B', ('A', 'minor'): '8A',
            ('A#', 'major'): '6B', ('A#', 'minor'): '3A',
            ('Bb', 'major'): '6B', ('Bb', 'minor'): '3A',
            ('B', 'major'): '1B', ('B', 'minor'): '10A',
        }

    def analyze_track(self, audio_path):
        """
        Fast key detection focusing on essential harmonic mixing features
        
        Returns:
            dict: Essential features for therapeutic music mixing
        """
        try:
            start_time = time.time()
            
            # Load only first 60 seconds at lower sample rate for speed
            y, sr = librosa.load(audio_path, sr=self.sr, duration=self.duration)
            
            if len(y) == 0:
                return self._empty_result(audio_path, "Empty audio file")
            
            # === CORE KEY DETECTION ===
            key_data = self._detect_key_essentia(audio_path)
            
            # === TEMPO DETECTION ===
            tempo_data = self._detect_tempo(y, sr)
            
            # === ENERGY FEATURES (minimal for therapeutic categorization) ===
            energy_data = self._extract_energy_features(y)
            
            # === COMBINE RESULTS ===
            result = {
                'file_path': str(audio_path),
                'file_name': Path(audio_path).name,
                'processing_time': time.time() - start_time,
                'analysis_method': 'streamlined_key_detection',
                **key_data,
                **tempo_data,
                **energy_data
            }
            
            return result
            
        except Exception as e:
            return self._empty_result(audio_path, str(e))
    
    def _detect_key_essentia(self, audio_path):
        """Use Essentia's optimized key detection"""
        try:
            # Load with Essentia
            loader = MonoLoader(filename=str(audio_path))
            audio = loader()
            
            # Primary key detection (fast, accurate)
            key_extractor = KeyExtractor(usePolyphony=True, useThreeChords=True)
            key, scale, strength = key_extractor(audio)
            
            # Convert to Camelot notation
            camelot = self.camelot_map.get((key, scale), 'Unknown')
            
            return {
                'musical_key': key,
                'musical_scale': scale,
                'key_strength': float(strength),
                'camelot': camelot,
            }
            
        except Exception as e:
            return {
                'musical_key': 'Unknown',
                'musical_scale': 'Unknown', 
                'key_strength': 0.0,
                'camelot': 'Unknown',
                'key_detection_error': str(e)
            }
    
    def _detect_tempo(self, y, sr):
        """Fast tempo detection using librosa"""
        try:
            # Primary tempo detection
            tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
            
            # Beat tracking confidence
            onset_env = librosa.onset.onset_strength(y=y, sr=sr)
            beat_confidence = np.mean(onset_env[beats.astype(int)]) if len(beats) > 0 else 0.0
            
            return {
                'tempo_bpm': float(tempo),
                'beat_confidence': float(beat_confidence),
                'beats_detected': len(beats),
            }
            
        except Exception as e:
            return {
                'tempo_bpm': 0.0,
                'beat_confidence': 0.0,
                'beats_detected': 0,
                'tempo_detection_error': str(e)
            }
    
    def _extract_energy_features(self, y):
        """Essential energy features for therapeutic categorization"""
        try:
            # RMS energy (overall energy level)
            rms = librosa.feature.rms(y=y)[0]
            rms_mean = float(np.mean(rms))
            
            # Spectral centroid (brightness/timbre)
            spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=self.sr)[0]
            brightness = float(np.mean(spectral_centroid))
            
            # Zero crossing rate (noisiness/texture)
            zcr = librosa.feature.zero_crossing_rate(y)[0]
            texture = float(np.mean(zcr))
            
            return {
                'energy_level': rms_mean,
                'brightness': brightness,
                'texture': texture,
                'dynamic_range': float(np.max(rms) - np.min(rms)),
            }
            
        except Exception as e:
            return {
                'energy_level': 0.0,
                'brightness': 0.0,
                'texture': 0.0,
                'dynamic_range': 0.0,
                'energy_extraction_error': str(e)
            }
    
    def _empty_result(self, audio_path, error_msg):
        """Return empty result structure for failed analysis"""
        return {
            'file_path': str(audio_path),
            'file_name': Path(audio_path).name,
            'processing_time': 0.0,
            'analysis_method': 'failed',
            'error_message': error_msg,
            'musical_key': 'Unknown',
            'musical_scale': 'Unknown',
            'key_strength': 0.0,
            'camelot': 'Unknown',
            'tempo_bpm': 0.0,
            'beat_confidence': 0.0,
            'beats_detected': 0,
            'energy_level': 0.0,
            'brightness': 0.0,
            'texture': 0.0,
            'dynamic_range': 0.0,
        }


def analyze_single_track(args):
    """Worker function for parallel processing"""
    audio_path, analyzer_params = args
    analyzer = StreamlinedKeyAnalyzer(**analyzer_params)
    return analyzer.analyze_track(audio_path)


def process_audio_batch_parallel(file_paths, output_csv='streamlined_audio_analysis.csv', 
                                num_workers=8, sample_rate=22050, duration=60):
    """
    Process multiple audio files in parallel for maximum speed
    
    Args:
        file_paths: List of audio file paths
        output_csv: Output CSV filename
        num_workers: Number of parallel processes (recommend: CPU cores)
        sample_rate: Audio sample rate for processing
        duration: Seconds of audio to analyze
    """
    
    print(f"🎵 Starting streamlined key analysis for {len(file_paths)} tracks")
    print(f"⚡ Using {num_workers} parallel workers")
    print(f"🔧 Settings: {sample_rate}Hz sample rate, {duration}s duration per track")
    print("-" * 60)
    
    start_time = time.time()
    results = []
    failed_files = []
    
    # Prepare arguments for parallel processing
    analyzer_params = {
        'sample_rate': sample_rate,
        'duration': duration
    }
    
    args_list = [(fp, analyzer_params) for fp in file_paths]
    
    # Process in parallel
    with ProcessPoolExecutor(max_workers=num_workers) as executor:
        # Submit all tasks
        future_to_path = {executor.submit(analyze_single_track, args): args[0] 
                         for args in args_list}
        
        # Process completed tasks
        for i, future in enumerate(as_completed(future_to_path), 1):
            file_path = future_to_path[future]
            
            try:
                result = future.result()
                results.append(result)
                
                # Progress tracking
                if i % 100 == 0 or i == len(file_paths):
                    elapsed = time.time() - start_time
                    rate = i / elapsed
                    eta = (len(file_paths) - i) / rate if rate > 0 else 0
                    
                    print(f"✅ Progress: {i:4d}/{len(file_paths)} "
                          f"({i/len(file_paths)*100:.1f}%) | "
                          f"Rate: {rate:.1f} tracks/sec | "
                          f"ETA: {eta/60:.1f}m")
                
            except Exception as e:
                failed_files.append({'file_path': str(file_path), 'error': str(e)})
                print(f"❌ Failed: {Path(file_path).name} - {e}")
    
    # Save results
    total_time = time.time() - start_time
    
    if results:
        df = pd.DataFrame(results)
        df.to_csv(output_csv, index=False)
        
        # Generate summary statistics
        successful_tracks = len([r for r in results if r.get('musical_key') != 'Unknown'])
        avg_processing_time = df['processing_time'].mean()
        
        print("\n" + "=" * 60)
        print("🎯 STREAMLINED KEY ANALYSIS COMPLETE")
        print("=" * 60)
        print(f"📊 Total tracks processed: {len(results)}")
        print(f"✅ Successful key detections: {successful_tracks} ({successful_tracks/len(results)*100:.1f}%)")
        print(f"❌ Failed analyses: {len(failed_files)}")
        print(f"⏱️  Total processing time: {total_time/60:.1f} minutes")
        print(f"🚀 Average per track: {avg_processing_time:.2f} seconds")
        print(f"💾 Results saved to: {output_csv}")
        
        # Show key distribution
        if successful_tracks > 0:
            key_counts = df[df['musical_key'] != 'Unknown']['camelot'].value_counts().head(10)
            print(f"\n🎼 Top Camelot keys detected:")
            for camelot, count in key_counts.items():
                print(f"   {camelot}: {count} tracks")
    
    return df if results else None


def main():
    parser = argparse.ArgumentParser(description='Streamlined Audio Key Detection')
    parser.add_argument('input_directory', help='Directory containing audio files')
    parser.add_argument('--output', '-o', default='streamlined_analysis.csv', 
                       help='Output CSV file (default: streamlined_analysis.csv)')
    parser.add_argument('--workers', '-w', type=int, default=8,
                       help='Number of parallel workers (default: 8)')
    parser.add_argument('--sample-rate', '-sr', type=int, default=22050,
                       help='Audio sample rate (default: 22050)')
    parser.add_argument('--duration', '-d', type=int, default=60,
                       help='Seconds to analyze per track (default: 60)')
    parser.add_argument('--extensions', nargs='+', 
                       default=['.mp3', '.wav', '.m4a', '.flac', '.ogg'],
                       help='Audio file extensions to process')
    
    args = parser.parse_args()
    
    # Find all audio files
    input_path = Path(args.input_directory)
    if not input_path.exists():
        print(f"❌ Error: Directory {input_path} does not exist")
        return
    
    audio_files = []
    for ext in args.extensions:
        audio_files.extend(input_path.rglob(f'*{ext}'))
    
    if not audio_files:
        print(f"❌ No audio files found in {input_path} with extensions {args.extensions}")
        return
    
    # Process files
    df = process_audio_batch_parallel(
        file_paths=audio_files,
        output_csv=args.output,
        num_workers=args.workers,
        sample_rate=args.sample_rate,
        duration=args.duration
    )


if __name__ == "__main__":
    main()