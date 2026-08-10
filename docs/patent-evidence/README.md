# NeuroTunes — Patent Reduction-to-Practice Evidence Manifest

**Prepared for:** NeuralPositive / Neuropositive Tech, Inc. data room
**Subject:** Evidence, within this GitHub repository, of reduction to practice of the NeuralPositive patent portfolio
**Repository:** `neurotunescopy4privatesharing` (NeuroTunes product)
**Status of this document:** Engineering evidence map — **not** a legal opinion. See [§8 Disclaimers](#8-important-disclaimers).

---

## 1. What this repository is

This repository is the **NeuroTunes product**: a therapeutic-music streaming platform that
characterizes audio by its emotional/affective properties, maps listener goals and clinical
conditions to audio, assembles sequenced therapeutic sessions, delivers them, and records
outcomes.

| Layer | Technology | Location |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript, Zustand state | `src/` |
| Backend | Supabase — Postgres (~130 tables) + Deno edge functions + Storage | `supabase/`, schema typed in `src/integrations/supabase/types.ts` |
| Audio analysis | Python (librosa / Essentia) offline analyzers + edge/browser approximations | `scripts/*.py`, `src/scripts/*.py`, `supabase/functions/audio-analysis` |
| External services | Anthropic Claude (chat), Stripe (payments), Resend (email) | `supabase/functions/*` |

**Scope boundary (read this first).** This repository is the **product and its data/analysis
plane**. It is therefore the strongest available reduction-to-practice evidence for the
**affective-audio recommendation & delivery inventions** (the '786 family and its pending
"Optimal Medical Media" continuation). It is **not** the home of the core machine-learning
research code for the **Generative Relational Network (GRN)** patents ('165 / '263) or the
4-D "VADE Glome" mathematics — those live in separate Python/ML systems (this repo only
*integrates* with them; see [§5](#5-what-is-not-reduced-to-practice-in-this-repository)).
This boundary is stated explicitly so nothing here overstates what the code shows.

---

## 2. Portfolio at a glance

Source: *Neuropositive Patent Manifest* + companion spreadsheet + *GRN Patent EOU Analysis
Briefing* (Google Drive). Confirm all numbers/dates against the USPTO record before use.

| Family | Anchor patent | Status | Domain | This repo evidences it? |
|---|---|---|---|---|
| **'786 Audio & Affective** | **US 11,694,786 B1** — Recommendation Methods, Systems and Devices | Granted 2023-07-04 | Dual (media + medical) | **Yes — strong** ([§4.1](#41-us-11694786--786--affective-recommendation--optimal-medical-media)) |
| '786 continuation | **App. 18/315,457** — "Optimal Medical Media" (OMM), elected claim 10 | Pending (US, under exam) | Medical | **Partial** ([§4.2](#42-app-18315457--optimal-medical-media-continuation-pending)) |
| **GRN · Utilizing** | **US 12,361,263 B1** — AI Techniques Utilizing a GRN | Granted 2025-07-15 | Medical (neurotransmitters + patient treatment) | **No (integration only)** ([§5.1](#51-us-12361263--263--grn-utilizing)) |
| **GRN · Training** | **US 12,651,165 B2** — Techniques for Training a GRN | Granted 2026-06-09 | Non-medical (domain-agnostic) | **No (integration only)** ([§5.2](#52-us-12651165--165--grn-training)) |
| Drafted (unfiled) | 4-D Affective "VADE Glome"; STEM decomposition; micro-royalty; provenance | Drafted | Mixed | **No / weak analogue** ([§5.3](#53-drafted-unfiled-applications)) |

**Portfolio totals (from the manifest):** ~55 filings — 3 granted, 1 US pending (`18/315,457`),
2 PCT (`WO2026/087924`, `WO2026/087925`; national phase ~April 2027), remainder drafted or
identified. Four families: '786 Audio (26 items), GRN Training (14), GRN Utilizing (7),
Quantum (1), plus GRN-derived standalone new-matter (7).

**Chain of title (portfolio-wide):** Legal title to the GRN patents is held by the **Joan &
Irwin Jacobs Technion-Cornell Institute (JTCI)**; NeuralPositive holds an exclusive, worldwide,
perpetual, sub-licensable license (JTCI License Agreement, eff. 2018-08-13). '786 is currently
recorded to the **named inventors** (Van Wilt, Bahk). Confirm assignee-of-record recordation at
USPTO. Inventorship is **multi-inventor** across the portfolio — do not characterize any single
person as sole inventor (35 U.S.C. §256 risk).

---

## 3. Reduction-to-practice summary matrix

Verdict legend: **●  Reduced to practice here** · **◐ Partially evidenced** ·
**○ Integrated but implemented externally** · **— Not present**

| Inventive concept (from the patents) | Verdict | Primary code evidence in this repo |
|---|:---:|---|
| Emotional/affective **measurement** of audio (valence, arousal, dominance, tension/release) | ● | `scripts/real_audio_analyzer.py:137-164`; `tracks.valence/arousal/dominance`; `src/services/clientAudioAnalyzer.ts` |
| **Affective trajectory** over time | ● | `track_temporal_arcs` table + `get_track_temporal_arc` RPC |
| **Emotional Impact Factor (EIF)** scoring | ● | `tracks.eif_valence/eif_arousal/eif_total/eif_patient` (`types.ts:5842+`) |
| **Audio feature extraction** (key, tempo, spectral, dynamics) | ● | `scripts/*.py`, `supabase/functions/audio-analysis`, `src/utils/CamelotSystem.ts` |
| **Recommendation by emotional impact** / VAD-based ranking | ● | `supabase/functions/api/index.ts` `getTherapeuticTracksVAD`; `src/services/enhancedTrackSelection.ts` |
| **Goal / condition → audio** mapping ("optimal medical media" selection) | ● | `src/config/therapeuticGoals.ts`; `therapeutic_applications` table |
| **Sequenced therapeutic session** assembly & delivery | ● | `src/services/therapeuticEngine.ts`, `therapeuticUseCases.ts`, `src/stores/audioStore.ts` |
| **Frequency-band / brainwave entrainment** (δ θ α β γ, binaural) | ● | `supabase/functions/brainwave-stream/index.ts`; `spectral_analysis` band-power columns |
| **Closed-loop outcome** measurement (pre/post mood, clinical instruments) | ● | `listening_sessions`, `music_therapy_sessions`, `therapeuticUseCases.ts` (GAD-7/PHQ-9/PSQI) |
| **OMM by remixing STEMs** (claim-10 limitation) | ◐ | Selection + delivery present; **stem *remixing* is not performed** (whole tracks) |
| **GRN pipeline** (SOM → dominance-factor / evolution nodes; simulate→eliminate→identify) | ○ | `grn_pipeline_runs/steps/ingestion_log` tables only — algorithm runs **outside** this repo |
| **Neuro-clinical treatment** by neurotransmitter modeling + patient stimulation ('263) | — | Not present (product does not stimulate patients) |
| **SOM/GRN training** with D/C/E node math ('165) | — | Not present (no SOM/MiniSom or dominance-factor code in this repo) |
| **4-D VADE Glome** S³ geodesic / Pauli / Fibonacci-dosing math | — | Product uses 3-axis VAD + BPM heuristics, not the S³ formalism |

See [`claim-charts.md`](./claim-charts.md) for element-by-element mappings,
[`schema-evidence.md`](./schema-evidence.md) for the evidentiary data model,
[`stateflows.md`](./stateflows.md) for runtime state-flow / sequence proofs, and
[`traceability.md`](./traceability.md) for the claim-element → runtime-observable ledger.

---

## 4. What IS reduced to practice here

### 4.1 US 11,694,786 ('786) — affective recommendation + "optimal medical media"

**Inventive concept (as recited on the product's own About page, `src/pages/About.tsx:127-134`):**
recommend media "based on their emotional impact on the user — and … determine and deliver
'optimal medical media' for treating brain functions and associated neurological conditions."

This system is implemented end-to-end:

**(a) Affective measurement — a reproducible signature for any piece of audio.**
- `scripts/real_audio_analyzer.py:121-165` extracts mood dimensions and derives
  `valence = mood_happy`, `arousal = mood_energetic`, `dominance = energy × brightness`, and a
  **`tense`** axis = `1.0 − mood_calm` (the "tension/release" dimension named in the patent).
- Stored per track in `tracks`: `valence`, `arousal`, `dominance`, `emotion_tags`,
  `emotional_stability`, `mood_tier`, `mood_scores`, `cognitive_load`,
  `neural_entrainment_potential`.
- **Emotional Impact Factor (EIF):** `tracks.eif_valence`, `eif_arousal`, `eif_total`,
  `eif_patient`, `eif_scored_at` (`types.ts:5842+`, `6007+`).
- **Affective trajectory:** `track_temporal_arcs` stores per-window `valence_raw`,
  `arousal_raw`, `eif_*`, `mood_tier` across a track; served by the `get_track_temporal_arc` RPC.

**(b) Audio feature extraction pipeline.** `scripts/complete_audio_analyzer.py`,
`scripts/real_audio_analyzer.py`, `src/scripts/streamlinedKeyAnalysis.py` (librosa/Essentia:
key, tempo, chroma, MFCC, spectral centroid/rolloff/bandwidth, ZCR, loudness LUFS, dynamic
range, roughness, onset rate) → ingested via `supabase/functions/audio-analysis/index.ts` into
`tracks` and `spectral_analysis`.

**(c) Recommendation by emotional impact.**
- Server: `supabase/functions/api/index.ts` `getTherapeuticTracksVAD` (l.175-277) scores every
  candidate track against a per-goal VAD + BPM target profile, ranks, and sequences (accelerate/
  decelerate by arousal).
- Client: `src/services/enhancedTrackSelection.ts` (variety scoring, favorites, anti-repetition)
  + `src/services/musicalSimilarityDetection.ts` (fingerprint similarity) +
  `src/utils/camelotWheel.ts` (harmonic progression).

**(d) "Optimal medical media" — goal/condition → content.**
- `src/config/therapeuticGoals.ts`: 6 goals, each with `bpmRange`, `vadProfile{valence,arousal,
  dominance}`, and `musicBuckets` (goal→content map).
- `therapeutic_applications` table: per-track, per-condition **evidence scores**
  (`anxiety/depression/focus/pain/ptsd/sleep_evidence_score`), `frequency_band_primary`,
  `condition_targets`, `cortisol_reduction_potential`, `eeg_alignment_score`,
  `hrv_alignment_score`, `effect_size`, `supporting_studies`.
- `src/services/therapeuticUseCases.ts`: clinical protocols (anxiety, focus, sleep, pain, mood)
  with multi-phase VAD/BPM session structure and `measurableOutcomes` (GAD-7, PHQ-9, PSQI, HRV).

**(e) Delivery + closed loop.** `src/stores/audioStore.ts` assembles/advances the session and
writes `listening_sessions`; `music_therapy_sessions` records `pre_session_mood`,
`post_session_mood`, `outcomes`.

**(f) Frequency-band entrainment.** `supabase/functions/brainwave-stream/index.ts` defines
`FREQUENCY_BANDS` (δ 0.5-4, θ 4-8, α 8-12, β 12-30, γ 30-100 Hz) and `GOAL_FREQUENCIES`, and
generates live binaural-beat streams; `spectral_analysis` stores per-track δ/θ/α/β/γ band power
and therapeutic band scores.

> **Claim-text caveat:** the reviewed Drive documents did **not** contain the verbatim *granted*
> '786 independent claims (the `786_Master_Patent_Submission.docx` is a June-2026 prosecution
> *planning memo*, not the issued patent). The mapping above is at the **inventive-concept
> level**. A precise claim chart requires the issued claims pulled from USPTO Patent Center.

### 4.2 App. 18/315,457 — "Optimal Medical Media" continuation (pending)

Elected **Claim 10** (from `Claim 10 Clean.docx` / `NUPV_P3323` response): *"selecting a plurality
of STEMs … each STEM is a digital audio file; producing the OMM by remixing the plurality of
STEMs; treating … by causing the identified OMM to be played."*

| Claim-10 limitation | Verdict | Evidence |
|---|:---:|---|
| select a plurality of digital-audio-file "STEMs" for a target brain function | ● | `therapeuticEngine.createSession`, `therapeuticGoals.ts`, `SimpleStorageService` |
| produce the OMM **by remixing** the STEMs | ◐/— | Product sequences & plays **whole tracks**; it does not remix stems into a new work |
| treat by **causing the OMM to be played** | ● | `src/stores/audioStore.ts` playback + `listening_sessions`/`music_therapy_sessions` |

Net: the **select-and-deliver** heart of the OMM claim is reduced to practice; the **"remixing
STEMs"** limitation is **not** literally performed by this product and should not be represented
as such. (Stem-level remixing appears only in *drafted, unfiled* applications — see §5.3.)

---

## 5. What is NOT reduced to practice in this repository

Stated plainly so the package is defensible.

### 5.1 US 12,361,263 ('263) — GRN Utilizing
Every independent claim requires the modeled entities to be **neurotransmitters** and terminates
in **treating a patient by stimulating the patient**. This product does neither. **Integration
evidence only:** the production DB exposes `grn_pipeline_runs`, `grn_pipeline_steps` (with
`engine`, `confidence`, `derivation`, `output_summary`, `committed`), and `grn_ingestion_log` —
i.e. an external GRN engine writes here — but the GRN algorithm itself is not in this repo.
`src/services/enhancedTrackSelection.ts` `createOptimalSpacing` (simulate each candidate vs.
recent history → eliminate → pick) is a **product-level architectural analogue** of
"simulate→eliminate→identify," **not** a practice of the clinical claim.

### 5.2 US 12,651,165 ('165) — GRN Training
The claim requires a **Self-Organizing Map** producing a visualization that gates training of a
**GRN** containing **dominance-factor nodes** (change intensity × frequency) and
**evolution-of-internal-component nodes** (D(t)=α·I(t)+β·F(t); C(t)=C(t−1)+D(t);
E(t)=E(t−1)+γ·C(t)). **No SOM/MiniSom or dominance-factor code exists in this repo.** The Python
analyzers here perform *feature extraction*, not GRN training. Reference implementations
(`MiniSom`, D/C/E update rules) live in the separate GRN/ML codebase; the `grn_*` tables are the
only footprint here.

### 5.3 Drafted (unfiled) applications
- **4-D Affective "VADE Glome"** (S³ hypersphere, `P_VADE = W_proxy·X + b`, Pauli formalism,
  Fibonacci-constrained dosing, `V ≥ 1.6·A`, 46–186 BPM): **not** implemented. The product uses a
  simpler **3-axis VAD profile + BPM range** per goal (`therapeuticGoals.ts`) — a practical
  analogue, not the claimed S³/Pauli mathematics.
- **STEM decomposition + rights-constrained generation**, **micro-royalty attribution** (α_k
  geodesic projection), **deterministic rights clearance + C2PA provenance**: none present in
  this repo.

---

## 6. Cross-reference: patents ↔ Drive source documents

| Patent / item | Authoritative Drive source(s) |
|---|---|
| US 11,694,786 (granted) | `NECH-002_01US Notice of Allowance`; issued patent (pull from USPTO for claims) |
| App. 18/315,457 (pending) | `NECH-002_02US_Specification.docx`, `Claim 10 Clean.docx`, `NUPV_P3323_resp_rest…approved.docx` |
| US 12,361,263 (granted) | `NUPV_P2982A_Cover_Letter_Letters_Patent`; PCT `WO2026/087924` |
| US 12,651,165 (granted) | `12651165 Issued Patent NUPV P2982B.pdf`; PCT `WO2026/087925` |
| GRN D/C/E node math | `GRN_PackB_075_Training_NetNew_v1`, `GRN_PackA_263_Utilizing_NetNew_v4`, `README 075 Training.pdf` |
| 4-D Affective (drafted) | `NeuralPositive Patent Application 4D Affective.pdf` |
| STEM / royalty / provenance (drafted) | "You need to draft these as patents…" (Drive doc) |
| Portfolio / EOU strategy | `Neuropositive Patent Manifest.pdf` + companion `.xlsx`; `GRN Patent EOU Analysis Briefing` |

> **Not NeuralPositive patents:** `US11593415B1.pdf` ("Decision Making Analysis Engine") and
> `US12118117.pdf` ("Counting Machine … Ensemble Network") in the Drive are **Validate Me LLC**
> identity-verification patents (shared co-inventor J. Anderson). They are unrelated to this
> product and are **excluded** from this evidence package.

---

## 7. How to independently verify

1. **Schema:** open `src/integrations/supabase/types.ts` and search `eif_`, `valence`,
   `track_temporal_arcs`, `therapeutic_applications`, `spectral_analysis`, `grn_pipeline`.
2. **Affective measurement:** read `scripts/real_audio_analyzer.py:121-165`.
3. **Recommendation:** read `supabase/functions/api/index.ts` `getTherapeuticTracksVAD` and
   `src/services/enhancedTrackSelection.ts`.
4. **Goal→content:** read `src/config/therapeuticGoals.ts` and `src/services/therapeuticUseCases.ts`.
5. **Run the product** (`npm i && npm run dev`) and exercise a goal-based session end-to-end.
6. **Provenance of dates/numbers:** verify every patent number, date, and inventor against USPTO
   Patent Center / WIPO before relying on this document.

## 8. Important disclaimers

- This is an **engineering evidence map** produced to assist counsel; it is **not legal advice**
  and makes **no claim-construction or infringement/validity determination**. Reduction to
  practice is a legal question for qualified patent counsel.
- Verdicts describe **what the code in this repository does**, mapped to the **inventive concepts**
  of the patents. Where verbatim granted claims were not available in the reviewed materials, the
  mapping is at the concept level and is flagged as such.
- Portfolio metadata (numbers, dates, statuses, inventorship, chain of title) is drawn from
  NeuralPositive's own Drive documents — several of which are AI-generated strategy briefings
  carrying their own "may contain errors" disclaimers — and **must be confirmed against the USPTO
  record**.
- Nothing here should be placed in an investor teaser without counsel's review, particularly the
  inventorship and chain-of-title statements.

---

*Generated from a review of the repository source and the NeuralPositive patent documents in
Google Drive. See `claim-charts.md` and `schema-evidence.md` in this folder for detail.*
