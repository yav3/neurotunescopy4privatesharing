"""Generative Relational Network (GRN) solver.

Implements the D/C/E node dynamics from US 12,651,165:

    D(t) = α · I(t) + β · F(t)          (dominance-factor node)
    C(t) = C(t-1) + D(t)                (cumulative-change node)
    E(t) = E(t-1) + γ · C(t)            (evolution-of-internal-component)

Where:
    I(t) = change intensity at time t
    F(t) = change frequency at time t
    α, β, γ = learned or specified coefficients

The GRN models relationships between entities (e.g., neurotransmitters)
as a directed graph. Each edge carries D/C/E dynamics. The simulate →
eliminate → identify pipeline discovers which interactions drive a
target outcome.
"""
from __future__ import annotations

import numpy as np
from dataclasses import dataclass, field


@dataclass
class GRNNode:
    """A node in the GRN representing an entity (e.g., a neurotransmitter)."""
    name: str
    baseline: float = 0.0
    state: float = 0.0


@dataclass
class GRNEdge:
    """A directed edge with D/C/E dynamics."""
    source: str
    target: str
    alpha: float = 1.0    # intensity weight
    beta: float = 1.0     # frequency weight
    gamma: float = 0.1    # evolution rate
    D: float = 0.0        # current dominance-factor
    C: float = 0.0        # cumulative change
    E: float = 0.0        # evolution state


class GRNSolver:
    """Simulates GRN dynamics over discrete time steps."""

    def __init__(self, nodes: list[GRNNode], edges: list[GRNEdge]):
        self.nodes = {n.name: n for n in nodes}
        self.edges = edges
        self._edge_map: dict[str, list[GRNEdge]] = {}
        for e in edges:
            self._edge_map.setdefault(e.target, []).append(e)

    def step(
        self,
        intensities: dict[str, float],
        frequencies: dict[str, float],
    ) -> dict[str, float]:
        """Advance one time step.

        Args:
            intensities: I(t) per edge source
            frequencies: F(t) per edge source

        Returns:
            Updated node states.
        """
        for edge in self.edges:
            I_t = intensities.get(edge.source, 0.0)
            F_t = frequencies.get(edge.source, 0.0)

            # D(t) = α·I(t) + β·F(t)
            edge.D = edge.alpha * I_t + edge.beta * F_t

            # C(t) = C(t-1) + D(t)
            edge.C = edge.C + edge.D

            # E(t) = E(t-1) + γ·C(t)
            edge.E = edge.E + edge.gamma * edge.C

        # Update target node states from incoming edges
        for name, node in self.nodes.items():
            incoming = self._edge_map.get(name, [])
            if incoming:
                total_effect = sum(e.E for e in incoming)
                node.state = node.baseline + total_effect

        return {n: node.state for n, node in self.nodes.items()}

    def simulate(
        self,
        intensities_seq: list[dict[str, float]],
        frequencies_seq: list[dict[str, float]],
    ) -> dict[str, np.ndarray]:
        """Simulate over T time steps.

        Returns:
            Dict mapping node name → array of states (T,).
        """
        T = len(intensities_seq)
        history: dict[str, list[float]] = {n: [] for n in self.nodes}

        self.reset()
        for t in range(T):
            states = self.step(intensities_seq[t], frequencies_seq[t])
            for n, val in states.items():
                history[n].append(val)

        return {n: np.array(v) for n, v in history.items()}

    def eliminate_edge(self, source: str, target: str) -> "GRNSolver":
        """Create a copy with one edge removed (simulate→eliminate pipeline)."""
        new_edges = [e for e in self.edges
                     if not (e.source == source and e.target == target)]
        new_nodes = [GRNNode(n.name, n.baseline) for n in self.nodes.values()]
        return GRNSolver(new_nodes, [
            GRNEdge(e.source, e.target, e.alpha, e.beta, e.gamma)
            for e in new_edges
        ])

    def identify_critical_edges(
        self,
        intensities_seq: list[dict[str, float]],
        frequencies_seq: list[dict[str, float]],
        target_node: str,
    ) -> list[tuple[str, str, float]]:
        """Simulate→eliminate→identify: find edges whose removal most
        changes the target node's final state.

        Returns list of (source, target, |Δ_state|) sorted by impact.
        """
        full_history = self.simulate(intensities_seq, frequencies_seq)
        full_final = full_history[target_node][-1]

        impacts = []
        for edge in self.edges:
            if edge.target != target_node and edge.source != target_node:
                continue
            ablated = self.eliminate_edge(edge.source, edge.target)
            ablated_history = ablated.simulate(intensities_seq, frequencies_seq)
            ablated_final = ablated_history[target_node][-1]
            delta = abs(full_final - ablated_final)
            impacts.append((edge.source, edge.target, delta))

        impacts.sort(key=lambda x: x[2], reverse=True)
        return impacts

    def reset(self):
        for node in self.nodes.values():
            node.state = node.baseline
        for edge in self.edges:
            edge.D = 0.0
            edge.C = 0.0
            edge.E = 0.0
