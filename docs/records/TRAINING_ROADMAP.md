# NT Training Roadmap

## What NT-001 proved

NT-001 ran the full 4-criterion governed protocol on GSE119262 (44 samples,
17183 genes, human, data-driven regime). Result: **NOT_MET** (1/4 criteria).

The cVAE (10.6M parameters, latent_dim=64) cannot beat a mean or linear-shift
baseline with 21 perturbation pairs, even subsetted to 500 genes (p/n = 24).
This is expected: a deep generative model needs orders of magnitude more
training samples than output dimensions.

**What worked:** the pre-registration framework, species firewall, regime
selection, hash-chained evidence records, and cross-repo deposit pipeline all
function correctly. The harness caught the failure honestly.

## The p/n ratio problem

| Setting | n (pairs) | p (genes) | p/n | Feasible? |
|---------|-----------|-----------|-----|-----------|
| NT-001 (all genes) | 21 | 17183 | 818 | No |
| NT-001 (500 genes) | 21 | 500 | 24 | No |
| NT-001 (50 genes) | 21 | 50 | 2.4 | Marginal |
| Pooled (all Merlin) | ~50 | ~29 | 0.6 | Yes, but tiny gene set |
| 10 in-regime series | ~200 | ~5000 | 25 | Marginal |
| 100 in-regime series | ~2000 | ~5000 | 2.5 | Yes |

## NT-002 plan: right-sized models for current data

Pre-register two arms against the same GSE119262 data:

1. **Ridge regression** (α cross-validated): n_params ≈ p, no latent space.
   Expected to beat mean baseline at p/n > 1. This is the honest "can we
   learn anything at all from this data?" baseline.

2. **Linear VAE** (latent_dim=8, no hidden layers): n_params ≈ 2×p×8 + 8×p.
   A VAE with capacity matched to the data scale.

Both run under the same 4-criterion protocol as NT-001 (mean baseline,
linear shift, permutation, and pearson r > 0.5).

## Data scaling plan

The series catalog identifies 745 GEO series with ≥30 samples across 9
biological programs. Downloading even 10% of these would give us ~200-500
perturbation pairs — enough for p/n < 5 with gene subsetting.

Priority datasets (from Merlin's existing programs):
- Autophagy: GSE119262 (44 samples, already committed), plus ARCHS4/recount3
  autophagy-tagged series
- Reprogramming: Large Yamanaka factor studies (GSE201710 has only 16 samples
  but larger ENCODE/Roadmap datasets exist)
- Drug response: LINCS L1000 (978 landmark genes, millions of perturbation
  profiles) — the canonical source for this exact problem

## Architecture scaling plan

| Data scale | Recommended model | p/n target |
|------------|-------------------|------------|
| <50 pairs | Ridge regression | <2 |
| 50-500 pairs | Linear VAE (latent=8-16) | <5 |
| 500-5000 pairs | cVAE (latent=32, hidden=128) | <5 |
| >5000 pairs | Full cVAE (latent=64+, hidden=512) | <5 |

The current PerturbationResponseModel is designed for the >5000 tier.
We need to build the smaller models first and demonstrate they work
before scaling up.

## Immediate next steps

1. NT-002: Ridge + Linear VAE on GSE119262 (gene-subsetted)
2. Download 5 more in-regime autophagy/drug-response series from GEO
3. NT-003: Pooled multi-series training with data from step 2
4. LINCS L1000 integration (978 genes, pre-computed perturbation signatures)
