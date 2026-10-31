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

## Completed Milestones

### NT-001 — Full 4-Criterion Protocol (2026-10-31)

Full cVAE (10.6M params) on GSE119262 — **NOT_MET** (1/4 criteria).
The pre-registration framework correctly catches that the model cannot
beat simple baselines with 21 perturbation pairs.

| Arm | MSE | Pearson r |
|-----|-----|-----------|
| cVAE (10.6M params) | 0.948 | 0.136 |
| Mean baseline | 0.905 | 0.000 |
| Linear shift | 0.735 | 0.436 |
| Permutation | 1.455 | -0.150 |

**Lesson:** p/n = 24 (500 genes / 21 pairs) is too high for a deep
generative model. Architecture must match data scale.

### NT-002 — Right-Sized Models (2026-10-31)

Linear VAE (1266 params, latent_dim=8) on 50-gene panel — **MET** (4/4).
First model to pass the full governed protocol.

| Arm | MSE (val) | Pearson r (val) | Verdict |
|-----|-----------|-----------------|---------|
| Ridge regression | 4.085 | 0.419 | NOT_MET (ties mean) |
| **Linear VAE** | **3.774** | **0.471** | **MET (4/4)** |
| Mean baseline | 4.085 | 0.419 | — |

Test set: MSE=2.91, r=0.50. The governed protocol works end-to-end.

Evidence discipline enforced in both trials: species firewall (human only),
regime pre-registered before method, seed=2026, content-addressed SHA-256,
baselines in the same run.

### NT-003 — Multi-Series Pooling (2026-10-31)

Pooled GSE119262 + GSE107965 on 9 common genes — **MET** (4/4).
First multi-series trial to pass the governed protocol.

| Arm | MSE (val) | Pearson r (val) | Verdict |
|-----|-----------|-----------------|---------|
| Single-series (21 pairs) | 0.108 | 0.954 | NOT_MET (mean r=0.979) |
| **Pooled (33 pairs)** | **0.227** | **0.903** | **MET (4/4)** |

**Lesson:** Pooling helps via diversity (heterogeneous perturbation pairs
from two autophagy studies), not dimensionality. Data bottleneck confirmed:
need full expression matrices for more series.

### NT-004 — Scaled Pooled Trial with Full Matrices (2026-10-31)

Downloaded 4 full GEO expression matrices (722 new samples, 178 MB total).
Cross-platform gene-ID mismatch: 5 series use 4 different ID namespaces.
Only same-platform pairs (GSE5281+GSE30174, Affymetrix) share probes.
Variance-based feature selection (54675→2000) stabilises training.

| Arm | Series | Pairs | Features | MSE (val) | r (val) | Verdict |
|-----|--------|-------|----------|-----------|---------|---------|
| A (single) | GSE5281 | 81 | 2000 | 0.772 | 0.894 | **MET 4/4** |
| **B (pooled)** | GSE5281+GSE30174 | **121** | 2000 | **0.648** | **0.947** | **MET 4/4** |

**First trial where BOTH arms meet all 4 criteria.** Pooling improved
r: 0.894→0.947 (+5.3pp) and MSE: 0.772→0.648 (−16%). Primary blocker
for true multi-program pooling: probe-to-gene mapping across platforms.

### Product Integration
- `PerturbationResult` interface added to `audio-analysis/index.ts`
  defining the governed inference output format for the product pipeline

### Data Layer — 9 Modalities Bridged (2026-10-31)

NeuroTunesAI's modality bridge now discovers all Merlin committed data:

| Modality | Loader | Verified against |
|----------|--------|------------------|
| bulk_expression | geo_loader | 15 GEO series (human + mouse) |
| perturbseq | perturbseq_loader | Xaira panel (109 cells) |
| ppi_prior | prior_network_loader | STRING priors (12 series) |
| benchmark | prior_network_loader | DREAM5 gold standard |
| disease_ontology | disease_ontology_loader | EDS MONDO/HPO (39 nodes, 36 edges) |
| crosscheck | crosscheck_loader | AlphaFold DB (14 genes) + STRING PPI (56 genes, 402 interactions) |
| literature_evidence | literature_loader | EDS digest (15 ClinVar genes, 5858 PubMed, 97 trials) |
| molecule | molecule_loader | MSR-ACC-TAE25 + APB-E0 quantum chemistry |

62+ integration tests across all loaders. Three planned: methylation, imaging, single_cell_atlas.

## Next Steps (User's 5-Point Plan)

1. **Foundation-grade data layer** — ✅ 9 of 12 modalities bridged. Remaining:
   methylation (CpG arrays), imaging (feature vectors), single_cell_atlas (h5ad).
   745 in-regime GEO series identified for expansion.
2. **Narrow foundation model** — NT-004 demonstrates both single-series
   and pooled training passing 4/4 criteria at 2000-feature scale. Next:
   cross-platform probe-to-gene mapping (NT-005) to unlock multi-program
   pooling → 500+ pairs → p/n < 5. Architecture tiers in `TRAINING_ROADMAP.md`.
   `GovernedInferenceService` wired in `lib/services/governed_inference_service.dart`.
3. **Training/eval harness** — ✅ 4-criterion protocol operational (NT-001
   through NT-004). Pre-registration, baselines, hash-chained records all working.
4. **Compute/people** — external requirement
5. **Position as governed layer** — the evidence discipline makes solver
   outputs admissible; the product apps deliver them
