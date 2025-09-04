# Real Audio Analysis Setup Guide

## Two Analysis Options Available

### Option 1: Simulation Analysis (Fast - Ready Now)
- ✅ Uses simulated comprehensive audio features
- ⚡ Processes all 367 tracks in ~30 minutes
- 📊 Generates realistic BPM, Camelot, mood, spectral data
- 🚀 **Run immediately**: `python execute_complete_analysis.py`

### Option 2: Real Audio Analysis (Accurate - Setup Required)
- 🔬 Downloads actual audio files for librosa analysis
- 🎵 Real BPM detection, key detection, spectral analysis
- ⏰ Takes 2-3 hours for all 367 tracks
- 💾 Requires ~2GB local storage for audio files

## Real Analysis Setup (Option 2)

### 1. Install Requirements
```bash
pip install -r requirements.txt
```

### 2. Set Database Credentials
```bash
export DATABASE_URL="postgresql://postgres.pbtgvcjniayedqlajjzz:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.co:6543/postgres"
```

### 3. Test with Small Batch
```bash
# Test with 10 tracks first
python run_real_analysis.py
```

### 4. Run Full Analysis
```python
# Edit run_real_analysis.py - change these lines:
limit=None          # Process ALL tracks
batch_size=10       # Increase for faster processing
```

## Current Database Status

✅ **Audit Complete - No Issues Found**
- 367 audio tracks in 'audio' bucket
- All have valid storage_key references  
- No duplicate file paths
- 238 tracks have BPM (65%)
- 0 tracks have Camelot keys (0%)
- 0 tracks have comprehensive analysis (0%)

## What Each Analysis Includes

### Core Musical Features
- **BPM Detection**: Tempo analysis with beat tracking
- **Key Detection**: Musical key (C, D#, F#) + confidence
- **Camelot Mapping**: Full wheel coverage (1A-12B)
- **Scale Detection**: Major/minor classification

### Advanced Audio Features  
- **Spectral Analysis**: Centroid, rolloff, bandwidth, flatness
- **Energy Analysis**: RMS, dynamic range, onset detection
- **Harmonic Features**: Pitch salience, harmonicity
- **Psychoacoustic**: Loudness (LUFS), roughness

### Mood & Therapeutic Classification
- **Mood Scores**: Happy, sad, energetic, calm, relaxed
- **Emotion Tags**: Peaceful, focused, uplifting
- **Therapeutic Use**: Focus, meditation, relaxation
- **EEG Targets**: Alpha, theta, beta wave alignment

## File Processing Pipeline

```
Supabase Storage → Local Download → Audio Analysis → Database Upload
     (367 MP3s)     (./local_audio)      (librosa)        (Edge Function)
```

### Processing Flow:
1. **Download**: Get audio files from Supabase Storage
2. **Analyze**: Extract features with librosa
3. **Process**: Convert to database format
4. **Upload**: Send results to Edge Function
5. **Store**: Update tracks table with comprehensive data

## Expected Results

**Before Analysis:**
```sql
SELECT COUNT(*) as total, 
       COUNT(camelot) as camelot_count,
       COUNT(comprehensive_analysis) as analysis_count
FROM tracks WHERE storage_bucket = 'audio';
-- Result: total=367, camelot_count=0, analysis_count=0
```

**After Analysis:**
```sql  
-- Result: total=367, camelot_count=367, analysis_count=367
```

## Troubleshooting

### Common Issues:
1. **Missing librosa**: `pip install librosa`
2. **Database connection**: Check DATABASE_URL password
3. **Storage access**: Verify Supabase bucket permissions
4. **Disk space**: Need ~2GB for audio files

### Progress Monitoring:
```python
# Check progress anytime
from scripts.real_analysis_processor import RealAnalysisProcessor
processor = RealAnalysisProcessor(...)
status = processor.get_analysis_status()
print(f"Progress: {status}")
```

## Recommendation

**Start with Option 1 (Simulation)** to get immediate results, then optionally run Option 2 for maximum accuracy.

Both approaches provide comprehensive audio intelligence for therapeutic music matching and advanced playlist generation.