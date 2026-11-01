"""Music assessment: rubric-based evaluation, skill proficiency levels."""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import IntEnum


class Proficiency(IntEnum):
    BEGINNER = 1
    ELEMENTARY = 2
    INTERMEDIATE = 3
    ADVANCED = 4
    EXPERT = 5


@dataclass
class RubricCriterion:
    name: str
    weight: float = 1.0
    max_score: float = 10.0
    description: str = ""

    def normalize(self, raw_score: float) -> float:
        return min(max(raw_score / self.max_score, 0.0), 1.0)


@dataclass
class PerformanceRubric:
    name: str
    criteria: list[RubricCriterion] = field(default_factory=list)

    def evaluate(self, scores: dict[str, float]) -> dict:
        if not self.criteria:
            return {"total": 0.0, "proficiency": Proficiency.BEGINNER}
        total_weight = sum(c.weight for c in self.criteria)
        weighted_sum = 0.0
        details: dict[str, float] = {}
        for c in self.criteria:
            raw = scores.get(c.name, 0.0)
            norm = c.normalize(raw)
            details[c.name] = norm
            weighted_sum += norm * c.weight
        overall = weighted_sum / total_weight if total_weight > 0 else 0.0
        level = self._to_proficiency(overall)
        return {"total": overall, "details": details, "proficiency": level}

    @staticmethod
    def _to_proficiency(score: float) -> Proficiency:
        if score >= 0.9:
            return Proficiency.EXPERT
        elif score >= 0.75:
            return Proficiency.ADVANCED
        elif score >= 0.55:
            return Proficiency.INTERMEDIATE
        elif score >= 0.35:
            return Proficiency.ELEMENTARY
        return Proficiency.BEGINNER


STANDARD_PERFORMANCE_RUBRIC = PerformanceRubric(
    name="Standard Performance",
    criteria=[
        RubricCriterion("pitch_accuracy", weight=2.0, max_score=10.0, description="Intonation and note accuracy"),
        RubricCriterion("rhythm_accuracy", weight=2.0, max_score=10.0, description="Rhythmic precision"),
        RubricCriterion("dynamics", weight=1.5, max_score=10.0, description="Dynamic range and control"),
        RubricCriterion("tone_quality", weight=1.5, max_score=10.0, description="Tone production and consistency"),
        RubricCriterion("musicality", weight=1.0, max_score=10.0, description="Expression, phrasing, interpretation"),
        RubricCriterion("technique", weight=1.0, max_score=10.0, description="Technical facility"),
    ],
)


@dataclass
class SkillAssessment:
    skill_name: str
    proficiency: Proficiency = Proficiency.BEGINNER
    sub_skills: dict[str, float] = field(default_factory=dict)
    notes: str = ""

    def overall_score(self) -> float:
        if not self.sub_skills:
            return 0.0
        return sum(self.sub_skills.values()) / len(self.sub_skills)

    def weakest_skill(self) -> str | None:
        if not self.sub_skills:
            return None
        return min(self.sub_skills, key=self.sub_skills.get)

    def strongest_skill(self) -> str | None:
        if not self.sub_skills:
            return None
        return max(self.sub_skills, key=self.sub_skills.get)
