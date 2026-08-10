# State-Flow & Sequence Proofs of Reduction to Practice

Companion to [`README.md`](./README.md) and [`claim-charts.md`](./claim-charts.md).

Reduction to practice is shown by an **actual working embodiment**. The diagrams below trace the
*runtime behavior of the shipping system* — real states, real events, real function calls, and
real database writes, each cited to source. They are grouped as:

1. Track data lifecycle — proves **affective measurement & EIF scoring** ('786)
2. Live session sequence — proves **recommend-by-impact + deliver** ('786 / OMM)
3. Player state machine — proves **delivery / "cause the OMM to be played"**
4. Therapeutic session state machine — proves **goal-directed dosing + closed-loop outcome**
5. OMM claim-10 stateflow — element-annotated (what is ● vs. — )
6. GRN pipeline integration sequence — the external-engine footprint (○, not RTP here)

All Mermaid renders natively on GitHub and in the data-room artifact. Verdicts:
**●** RTP here · **◐** partial · **○** external · **—** absent.

---

## 1. Track data lifecycle — affective measurement & EIF ('786) ●

*Every track transitions through measured states; the state is persisted, so the measurement is
reproducible — the hallmark of the '786 "reproducible signature" concept.*

```mermaid
stateDiagram-v2
    [*] --> Uploaded: audio file in Storage bucket
    Uploaded --> Analyzing: scripts/real_audio_analyzer.py\n(librosa/Essentia)
    Analyzing --> FeatureExtracted: key,tempo,spectral,MFCC\n→ tracks.spectral_*, camelot
    FeatureExtracted --> AffectivelyScored: valence=mood_happy\narousal=mood_energetic\ndominance=energy×brightness\ntense=1−calm
    AffectivelyScored --> EIFScored: eif_valence/arousal/total/patient\n(tracks, types.ts:5842+)
    EIFScored --> ArcResolved: per-window arc →\ntrack_temporal_arcs
    ArcResolved --> Categorized: therapeutic_applications\n(condition evidence, freq band)
    Categorized --> Recommendable: audio_status='working'\nanalysis_status='complete'
    Recommendable --> [*]
    Analyzing --> Failed: analysis_status='failed'\nlast_error set
    Failed --> Analyzing: retry
```

**Proof anchors:** `scripts/real_audio_analyzer.py:121-165`; `supabase/functions/audio-analysis/index.ts:178-252` (write contract); columns in `tracks`, `spectral_analysis`, `track_temporal_arcs`, `therapeutic_applications`.

---

## 2. Live therapeutic session — recommend-by-impact + deliver ('786 / OMM) ●

*A single end-to-end runtime trace: goal in, ranked affective media out, played, outcome recorded.*

```mermaid
sequenceDiagram
    actor User
    participant UI as UI (goal select)
    participant Store as audioStore.ts
    participant Sel as enhancedTrackSelection
    participant API as edge: api/index.ts
    participant DB as Postgres (tracks)
    participant ST as Storage (buckets)
    participant Sess as listening_sessions /<br/>music_therapy_sessions

    User->>UI: choose therapeutic goal
    UI->>Store: playFromGoal(goal)
    Store->>Sel: getTherapeuticTracks(goal)
    Sel->>API: /playlist (goal)
    API->>DB: fetch ≤2000 working tracks
    API->>API: getTherapeuticTracksVAD()<br/>score vs vadProfile+BPM, rank, sequence
    API-->>Sel: ranked tracks (+ stream_url)
    Sel->>Sel: variety + anti-repetition + Camelot flow
    Sel-->>Store: setQueue(tracks)
    Store->>Store: startListeningSession()
    Store->>ST: loadTrack → signed URL
    ST-->>Store: audio stream
    Store->>User: play() ▶ (cause OMM to be played)
    loop each track (timeupdate)
        Store->>Store: maintainQueueBuffer / phase+VAD tracking
        Store->>Store: on 'ended' → next()
        Store->>Sess: trackPlayedTrack()
    end
    User->>Store: end session
    Store->>Sess: completeListeningSession()<br/>duration, skipRate, mood_progression, outcomes
```

**Proof anchors:** `audioStore.playFromGoal:1361`, `setQueue:1485`, `loadTrack:920`, `next:1872`, `startListeningSession:34`, `completeListeningSession:71`; `api/index.ts getTherapeuticTracksVAD:175-277`; `enhancedTrackSelection.ts`.

---

## 3. Player state machine — "cause the OMM to be played" ('786 / claim 10) ●

*The `<audio>` element is driven through explicit states by 20 wired event handlers — the literal
delivery mechanism. States/flags are real (`isPlaying`, `isLoading`, `currentTrack`, `error`).*

```mermaid
stateDiagram-v2
    [*] --> Idle: isPlaying=false\ncurrentTrack=null, queue=[]
    Idle --> Loading: setQueue() / loadTrack()\nisLoading=true (loadstart)
    Loading --> Ready: 'canplay' / 'loadeddata'
    Loading --> Error: 'error'\nerror set, try next bucket
    Ready --> Playing: play() ('play')\nisPlaying=true
    Playing --> Paused: pause() ('pause')
    Paused --> Playing: play()
    Playing --> Buffering: 'waiting' / 'stalled'
    Buffering --> Playing: 'canplaythrough'
    Playing --> Advancing: 'ended' / near-end fallback
    Advancing --> Loading: next() → loadTrack(next)
    Advancing --> Refilling: queue ≤ threshold\nmaintainQueueBuffer()
    Refilling --> Loading: fetch more → setQueue
    Error --> Loading: skip broken → next()
    Playing --> SessionComplete: user ends
    SessionComplete --> [*]: completeListeningSession()
```

**Proof anchors:** event handlers `audioStore.ts` (`loadstart:708`, `canplay:1139`, `play:602`, `pause:670`, `waiting:688`, `ended:517`, `error:548`, `timeupdate:721`); `maintainQueueBuffer:372`; state flags at `:207-268`.

---

## 4. Therapeutic session state machine — goal-directed dosing + closed loop ●

*The session advances through clinical **phases**, each with its own **VAD targets**, while
recording an expected-vs-actual **VAD journey** and baseline→outcome measurements.*

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> BaselineCaptured: startSession()\noutcomes.baseline, vadJourney[0]
    BaselineCaptured --> Phase1: phase=0\nvadTargets (valence/arousal/dominance)
    Phase1 --> Phase2: phaseProgress→1\nadvance to next phase vadTargets
    Phase2 --> PhaseN: ...per sessionStructure.phases
    PhaseN --> OutcomeCaptured: endSession(collectOutcomes)\noutcomes.current
    OutcomeCaptured --> Persisted: music_therapy_sessions\npre/post mood, outcomes
    Persisted --> [*]
    Phase1 --> VADTracked: timeupdate →\nvadJourney.push(expected vs actual)
    VADTracked --> Phase1
```

**Proof anchors:** `src/hooks/useTherapeuticSession.ts` (`startSession`, `phase`/`phaseProgress:181-200`, `vadTargets:207`, `vadJourney:224`, `endSession:138`, `outcomes:252`); `therapeuticUseCases.ts` phase `vadTargets`, `measurableOutcomes` (GAD-7/PHQ-9/PSQI).

---

## 5. OMM claim-10 stateflow — element-annotated

*App. 18/315,457 claim 10: select STEMs → produce OMM by remixing → treat by playing. Each
transition is tagged with its reduction-to-practice verdict.*

```mermaid
stateDiagram-v2
    [*] --> Selected: select plurality of STEMs\n(digital audio files) for target\ntherapeuticEngine.createSession  ●
    Selected --> Assembled: sequence into a session\nCamelot flow + energy progression  ●
    Assembled --> Remixed: produce OMM by REMIXING stems
    Remixed --> Played: — NOT performed —\n(product plays whole tracks)
    Assembled --> Played: cause session to be played\naudioStore playback  ●
    Played --> Treated: session delivered to user  ●
    Treated --> Measured: pre/post mood, outcomes\nmusic_therapy_sessions  ●
    Measured --> [*]
    note right of Remixed
      Gap: stem-level remixing is
      absent in this repo (— ).
      Select+deliver path is ● RTP.
    end note
```

**Verdict:** the select-assemble-play-treat-measure spine is ● reduced to practice; the
**remixing** limitation is **—** absent (see [`claim-charts.md` Chart B](./claim-charts.md#chart-b--app-18315457-claim-10-omm-pending)).

---

## 6. GRN pipeline integration — external engine footprint (○, not RTP here)

*Shown for completeness and honesty: the GRN engine ('165/'263) runs **outside** this repo and
writes results here. This proves integration, not reduction to practice of the GRN methods.*

```mermaid
sequenceDiagram
    participant EXT as External GRN/ML engine<br/>(SOM · D/C/E nodes — NOT in this repo)
    participant ING as grn_ingestion_log
    participant RUN as grn_pipeline_runs
    participant STEP as grn_pipeline_steps
    participant APP as NeuroTunes app

    EXT->>ING: schedule/ingest (job_type, source, records_processed)
    EXT->>RUN: run_id, engine_count, constraints_loaded,<br/>total_violations, all_passed, duration_ms
    EXT->>STEP: per-engine: confidence, derivation,<br/>output_summary, committed
    APP->>RUN: read run results (integration)
    Note over EXT,APP: SOM / dominance-factor / evolution-node<br/>ALGORITHM is external. Tables = footprint only (○).
```

**Proof anchors:** `grn_pipeline_runs`, `grn_pipeline_steps`, `grn_ingestion_log` in `src/integrations/supabase/types.ts`. No SOM/dominance-factor source in this repo — see [`README.md §5`](./README.md#5-what-is-not-reduced-to-practice-in-this-repository).

---

*See [`traceability.md`](./traceability.md) for the claim-element → runtime-observable proof
ledger, and [`README.md §8`](./README.md#8-important-disclaimers) for disclaimers.*
