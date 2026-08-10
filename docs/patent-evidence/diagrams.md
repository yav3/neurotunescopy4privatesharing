# Diagrams — Reduction-to-Practice Drawings

Companion to [`README.md`](./README.md). Mermaid source renders on GitHub and in the data-room
artifact. Four drawings: (1) system architecture & data flow, (2) the '786 affective
reduction-to-practice pipeline, (3) patents → code evidence map, (4) portfolio map.

---

## Drawing 1 — System architecture & data flow

```mermaid
flowchart TB
    subgraph Client["Frontend — React/Vite/TypeScript"]
      UI["Goal selection UI\nsrc/pages, src/components"]
      Store["audioStore (Zustand)\nqueue • player • session"]
      Select["enhancedTrackSelection\nmusicalSimilarityDetection\ntherapeuticEngine / useCases"]
      Cfg["therapeuticGoals.ts\nvadProfile • bpmRange • buckets"]
    end
    subgraph Edge["Supabase Edge Functions (Deno)"]
      API["api/index.ts\ngetTherapeuticTracksVAD • /stream"]
      Brain["brainwave-stream\nbinaural δθαβγ"]
      Chat["*-chat → Anthropic Claude"]
      Ingest["audio-analysis\n(ingests features)"]
    end
    subgraph DB["Supabase Postgres (~130 tables)"]
      Tracks["tracks\nvalence/arousal/dominance/eif_*"]
      Ther["therapeutic_applications\nspectral_analysis\ntrack_temporal_arcs"]
      Sess["listening_sessions\nmusic_therapy_sessions"]
      GRN["grn_pipeline_runs/steps\n(external engine footprint)"]
    end
    subgraph Off["Offline / External"]
      Py["Python analyzers\nscripts/*.py (librosa/Essentia)"]
      GRNe["External GRN/ML engine\n(SOM • D/C/E nodes)"]
    end
    Storage["Supabase Storage\ngenre buckets (audio)"]

    UI --> Store --> Select --> Cfg
    Select --> API
    API --> Tracks
    API --> Storage
    Store -->|play| Storage
    Store -->|log| Sess
    Py -->|features| Ingest --> Tracks
    Py --> Ther
    GRNe -.writes.-> GRN
    Chat -.-> UI
    Brain --> Store
```

---

## Drawing 2 — The '786 affective reduction-to-practice pipeline

```mermaid
flowchart LR
    A["Audio work\n(digital audio file)"] --> B["Feature extraction\nscripts/real_audio_analyzer.py\nkey•tempo•spectral•MFCC"]
    B --> C["Affective measurement\nvalence=mood_happy\narousal=mood_energetic\ndominance=energy×brightness\ntense=1−calm"]
    C --> D["EIF scoring\neif_valence/arousal/total\n+ track_temporal_arcs (trajectory)"]
    D --> E["Goal / condition mapping\ntherapeuticGoals.ts vadProfile\ntherapeutic_applications evidence"]
    E --> F["Recommend by emotional impact\ngetTherapeuticTracksVAD\nenhancedTrackSelection"]
    F --> G["Sequenced session\ntherapeuticEngine / useCases\nCamelot harmonic flow"]
    G --> H["Deliver & play\naudioStore • /stream"]
    H --> I["Outcome / closed loop\nlistening_sessions\nmusic_therapy_sessions\npre/post mood • GAD-7/PHQ-9/PSQI"]
    I -.feedback.-> E
```

---

## Drawing 3 — Patents → code evidence map

```mermaid
flowchart TB
    P786["US 11,694,786 ('786)\nGranted"]:::granted
    P457["App 18/315,457\nOMM claim 10 — Pending"]:::pending
    P263["US 12,361,263 ('263)\nGRN Utilizing — Granted"]:::granted
    P165["US 12,651,165 ('165)\nGRN Training — Granted"]:::granted
    P4D["4-D Affective VADE\nDrafted"]:::draft

    P786 ==>|●| E1["Affective measurement + EIF\nscripts/*.py • tracks.eif_*"]
    P786 ==>|●| E2["Recommendation by impact\napi getTherapeuticTracksVAD"]
    P786 ==>|●| E3["OMM goal→content + delivery\ntherapeuticGoals • audioStore"]
    P786 ==>|●| E4["Outcome loop\nmusic_therapy_sessions"]
    P457 ==>|●| E3
    P457 -.->|◐ remix stems: absent| X1["(no stem remixing)"]:::gap
    P263 -.->|○ integration only| G1["grn_pipeline_* tables"]
    P263 -.->|— clinical| X2["(no neurotransmitter / patient stim)"]:::gap
    P165 -.->|○ integration only| G1
    P165 -.->|— algorithm| X3["(no SOM / dominance-factor code)"]:::gap
    P4D -.->|◐ analogue| E1

    classDef granted fill:#0e7490,stroke:#22d3ee,color:#e0f2fe;
    classDef pending fill:#7c5e10,stroke:#f5c451,color:#fff7e6;
    classDef draft fill:#3f3f46,stroke:#a1a1aa,color:#f4f4f5;
    classDef gap fill:#4c1d24,stroke:#f87171,color:#fee2e2;
```

Legend: **●** reduced to practice here · **◐** partial · **○** integrated externally · **—** not present.

---

## Drawing 4 — Portfolio map

```mermaid
flowchart TB
    Root["NeuralPositive Patent Portfolio\n~55 filings • 3 granted • 1 US pending • 2 PCT"]
    Root --> F1["Family 1 — '786 Audio & Affective\npriority Jan 2019 • 26 items"]
    Root --> F2["Family 2 — GRN Training ('165)\npriority Oct 2024 • 14 items"]
    Root --> F3["Family 3 — GRN Utilizing ('263)\npriority Oct 2024 • 7 items"]
    Root --> F4["Family 4 — Quantum QTD/QARCH\n1 item (draft)"]

    F1 --> F1a["US 11,694,786 — GRANTED ✔ (this repo ●)"]:::here
    F1 --> F1b["App 18/315,457 — PENDING (this repo ◐)"]:::here
    F1 --> F1c["Divisionals/CIPs — drafted\nrecommendation • provenance • VADE • royalty"]
    F2 --> F2a["US 12,651,165 — GRANTED ✔"]
    F2 --> F2b["PCT WO2026/087925 • C1–C8 drafts"]
    F3 --> F3a["US 12,361,263 — GRANTED ✔"]
    F3 --> F3b["PCT WO2026/087924 • continuations/divisionals\n(clinical, drug discovery)"]

    classDef here fill:#0e7490,stroke:#22d3ee,color:#e0f2fe;
```

---

*Rendering: GitHub renders Mermaid natively in Markdown. For a slide/PDF export, open the
data-room artifact (HTML) which renders these same diagrams.*
