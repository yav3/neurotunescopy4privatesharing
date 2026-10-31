# Cross-Repository Integration — Governed Evidence Layer

## Architecture

NeuroTunesAI is NOT a frontier foundation model. It is a **governed evidence
and analysis layer** that makes outputs from vendor models and narrow
foundation models admissible.

```
┌─────────────────────────────────────────────────────────┐
│                    Product Layer                         │
│  neurotunescopy4privatesharing (React)                   │
│  neurotunes (Flutter mobile)                             │
│  Audio delivery · Therapeutic goals · Session UI         │
└───────────────────────┬─────────────────────────────────┘
                        │ Problem → Answer
┌───────────────────────┴─────────────────────────────────┐
│              NeuroTunesAI — Governed Layer                │
│  models/math_core/  (14 exact numpy solvers)             │
│  models/evidence/   (lineage, registry, regime, eval)    │
│  models/bridge/     (Merlin, GEO, product adapters)      │
│  models/interface/  (52+ ProblemType, UnifiedSolver)     │
│                                                          │
│  GovernedSolver enforces on every call:                  │
│    ✓ Species/regime firewall (declare or refuse)         │
│    ✓ Hash-chained lineage (SHA-256 tamper evidence)      │
│    ✓ Pre-registered study criteria                       │
│    ✓ Calibration + truth evaluation                      │
└───────────────────────┬─────────────────────────────────┘
                        │ EntitySeries contract
┌───────────────────────┴─────────────────────────────────┐
│         merlinaineuralplus2 — Evidence Engine             │
│  backend/app/patents/rtp/  (RTP kernel, golden.json)     │
│  backend/records/studies/  (65+ pre-registered studies)   │
│  backend/app/eval/         (calibration + truth + cite)   │
│  backend/engines/          (12 physics/math engines)      │
│  backend/app/data/harvest/ (14 data sources)              │
│                                                          │
│  Patent estate:                                          │
│    US 11,694,786 B1  — Recommendation (affective)        │
│    US 12,361,263 B1  — GRN inference                     │
│    US 12,651,165 B2  — GRN training                      │
│    WO 2026/087924 A1 — PCT (GRN)                         │
│    WO 2026/087925 A1 — PCT (GRN)                         │
└─────────────────────────────────────────────────────────┘
```

## Data Contracts

### EntitySeries (shared between Merlin and NeuroTunesAI)
```python
@dataclass
class EntitySeries:
    entity_ids: list[str]     # N entity identifiers
    values: np.ndarray        # shape (T, N) float64
    locations: list[str]      # optional spatial/tissue locations
    domain: str               # "neurotunes" | "quantum" | ...
    provenance: str           # SHA-256 of upstream data
```
Cross-stack identity verified via FNV-1a 64-bit hash + golden.json vectors.

### Problem → Answer (NeuroTunesAI internal)
```python
problem = Problem(type=ProblemType.PK_CONCENTRATION, params={...}, query={...})
answer = governed_solver.solve(problem, declaration=species_decl)
# answer.evidence contains hash-chained lineage record
```

## What Exists Now

| Capability | NeuroTunesAI | Merlin | Product Apps |
|---|---|---|---|
| Exact math solvers | 14 in math_core/ | 12 engines | — |
| Evidence chain | GovernedSolver | Study registry (65+) | — |
| Patent kernel | rtp_solver.py | rtp/kernel.py | — |
| Calibration | eval_harness.py | calibration.py | — |
| Data harvest | — | 14 sources | — |
| GEO series | geo_adapter.py | NCBI GEO (~1.7M) | — |
| Audio delivery | spectral/eif/entrainment | — | Binaural/isochronic |
| Therapeutic goals | therapeutic_solver.py | — | Session UI |

## Next Steps (User's 5-Point Plan)

1. **Foundation-grade data layer** — connect Merlin's 14 harvest sources
   to NeuroTunesAI's EntitySeries contract
2. **Narrow foundation model** — train on in-regime GEO series (358 with
   30+ samples, 56 time-flagged) using the governed training harness
3. **Training/eval harness** — pre-registration protocol, sealed
   calibration constants, three-loop eval (cite + calibrate + truth)
4. **Compute/people** — external requirement
5. **Position as governed layer** — the evidence discipline makes solver
   outputs admissible; the product apps deliver them
