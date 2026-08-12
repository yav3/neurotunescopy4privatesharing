# Reduction-to-Practice Traceability Ledger

Companion to [`stateflows.md`](./stateflows.md). This ledger links each patent claim element to a
**runtime event** in the working system and the **observable artifact** it produces (a database
write, a function return, a log line, a rendered UI state). Observability is the point: an
independent reviewer can run the system, trigger the event, and see the artifact — the practical
demonstration of reduction to practice.

Verdict: **●** RTP here · **◐** partial · **○** external · **—** absent.

---

## Ledger A — US 11,694,786 ('786) affective recommendation

| # | Claim concept element | Runtime trigger | Observable artifact (proof) | Verdict |
|---|---|---|---|:--:|
| A1 | Characterize emotional impact of audio | Analyzer runs on a track | `tracks.valence/arousal/dominance` populated; `dominance = energy×brightness`, `tense = 1−calm` (`real_audio_analyzer.py:137-164`) | ● |
| A2 | Reproducible per-work signature | Re-run analyzer / read row | Same VAD + `mood_scores` JSONB persisted per `track_uuid` | ● |
| A3 | Score emotional impact (EIF) | EIF scoring pass | `tracks.eif_valence/eif_arousal/eif_total/eif_patient/eif_scored_at` set | ● |
| A4 | Emotional trajectory over time | Temporal analysis | `track_temporal_arcs` rows (`window_index`, `valence_raw`, `arousal_raw`, `eif_*`) via `get_track_temporal_arc` RPC | ● |
| A5 | Recommend by emotional impact | `GET /playlist?goal=…` | `getTherapeuticTracksVAD` returns tracks ranked by VAD+BPM distance to goal profile (`api/index.ts:175-277`) | ● |
| A6 | Determine "optimal medical media" for a condition | Goal/condition lookup | `therapeuticGoals.ts` vadProfile+buckets; `therapeutic_applications.{anxiety,…}_evidence_score`, `frequency_band_primary` | ● |
| A7 | Deliver the media | `loadTrack()` → play | Signed Storage URL resolved; `<audio>.src` set; `isPlaying=true` (`audioStore:920,1545`) | ● |
| A8 | Treat brain function / neurological condition | Session against a condition goal | `music_therapy_sessions` (`pre_session_mood`, `post_session_mood`, `outcomes`); condition set in `THERAPEUTIC_CONDITIONS` | ● |
| A9 | Close the loop / measure | `completeListeningSession()` | `listening_sessions` (`tracks_played`, `skip_rate`, `mood_progression`) written | ● |

---

## Ledger B — App. 18/315,457 claim 10 (OMM, pending)

| # | Claim-10 limitation | Runtime trigger | Observable artifact | Verdict |
|---|---|---|---|:--:|
| B1 | select a plurality of STEMs (digital audio files) | `createSession(goal)` | Ordered set of audio-file tracks returned (`therapeuticEngine.ts`, `SimpleStorageService`) | ● |
| B2 | for a target brain function | goal chosen | `therapeuticGoals.ts` goal → `vadProfile`/`bpmRange`/`musicBuckets` | ● |
| B3 | produce OMM **by remixing** STEMs | — | **No artifact** — no stem-mixing step exists; whole tracks are played | — |
| B4 | treat by causing OMM to be played | `play()` | `<audio>` playback + `listening_sessions` row | ● |

**Net:** B1/B2/B4 observable; B3 has **no** runtime artifact in this repo.

---

## Ledger C — GRN patents '263 / '165 (integration only)

| # | Claim element | Runtime trigger | Observable artifact | Verdict |
|---|---|---|---|:--:|
| C1 | Apply GRN to model entity relationships | External engine run | `grn_pipeline_runs` row (`engine_count`, `constraints_loaded`, `all_passed`) — **written by external engine** | ○ |
| C2 | Dominance-factor / evolution nodes; SOM training | — | **No artifact in this repo** (no SOM/dominance-factor code) | — |
| C3 | entities = neurotransmitters; treat patient by stimulation | — | **No artifact** — product models tracks/goals, does not stimulate patients | — |
| C4 | simulate → eliminate → identify target | `next()` track selection | `createOptimalSpacing` picks next track by simulate/eliminate over recent history — **architectural analogue only**, not the claim | ○ analogue |

---

## Ledger D — Drafted applications (4-D Affective, STEM, royalty, provenance)

| # | Draft element | Runtime trigger | Observable artifact | Verdict |
|---|---|---|---|:--:|
| D1 | Multi-modal ingestion (acoustic+biometric+EHR) | analyzer | Acoustic features only; **no** biometric/EHR ingestion | ◐ |
| D2 | `P_VADE = W·X + b` → S³ hypersphere, geodesic distance | goal scoring | `getTherapeuticScore` uses 3-axis VAD + BPM distance — **not** S³/Pauli math | — |
| D3 | Drive affective state toward a target via dosing | phased session | `ENERGY_PROGRESSIONS` per goal advance energy over phases (analogue, no Fibonacci/S³ constraints) | ◐ |
| D4 | STEM decomposition / micro-royalty / C2PA provenance | — | **No artifact** in this repo | — |

---

## How to reproduce (make the artifacts appear)

1. **A1–A4:** run any analyzer in `scripts/` on an audio file, then read the track row — VAD/EIF/arc columns populate.
2. **A5–A9:** `npm i && npm run dev`, pick a goal, play a session; observe the `/playlist` response, the `<audio>` playback, and the `listening_sessions` / `music_therapy_sessions` rows written on completion.
3. **C1:** inspect `grn_pipeline_runs` rows in the database (written by the external engine) — confirming integration, not local RTP.

---

## Summary of what the runtime proves

| Patent / app | Observable RTP in this repo |
|---|:--:|
| US 11,694,786 ('786) | ● end-to-end (measure → score → recommend → deliver → measure outcome) |
| App. 18/315,457 (OMM) | ◐ select + deliver observable; remix **—** |
| US 12,361,263 ('263) | ○ integration footprint only; clinical elements **—** |
| US 12,651,165 ('165) | ○ integration footprint only; SOM/training **—** |
| Drafted (VADE/STEM/royalty) | ◐ / **—** analogues only |

*Engineering evidence only — not a legal opinion. Confirm claim scope with patent counsel and all
patent metadata against the USPTO record. See [`README.md §8`](./README.md#8-important-disclaimers).*
