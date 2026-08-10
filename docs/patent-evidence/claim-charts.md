# Claim Charts — Element-by-Element Evidence Mapping

Companion to [`README.md`](./README.md). Each chart decomposes a patent claim (or, where the
issued claim text was unavailable, its inventive concept) into discrete elements and maps each to
concrete artifacts in this repository.

Verdict legend: **●** reduced to practice here · **◐** partially evidenced ·
**○** integrated but implemented externally · **—** not present.

> **Method note.** Claim-element language for '263 and '165 is taken from the *GRN Patent EOU
> Analysis Briefing* and the continuation drafts; the '786 granted claim text was **not** in the
> reviewed Drive documents, so its chart is at the inventive-concept level. Confirm all claim
> language against the issued patents on USPTO Patent Center.

---

## Chart A — US 11,694,786 ('786), inventive concept

*Recommend media by emotional impact; determine & deliver "optimal medical media" for treating
brain functions / neurological conditions.*

| # | Concept element | Verdict | Evidence (file / table) |
|---|---|:---:|---|
| A1 | Compute an **emotional-impact characterization** of a piece of audio | ● | `scripts/real_audio_analyzer.py:121-165` (valence/arousal/dominance/tense); `src/services/clientAudioAnalyzer.ts:314-338` |
| A2 | Store a **reproducible affective signature** per work | ● | `tracks.valence/arousal/dominance/emotion_tags/mood_scores/eif_*`; `track_temporal_arcs` (time-resolved) |
| A3 | Represent **emotional impact** as a scored quantity (EIF) | ● | `tracks.eif_valence/eif_arousal/eif_total/eif_patient` (`types.ts:5842+`) |
| A4 | **Recommend** media to a user based on that emotional impact | ● | `supabase/functions/api/index.ts` `getTherapeuticTracksVAD`; `src/services/enhancedTrackSelection.ts` |
| A5 | Determine **"optimal medical media"** for a target brain function / condition | ● | `src/config/therapeuticGoals.ts`; `therapeutic_applications` (per-condition evidence scores, frequency bands, cortisol/EEG/HRV alignment) |
| A6 | **Deliver** the selected media to the user | ● | `src/stores/audioStore.ts` (`loadTrack`, `next`); `supabase/functions/api` `/stream/{id}` |
| A7 | Associate media with **neurological conditions** (anxiety, depression, PTSD, pain, sleep, focus) | ● | `src/utils/constants.ts` `THERAPEUTIC_CONDITIONS`; `therapeutic_applications.condition_targets` |
| A8 | **Measure outcome** / close the loop | ● | `listening_sessions`, `music_therapy_sessions` (pre/post mood, outcomes); `therapeuticUseCases.ts` (GAD-7/PHQ-9/PSQI) |

**Verdict: ● Strong** — the '786 inventive concept is implemented end-to-end in this repository.

---

## Chart B — App. 18/315,457, Claim 10 (OMM), pending

*"selecting a plurality of STEMs … each STEM is a digital audio file; producing the OMM by
remixing the plurality of STEMs; treating … by causing the identified OMM to be played."*

| # | Claim-10 limitation | Verdict | Evidence / note |
|---|---|:---:|---|
| B1 | selecting **a plurality of STEMs**, each a **digital audio file** | ● | `therapeuticEngine.createSession`, `SimpleStorageService.getTracksFromBuckets` (selects a set of audio files) |
| B2 | selecting for a **target brain function** | ● | `src/config/therapeuticGoals.ts` (goal→vadProfile/bpmRange/buckets); `therapeutic_applications` |
| B3 | producing the OMM **by remixing** the plurality of STEMs | ◐/— | **Not performed.** The product sequences and plays whole tracks; it does **not** remix stems into a new composite work. |
| B4 | **treating** by **causing the OMM to be played** | ● | `src/stores/audioStore.ts` playback pipeline; session logged to `listening_sessions` |

**Verdict: ◐ Partial** — selection + delivery reduced to practice; the **remixing** limitation is
absent. Do not represent stem-remixing as practiced by this product.

