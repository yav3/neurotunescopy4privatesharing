# Storage Path Repair Scripts

This directory contains scripts to repair storage paths for music tracks in the database.

## NEW: Production Storage Key Repair Script

**`repairStorageKeysAndFlagDuplicates.ts`** - Advanced repair script that:

1. **Fixes malformed storage keys** (missing dots before extensions like `.mp3`, `.wav`, `.m4a`, `.flac`)
2. **Updates database** to keep `music_tracks` table in sync with storage
3. **Flags duplicates** without deleting anything (sets `upload_status='duplicate'`)
4. **Supports dry-run mode** (safe by default)
5. **Generates CSV reports** for audit trails

### Quick Start

1. **Install dependencies:**
   ```bash
   npm i -D tsx @supabase/supabase-js
   ```

2. **Set environment variables:**
   ```bash
   export SUPABASE_URL="https://pbtgvcjniayedqlajjzz.supabase.co"
   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
   ```

3. **Dry run (safe - no changes):**
   ```bash
   npx tsx scripts/repairStorageKeysAndFlagDuplicates.ts \
     --bucket neuralpositivemusic \
     --table music_tracks \
     --csv out/repair_report.csv
   ```

4. **Review the CSV report, then commit changes:**
   ```bash
   npx tsx scripts/repairStorageKeysAndFlagDuplicates.ts \
     --bucket neuralpositivemusic \
     --table music_tracks \
     --commit \
     --csv out/repair_final.csv
   ```

### What It Does

- **🔧 Repairs malformed keys**: `filenamemp3` → `filename.mp3`
- **📊 Updates database**: Syncs `storage_key`, `file_path`, `upload_status`
- **🔍 Finds duplicates**: Groups by normalized basename, flags extras
- **📝 Detailed reporting**: CSV with all actions taken
- **⚡ Atomic moves**: Uses Supabase storage move operation

### Options

```bash
--bucket=neuralpositivemusic   # Storage bucket name
--table=music_tracks          # Database table name
--exts=mp3,wav,m4a,flac      # File extensions to repair
--commit                      # Apply changes (dry-run by default)
--csv=path/to/report.csv     # Generate CSV report
--max-files=1000             # Limit for testing
```

### Safety Features

- **Dry-run by default** - No changes without `--commit`
- **Atomic storage moves** - No data loss during repairs
- **Duplicate flagging** - Never deletes, just marks as `upload_status='duplicate'`
- **Detailed logging** - See exactly what's happening
- **CSV audit trail** - Review all changes made

---

## Legacy: Original Repair Script

**`repair-storage-paths.ts`** - Fuzzy matching repair script (still available):

### Usage

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

## Database Schema

Both scripts work with the `music_tracks` table:
- `id` (uuid, primary key)
- `storage_key` (text)
- `file_path` (text)
- `bucket_name` (text)
- `upload_status` (text)
- `title` (text)
- `original_title` (text)

## Helpful SQL Queries

### Preview duplicate basenames
```sql
with norm as (
  select
    id,
    lower(regexp_replace(
      split_part(storage_key, '/', cardinality(string_to_array(storage_key, '/'))),
      '[^a-z0-9._-]','','g'
    )) as base
  from music_tracks
  where storage_key is not null
)
select base, count(*) as dupes
from norm
group by base
having count(*) > 1
order by dupes desc;
```

### Create helpful indexes
```sql
create index if not exists idx_music_tracks_storage_key on music_tracks (storage_key);
create index if not exists idx_music_tracks_upload_status on music_tracks (upload_status);
```

### Check repair status
```sql
select 
  upload_status,
  count(*) as count,
  count(*) filter (where storage_key is not null) as with_storage_key
from music_tracks 
group by upload_status;
```