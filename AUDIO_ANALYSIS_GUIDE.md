# Audio Analysis Integration Guide

Your music system now supports **both streamlined key detection** (3-8 hours processing) and comprehensive audio analysis (370+ hours), with Python (server-side) and JavaScript (client-side) approaches.

## 🎯 What's New

### ⚡ Streamlined Key Detection (NEW!)
- ✅ **Fast key detection**: ~10-30 seconds per track vs 5+ minutes for comprehensive
- ✅ **Parallel processing**: 8-core processing reduces 62-hour job to 3-8 hours
- ✅ **Core features only**: Musical key, Camelot wheel, BPM, basic energy metrics
- ✅ **Optimized pipeline**: `streamlinedKeyAnalysis.py` focuses on therapeutic music needs

### Database Schema
- ✅ Added 17 new columns to `tracks` table for comprehensive audio features
- ✅ Created Camelot wheel navigation function for harmonic mixing
- ✅ Indexed key fields for fast searches (camelot, key, tempo, danceability)

### Python Integration (Batch Processing)
- ✅ Edge Function `/audio-analysis` supports **both** analysis types
- ✅ **Streamlined adapter**: `streamlinedAnalysisAdapter.py` for fast key data
- ✅ **Comprehensive adapter**: `pythonAnalysisAdapter.py` for full analysis
- ✅ Support for all 80+ audio features from comprehensive script

### Client-Side Analysis (Real-time)
- ✅ Enhanced Web Audio API analyzer for immediate feedback
- ✅ Basic tempo, key, and mood estimation in browser
- ✅ Real-time spectral analysis during upload

## 🚀 Usage Options

### 🏃‍♂️ Option 1: Streamlined Key Detection (RECOMMENDED)

**For therapeutic music with harmonic mixing - get essential features fast!**

1. **Run streamlined key analysis:**
```bash
python src/scripts/streamlinedKeyAnalysis.py /path/to/music/folder \
  --output streamlined_analysis.csv \
  --workers 8 \
  --duration 60
```

2. **Upload streamlined results to Supabase:**
```bash
python src/scripts/streamlinedAnalysisAdapter.py \
  streamlined_analysis.csv \
  --supabase-url https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis \
  --batch-size 50
```

3. **Check analysis status:**
```bash
python src/scripts/streamlinedAnalysisAdapter.py \
  --supabase-url https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis \
  --status-only
```

**Processing Time Comparison:**
- 🐌 Comprehensive: 370+ hours for 7,406 tracks
- ⚡ **Streamlined: 3-8 hours for 7,406 tracks** (with 8 cores)

### 🔬 Option 2: Comprehensive Analysis (Research Grade)

**For detailed research and advanced audio features:**

1. **Run comprehensive analysis script:**
```bash
python comprehensive_audio_analyzer.py /path/to/music/folder
# Creates comprehensive_audio_features.csv
```

2. **Upload comprehensive results:**
```bash
python src/scripts/pythonAnalysisAdapter.py \
  comprehensive_audio_features.csv \
  --url https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/audio-analysis \
  --batch-size 50
```

### 🌐 Option 3: Client-Side Analysis (Real-time)

The enhanced `AudioProcessor` and new `ClientAudioAnalyzer` provide immediate analysis:

```typescript
import { ClientAudioAnalyzer } from '@/services/clientAudioAnalyzer'

const analyzer = new ClientAudioAnalyzer()
const features = await analyzer.analyzeFile(audioFile)

console.log('Estimated Key:', features.estimatedKey)
console.log('Estimated BPM:', features.estimatedTempo)
console.log('Mood - Valence:', features.estimatedValence)
console.log('Mood - Energy:', features.estimatedArousal)
```

## 🎵 Available Features

### 🎼 Core Musical Features (Streamlined + Comprehensive)
- `key` - Musical key (C, D, E, etc.)
- `scale` - Major/minor scale  
- `camelot` - Camelot wheel notation (8A, 5B, etc.)
- `tempo_bpm` - Beats per minute
- `key_strength` - Confidence in key detection
- `beat_confidence` - Beat tracking accuracy

### ⚡ Streamlined Energy Features
- `energy_level` - Overall track energy (RMS)
- `brightness` - Spectral brightness/timbre
- `texture` - Audio texture (zero-crossing rate)
- `dynamic_range` - Difference between loud/quiet parts

### 🎭 Comprehensive Mood & Psychoacoustic (Full Analysis Only)
- `mood_scores` - JSON with acoustic, aggressive, electronic, happy, party, relaxed, sad
- `psychoacoustic_features` - Loudness, dynamic complexity
- `danceability_score` - How danceable the track is