---

## Chart C — US 12,361,263 ('263), independent claim 1 (GRN Utilizing)

Elements from the EOU briefing decomposition.

| # | Claim-1 element | Verdict | Note |
|---|---|:---:|---|
| 1a | Apply a **GRN** to model relationships between entities | ○ | GRN engine external; footprint = `grn_pipeline_runs/steps` tables only |
| 1b | GRN includes **dominance-factor nodes** (change intensity × frequency) | — | No dominance-factor code in this repo |
| 1c | GRN includes **evolution-of-internal-component nodes** | — | Not present |
| 1d | entities **are neurotransmitters** | — | Product models tracks/goals, not neurotransmitters |
| 1e-1h | simulate → eliminate → test → **identify a target interaction** | ○ analogue | `enhancedTrackSelection.createOptimalSpacing` simulates/eliminates *track* candidates — an architectural analogue, not the claim |
| 1i | **treat a patient by stimulating the patient** | — | Product does not stimulate patients |

**Verdict: — Not practiced here** (hard neurotransmitter + patient-treatment limitations).
Integration footprint only.

---

## Chart D — US 12,651,165 ('165), training claim (GRN Training)

| # | Claim element | Verdict | Note |
|---|---|:---:|---|
| 2a | Apply a **SOM** to training data → lower-dimensionality visualization | — | No SOM/MiniSom in this repo |
| 2b | SOM transforms relationships between data items | — | Not present |
| 2c | **Train** a plurality of ML models of a GRN on the visualization | ○ | Training happens in the external GRN codebase; `grn_ingestion_log`/`grn_pipeline_runs` are its data footprint here |
| 2d | GRN includes **dominance-factor nodes** (D(t)=α·I(t)+β·F(t)) | — | Not present |
| 2e | GRN includes **evolution-of-internal-component nodes** (E(t)=E(t−1)+γ·C(t)) | — | Not present |
| 2f-2g | interpolate / retrain / error-adjust | — | Not present |

**Verdict: — Not practiced here.** Feature extraction (`scripts/*.py`) is upstream of, and
distinct from, GRN training. The '165 method is reduced to practice in the separate ML codebase.

---

## Chart E — 4-D Affective "VADE Glome" (drafted, unfiled)

| # | Draft claim-1 element | Verdict | Note |
|---|---|:---:|---|
| E1 | receive **multi-modal input** (acoustic/behavioral/biometric/EHR) | ◐ | Repo ingests **acoustic** features only; no biometric/EHR ingestion here |
| E2 | compute `P_VADE = W_proxy · X + b` (affine transform to 4-D) | — | Repo uses direct 3-axis VAD estimation, not the affine 4-D transform |
| E3 | map to a coordinate on a **three-sphere (S³)** | — | Not present |
| E4 | compute **geodesic distance** to a target coordinate | — | Repo uses Euclidean/threshold VAD distance (`therapeuticFiltering.getTherapeuticScore`) |
| E5 | drive affective state toward target via dosed media | ◐ | Goal-directed session progression exists (`ENERGY_PROGRESSIONS`), but not the S³/Fibonacci dosing math |

**Verdict: — / ◐** — the *intent* (drive affective state via selected media) is present as a
simpler 3-axis heuristic; the claimed S³ / Pauli / Fibonacci mathematics is **not** implemented
in this repository.

---

## Summary

| Patent / application | Status | RTP verdict in this repo |
|---|---|:---:|
| US 11,694,786 ('786) | Granted | ● Strong |
| App. 18/315,457 (OMM) | Pending | ◐ Partial (select+deliver ●; remix —) |
| US 12,361,263 ('263) | Granted | — (○ integration only) |
| US 12,651,165 ('165) | Granted | — (○ integration only) |
| 4-D Affective (VADE) | Drafted | — / ◐ analogue |
| STEM / royalty / provenance | Drafted | — |

See [`README.md §8`](./README.md#8-important-disclaimers) for disclaimers.
