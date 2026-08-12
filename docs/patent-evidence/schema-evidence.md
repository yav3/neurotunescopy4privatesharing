# Evidentiary Data Model

Companion to [`README.md`](./README.md). The production database schema (typed in
`src/integrations/supabase/types.ts`) is itself reduction-to-practice evidence: it encodes the
affective, therapeutic, and delivery constructs of the '786 family as concrete, populated
columns. Line numbers are approximate (generated file).

## Affective / emotional-impact measurement

| Table | Key columns | Evidences |
|---|---|---|
| `tracks` | `valence`, `arousal`, `dominance`, `emotion_tags[]`, `emotional_stability`, `mood_tier`, `mood_scores` (JSONB), `cognitive_load`, `neural_entrainment_potential` | Per-work affective signature |
| `tracks` | `eif_valence`, `eif_arousal`, `eif_total`, `eif_patient`, `eif_scored_at` | **Emotional Impact Factor (EIF)** scoring |
| `track_temporal_arcs` | `window_index`, `start_sec`, `end_sec`, `valence_raw`, `arousal_raw`, `eif_*`, `mood_tier`, `therapeutic_mode`, `brightness` | **Affective trajectory** over time |
| `vad_poetry` | `vad_valence_mean`, `vad_arousal_mean`, `vad_dominance_mean`, `per_line_vad` (JSON) | VAD measurement applied to a second (text) modality |

## Audio feature extraction

| Table | Key columns | Evidences |
|---|---|---|
| `tracks` | `bpm`, `camelot`, `key`/`scale`/`mode`, `key_strength`, `key_confidence`, `tuning_frequency`, `spectral_*`, `harmonic_features`, `rhythmic_features`, `psychoacoustic_features`, `loudness_lufs`, `dynamic_range`, `zero_crossing_rate`, `onset_rate` | Extracted acoustic features |
| `spectral_analysis` | `delta/theta/alpha/beta/gamma_band_power`, `therapeutic_delta..gamma_score`, `fundamental_frequency`, `harmonic_ratio`, `chroma_vector[]`, `mfcc_coefficients[]` | **Frequency-band / brainwave** analysis |
| `audio_analysis_jobs`, `track_metadata` | job status / derived metadata | Analysis pipeline provenance |

## Therapeutic goal / condition → content ("optimal medical media")

| Table | Key columns | Evidences |
|---|---|---|
| `therapeutic_applications` | `frequency_band_primary`, `frequency_band_secondary[]`, `condition_targets[]`, `anxiety/depression/focus/pain/ptsd/sleep_evidence_score`, `cortisol_reduction_potential`, `eeg_alignment_score`, `hrv_alignment_score`, `effect_size`, `confidence_interval`, `participant_count`, `supporting_studies[]` | Per-track, per-condition **evidence mapping** |
| `therapeutic_track_categories` | `primary_therapeutic_goal`, `bpm_range`, `energy_level`, `intensity_level`, `mood_tags[]`, `therapeutic_tags[]` | Goal categorization |
| `therapeutic_stratifications` | `genre`, `therapeutic_goal`, `target_bpm_range`, `recommended_intensity[]` | Goal→audio stratification |
| `tracks` | `therapeutic_use[]`, `therapeutic_category`, `therapeutic_mode`, `therapeutic_effectiveness`, `use_case_dots` | Per-track therapeutic tagging |

## Session assembly, delivery & closed-loop outcome

| Table | Key columns | Evidences |
|---|---|---|
| `precomputed_playlists` | `goal`, `intensity`, `direction`, `vad_profile` (JSON), `camelot_data` (JSON), `avg_compatibility_score`, `tracks` (JSON) | Cached VAD-scored recommendations |
| `playlists` / `playlist_tracks` | `therapeutic_tags[]`, `therapeutic_benefits[]`, `research_info` (JSON), `position` | Curated therapeutic playlists |
| `listening_sessions` | `session_duration_minutes`, `tracks_played`, `skip_rate`, `dominant_genres[]`, `mood_progression` (JSON) | Delivered-session record (closed loop) |
| `music_therapy_sessions` | `patient_id`, `therapy_type`, `pre_session_mood`, `post_session_mood`, `physiological_measures`, `outcomes` | Clinical pre/post outcome capture |
| `user_favorites`, `user_listening_history`, `user_genre_preferences`, `user_playback_state` | play counts, history, preferences, resume state | Personalization state |

## GRN pipeline (external engine — integration footprint only)

| Table | Key columns | Evidences |
|---|---|---|
| `grn_pipeline_runs` | `run_id`, `system_version`, `engine_count`, `constraints_loaded`, `total_violations`, `all_passed`, `prompt_fingerprint`, `duration_ms` | An external multi-engine GRN run **writes here** |
| `grn_pipeline_steps` | `engine`, `confidence`, `derivation`, `output_summary`, `committed` | Stepwise GRN reasoning/derivation trace |
| `grn_ingestion_log` | `job_type`, `source`, `records_processed`, `records_failed`, `next_scheduled_at` | GRN data-ingestion scheduler |

> These `grn_*` tables show that a Generative Relational Network system **exists and integrates
> with this backend**, but the SOM / dominance-factor / evolution-node **algorithm is not
> implemented in this repository**. They are integration evidence, not reduction to practice of
> the '165 / '263 methods. See [`README.md §5`](./README.md#5-what-is-not-reduced-to-practice-in-this-repository).

---

*All tables above are declared in `src/integrations/supabase/types.ts`. This document lists the
subset relevant to the patent portfolio; the full schema contains ~130 tables.*