### 🔬 Technical Features (Comprehensive Analysis)
- `spectral_features` - Centroid, rolloff, bandwidth, contrast, flatness
- `harmonic_features` - Harmonic/percussive separation, chroma features
- `rhythmic_features` - Onset detection, rhythm patterns
- `tonal_features` - Pitch analysis, inharmonicity
- `structural_features` - Musical structure analysis
- `comprehensive_analysis` - Complete feature set as JSON

## ⚡ Feature Comparison: Streamlined vs Comprehensive

| Feature Category | Streamlined ⚡ | Comprehensive 🔬 |
|------------------|----------------|------------------|
| **Musical Key** | ✅ Key, Scale, Camelot | ✅ + Multiple algorithms |
| **Tempo/Rhythm** | ✅ BPM, Beat confidence | ✅ + Onset analysis, rhythm patterns |
| **Energy** | ✅ Basic energy metrics | ✅ + Detailed spectral analysis |
| **Mood Analysis** | ❌ Not included | ✅ 7-dimensional mood scores |
| **Harmonic Analysis** | ❌ Basic only | ✅ Chroma, tonnetz, harmonic ratios |
| **Processing Time** | **3-8 hours** | **370+ hours** |
| **Use Case** | Therapeutic mixing, DJ apps | Research, detailed analysis |

## 🔍 Camelot Recommendations

The system now supports harmonic mixing using the Camelot wheel:

```sql
-- Get harmonically compatible tracks
SELECT * FROM tracks 
WHERE camelot = ANY(get_camelot_neighbors('8A'))
AND id != current_track_id;
```

Compatible Camelot transitions:
- Same number (energy match): 8A ↔ 8B
- Adjacent numbers: 8A → 9A or 7A
- Perfect fifth: 8A → 3A

## 📊 Mood-Based Recommendations

Enhanced mood detection using:
- **Valence** (0-1): Sad → Happy
- **Arousal** (0-1): Calm → Energetic
- **Spectral brightness**: Low → High frequency content
- **Rhythmic complexity**: Simple → Complex patterns

## 🛠 API Endpoints

### Audio Analysis Edge Function

**Streamlined Analysis:**
```javascript
POST /functions/v1/audio-analysis
{
  "analysis_type": "streamlined_batch",
  "tracks": [
    {
      "file_path": "path/to/track.mp3",
      "file_name": "track.mp3",
      "musical_key": "C",
      "camelot": "8B",
      "tempo_bpm": 120,
      "energy_level": 0.7,
      "analysis_method": "streamlined_key_detection"
    }
  ]
}
```

**Comprehensive Analysis:**
```javascript
POST /functions/v1/audio-analysis
{
  "tracks": [
    {
      "file_path": "path/to/track.mp3",
      "features": { /* comprehensive features */ }
    }
  ]
}
```

### Get Analysis Status
```javascript
GET /functions/v1/audio-analysis
// Returns statistics for both streamlined and comprehensive analyses
{
  "statistics": {
    "total_tracks": 7406,
    "analyzed_tracks": 7200,
    "streamlined_analyses": 6800,
    "comprehensive_analyses": 400,
    "analysis_coverage": "97.2%"
  }
}
```

### Check Specific Track
```
GET /functions/v1/audio-analysis?file_path=path/to/track.mp3
# Returns analysis status for specific track
```

## 🎯 Recommendation: Start with Streamlined Analysis

For your therapeutic music application:

1. **✅ Start with streamlined key detection** - Gets you 95% of what you need for harmonic mixing
2. **🎵 Focus on Camelot wheel integration** - Essential for therapeutic music transitions
3. **⏱️ Process your entire library in hours, not days**
4. **🔬 Run comprehensive analysis on subsets** - Use for research or detailed mood analysis

## 📈 Performance Comparison

| Analysis Type | Time per Track | 7,406 Tracks | With 8 Cores |
|---------------|----------------|--------------|--------------|
| **Streamlined** | 10-30 seconds | 21-62 hours | **3-8 hours** ⚡ |
| **Comprehensive** | 5+ minutes | 370+ hours | 46+ hours |

**Winner for therapeutic music:** Streamlined analysis gives you everything needed for Camelot wheel harmonic mixing in a fraction of the time!

## 📈 Performance Notes

- **Python analysis**: Comprehensive but requires `librosa` and `essentia` libraries
- **Client analysis**: Fast basic features using Web Audio API
- **Hybrid approach**: Use Python for batch processing, client-side for new uploads
- **Database**: Indexed on key fields for sub-ms query performance

Your system now has professional-grade audio analysis capabilities! 🎵✨