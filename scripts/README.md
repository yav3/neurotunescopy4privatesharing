# Storage Path Repair Script

This script repairs storage paths for music tracks in the database by using fuzzy matching to connect database records to actual files in Supabase storage.

## Usage

1. **Set up environment variable:**
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

2. **Run the repair script:**
   ```bash
   npm run repair-storage
   ```
   
   Or directly with tsx:
   ```bash
   npx tsx scripts/repair-storage-paths.ts
   ```

## What it does

1. **Fetches tracks** that need repair from the `music_tracks` table
2. **Builds storage index** by listing all audio files in the `neuralpositivemusic` bucket
3. **Uses fuzzy matching** to find the best storage key for each track:
   - Exact matches get 100% score
   - Fuzzy matches use Jaccard similarity + Dice coefficient
   - High confidence matches (≥75%) are automatically applied
   - Medium confidence matches (≥30%) are applied with warning
4. **Updates database** with resolved storage paths
5. **Reports results** with success/skip statistics

## Matching Algorithm

The script uses the same advanced matching algorithm as the edge functions:

- **Token-level matching**: Normalizes file names and uses Jaccard similarity
- **Character-level matching**: Uses Dice coefficient on character bigrams  
- **Weighted scoring**: 65% token similarity + 35% character similarity
- **Smart normalization**: Handles common variations like underscores, hyphens, etc.

## Output

```
🔧 Starting storage path repair...
Found 25 tracks to process
Processing: Focus Enhancement (c35390e7-efbc-49f2-8b31-577aa90f0a8a)
✅ [FIXED] c35390e7-efbc-49f2-8b31-577aa90f0a8a -> focus_enhancement.mp3 (89.2%)
Processing: Peaceful Meditation (c6ecaaf6-5f2b-441c-b2a1-e9f63885c3a7)  
✅ [FIXED] c6ecaaf6-5f2b-441c-b2a1-e9f63885c3a7 -> peaceful_meditation.mp3 (91.5%)
❌ [SKIP] 174b2ae6-b7ed-4dbc-8afb-4e2276be6380 - Best score: 23.1%

📊 Repair Complete!
✅ Fixed: 20
❌ Skipped: 5  
📝 Total: 25
🎯 Success Rate: 80.0%
```

## Safety Features

- **Read-only by default**: Only updates `file_path` column
- **Confidence thresholds**: Only applies high-confidence matches
- **Batch processing**: Small delays prevent database overload
- **Detailed logging**: Shows exactly what was changed and why
- **Rollback friendly**: Easy to revert changes if needed

## Environment Requirements

- Node.js 18+
- `tsx` for TypeScript execution
- `SUPABASE_SERVICE_ROLE_KEY` environment variable
- Access to the Supabase project storage bucket