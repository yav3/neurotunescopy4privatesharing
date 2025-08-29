import { Router } from 'express';
import { Readable } from 'node:stream';
import { getTrackById, patchTrackStoragePath } from '../stores/tracksStore';
import { resolveStorageKey, getPublicOrSignedUrl } from '../services/storageResolver';

const r = Router();

/**
 * Accepts both:
 *   /api/stream/12345           (numeric id)
 *   /api/stream/path/<anything> (encoded path/title)
 *   /api/stream/<anything>      (fallback path/title)
 */
r.get(['/:idOrPath', '/path/*'], async (req, res, next) => {
  try {
    // 1) Figure out candidate label from request
    let candidate = '';
    if (req.params.idOrPath && /^\d+$/.test(req.params.idOrPath)) {
      const track = await getTrackById(Number(req.params.idOrPath));
      if (!track) return res.status(404).json({ error: 'Track not found' });
      candidate = String(track.storage_path || track.file_path || track.title);
    } else if (req.params[0]) {
      candidate = decodeURIComponent(req.params[0]); // /path/<encoded>
    } else {
      candidate = decodeURIComponent(req.params.idOrPath ?? '');
    }
    if (!candidate) return res.status(400).json({ error: 'No candidate provided' });

    // 2) Resolve candidate to a Supabase storage key
    const { key, score } = await resolveStorageKey(candidate);
    if (!key) return res.status(404).json({ error: 'No storage match', score });

    // 3) Turn key into a fetchable URL (public or signed)
    const url = await getPublicOrSignedUrl(key, 3600);

    // Optional: patch DB for future direct hits if score is confident
    if (score >= 0.75 && req.params.idOrPath && /^\d+$/.test(req.params.idOrPath)) {
      patchTrackStoragePath(Number(req.params.idOrPath), key).catch(() => {});
    }

    // 4) Proxy bytes with Range passthrough
    const headers: Record<string, string> = {};
    const range = req.headers.range;
    if (range) headers['Range'] = String(range);

    const upstream = await fetch(url, { headers });
    // copy relevant headers
    const copy = ['accept-ranges','content-range','content-length','content-type','cache-control','etag','last-modified'];
    res.status(upstream.status);
    for (const k of copy) {
      const v = upstream.headers.get(k);
      if (v) res.setHeader(k, v);
    }
    // enforce correct type for audio
    if (!res.getHeader('content-type')) res.setHeader('content-type', 'audio/mpeg');

    const body = upstream.body as any;
    if (!body) return res.status(502).end();

    Readable.fromWeb(body).pipe(res);
  } catch (e) {
    next(e);
  }
});

export default r;