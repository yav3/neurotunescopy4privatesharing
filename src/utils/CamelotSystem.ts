// src/utils/CamelotSystem.ts
// Simple, non-recursive, no-conditional-generic Camelot helpers

export type Camelot = `${1|2|3|4|5|6|7|8|9|10|11|12}${'A'|'B'}`;

type KeyAlias = Record<string, Camelot>;

// Normalizes musical key strings like:
// "C", "C major", "Cmaj", "C Major", "Am", "A minor", "Amin", "A Minor", "C# minor", "Db major", etc.
export function normalizeKeyName(input: string): string {
  const s = input.trim().toLowerCase();
  // unify whitespace and symbols
  let k = s
    .replace(/\s+/g, ' ')
    .replace(/[-_]/g, ' ')
    .replace(/maj(or)?/g, 'major')
    .replace(/min(or)?|m(?!aj)/g, 'minor') // 'm' → minor, but not 'maj'
    .replace(/^\s+|\s+$/g, '');

  // common compact forms
  k = k
    .replace(/^([a-g])b\b/, (_, p1) => `${p1}♭`)  // infer flat symbol
    .replace(/^([a-g])#\b/, (_, p1) => `${p1}♯`);

  // canonical token order: NOTE + (major|minor), default major if none
  // tokens might be ['c','minor'] or ['a','minor'] etc.
  const tokens = k.split(' ');
  let note = tokens[0] || '';
  let qual = (tokens[1] || '').toLowerCase();

  // fallback: if 'minor' or 'major' absent but original had trailing 'm'
  if (!qual && /(^|\s)[a-g][#b♯♭]?m(\s|$)/.test(s)) qual = 'minor';
  if (!qual && /(^|\s)[a-g][#b♯♭]?(\s|$)/.test(s))  qual = 'major';

  // normalize accidentals to ♯ / ♭ and canonical enharmonics for the map
  note = note
    .replace(/#/g, '♯')
    .replace(/b/g, '♭');

  // map enharmonics to one canonical spelling set
  const enh: Record<string,string> = {
    'db': 'c♯','d♭':'c♯', 'eb':'d♯','e♭':'d♯', 'gb':'f♯','g♭':'f♯',
    'ab': 'g♯','a♭':'g♯', 'bb':'a♯','b♭':'a♯',
  };
  const raw = (note || '').replace('♭','b').replace('♯','#');
  const base = enh[raw] ?? raw;

  return `${base} ${qual || 'major'}`.trim();
}

// Canonical mapping (aliases → Camelot). Include common enharmonics & spellings.
const KEY_TO_CAMELOT: KeyAlias = {
  // Major (B)
  'c major':'8B','g major':'9B','d major':'10B','a major':'11B','e major':'12B','b major':'1B',
  'f# major':'2B','c# major':'3B','g# major':'4B','d# major':'5B','a# major':'6B','f major':'7B',
  // Minor (A)
  'a minor':'8A','e minor':'9A','b minor':'10A','f# minor':'11A','c# minor':'12A','g# minor':'1A',
  'd# minor':'2A','a# minor':'3A','f minor':'4A','c minor':'5A','g minor':'6A','d minor':'7A',

  // Extra aliases (enharmonics)
  'db major':'3B','eb major':'5B','gb major':'2B','ab major':'4B','bb major':'6B',
  'bb minor':'3A','eb minor':'1A','ab minor':'11A',
};

export function toCamelot(musicalKey: string | null | undefined): Camelot | null {
  if (!musicalKey) return null;
  const norm = normalizeKeyName(musicalKey);
  return (KEY_TO_CAMELOT[norm] ?? null) as Camelot | null;
}

export function compatibleKeys(c: Camelot): Camelot[] {
  const n = parseInt(c, 10) as 1|2|3|4|5|6|7|8|9|10|11|12;
  const mode = c.endsWith('A') ? 'A' : 'B';
  const plus1 = ((n % 12) + 1) as 1|2|3|4|5|6|7|8|9|10|11|12;
  const minus1 = (((n + 10) % 12) + 1) as 1|2|3|4|5|6|7|8|9|10|11|12;
  const switchMode = `${n}${mode === 'A' ? 'B' : 'A'}` as Camelot;
  return [
    c,
    `${plus1}${mode}` as Camelot,
    `${minus1}${mode}` as Camelot,
    switchMode,
  ];
}

// Minimal track shape this module needs. (Extend your app's Track with this.)
export interface TrackLike {
  id: string;
  bpm_est?: number | null;
  musical_key_est?: string | null;
  camelot_key?: Camelot | null; // optional, computed if absent
}

/** Ensure a track has camelot_key (prefer existing; else compute from musical_key_est). */
export function ensureCamelot<T extends TrackLike>(t: T): T & { camelot_key: Camelot | null } {
  const ck = t.camelot_key ?? toCamelot(t.musical_key_est ?? null);
  return { ...t, camelot_key: ck };
}

/** Score compatibility between two Camelot keys (0..1). Same/switch/adjacent get higher scores. */
export function camelotCompatibility(a: Camelot | null, b: Camelot | null): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const comp = new Set(compatibleKeys(a));
  return comp.has(b) ? 0.8 : 0;
}