# Audio Streaming Architecture Simplification

## Current Problems
- 7,399 tracks marked "unknown" → only 7 tracks available for playlists
- Multiple storage buckets create complexity
- Complex validation states (working/missing/unknown) get out of sync
- Async auditing processes can fail silently
- Database status doesn't match actual file availability

## Quick Fix (Implemented)
- Bulk mark "unknown" tracks as "working" via Profile page
- This gives playlists access to all 7,399 tracks immediately

## Long-term Architectural Simplification

### Current Architecture (Complex)
```
Request Track → Check DB Status → Validate Storage → Stream File
                     ↓
            Complex state management
            (working/missing/unknown)
```

### Proposed Architecture (Simple)
```
Request Track → Try to Stream → Success ✓ | Failure → Next Track
```

### Implementation Plan

#### Phase 1: Stateless Streaming
1. **Remove status checking** from playlist generation
2. **Try-catch streaming** - attempt to stream each track
3. **Graceful fallback** - if stream fails, try next track
4. **Simple logging** - log failures but don't update database

#### Phase 2: Unified Storage
1. **Single bucket** - consolidate all audio to one bucket
2. **Remove bucket-switching logic** from API
3. **Standardize paths** - consistent naming convention

#### Phase 3: Real-time Validation
1. **On-demand validation** - validate only when streaming
2. **Remove pre-validation** - no more bulk auditing
3. **Client-side retry** - if stream fails, client requests next track

### Benefits of Simplified Architecture
- **Reliability**: Fewer moving parts = fewer failure points
- **Performance**: No pre-validation overhead
- **Maintainability**: Less code to debug and maintain
- **Scalability**: Stateless design scales better
- **User Experience**: Faster playlist loading, automatic fallbacks

### Migration Strategy
1. Use bulk fixer to unblock current users
2. Implement stateless streaming alongside current system
3. Gradually migrate endpoints to new approach
4. Remove old validation system once proven stable

### Code Changes Required
- `src/services/audioProcessor.ts` - simplify to try-catch streaming
- `supabase/functions/api/index.ts` - remove status checks from playlist
- `src/stores/audioStore.ts` - add automatic retry logic
- Remove complex validation components

## Philosophy
**"Make it work first, then make it elegant"**

The current system prioritizes sophistication over reliability. For a therapeutic music app, users need tracks to play consistently. A simple "try to play, if it fails try next" approach is more robust than complex pre-validation that can break.

## Next Steps
1. ✅ Implement bulk fixer (done)
2. 🔄 Test bulk fixer with real data
3. ⏳ Design stateless streaming API
4. ⏳ Implement client-side retry logic
5. ⏳ Migrate to single storage bucket