import { Router } from 'express';
import { getTrackById, patchTrackStoragePath } from '../stores/tracksStore'; // implement for your DB
import { resolveStorageKey, storageUrlFor, getSignedUrlFor } from '../services/storageResolver';

const r = Router();

/**
 * GET /api/stream/:trackId
 * - Looks up track
 * - Tries direct storage path; if 404 upstream, or path missing, resolves by fuzzy match
 * - 302 redirects to the (public or signed) storage URL
 */
r.get('/:trackId', async (req, res, next) => {
  try {
    const trackId = Number(req.params.trackId);
    const track = await getTrackById(trackId);
    if (!track) return res.status(404).json({ error: 'Track not found' });

    const candidate = track.storage_path || track.file_path || track.title;
    const { key, score } = await resolveStorageKey(String(candidate));
    if (!key) return res.status(404).json({ error: 'No storage match', score });

    const url = process.env.PUBLIC_BUCKET === 'true'
      ? storageUrlFor(key)
      : await getSignedUrlFor(key, 3600);

    // Optional: patch DB for future direct hits if score is confident
    if (score >= 0.75) {
      patchTrackStoragePath(trackId, key).catch(() => {});
    }

    // Redirect the client to the actual file
    return res.redirect(302, url);
  } catch (e) {
    next(e);
  }
});

export default r;