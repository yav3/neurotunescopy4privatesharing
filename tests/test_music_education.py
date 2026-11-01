"""Tests for music_education: ear training, sight-reading, practice, assessment."""
import pytest
from models.music_education import (
    IntervalTrainer, ChordTrainer, RhythmDictation,
    SightReadingGenerator, DifficultyEstimator,
    PracticePlanner, SpacedRepetition, SkillTracker,
    RubricCriterion, PerformanceRubric, SkillAssessment,
)
from models.music_education.practice import SkillRecord


class TestIntervalTrainer:
    def test_available_intervals_difficulty_1(self):
        t = IntervalTrainer(difficulty=1)
        assert 0 in t.available_intervals
        assert 7 in t.available_intervals

    def test_available_intervals_difficulty_3(self):
        t = IntervalTrainer(difficulty=3)
        assert len(t.available_intervals) == 13

    def test_generate_exercise(self):
        t = IntervalTrainer(difficulty=2)
        ex = t.generate_exercise(root=60)
        assert "root_midi" in ex
        assert "interval_name" in ex
        assert ex["root_midi"] == 60

    def test_check_answer_correct(self):
        t = IntervalTrainer(difficulty=1)
        ex = {"interval_name": "perfect 5th"}
        result = t.check_answer(ex, "perfect 5th")
        assert result.correct

    def test_check_answer_wrong(self):
        t = IntervalTrainer(difficulty=1)
        ex = {"interval_name": "perfect 5th"}
        result = t.check_answer(ex, "major 3rd")
        assert not result.correct

    def test_accuracy(self):
        t = IntervalTrainer()
        t.check_answer({"interval_name": "unison"}, "unison")
        t.check_answer({"interval_name": "octave"}, "wrong")
        assert t.accuracy() == 0.5


class TestChordTrainer:
    def test_generate_exercise(self):
        ct = ChordTrainer(chord_types=["major", "minor"])
        ex = ct.generate_exercise(root=60)
        assert ex["chord_type"] in ["major", "minor"]
        assert 60 in ex["midi_notes"]

    def test_check_answer(self):
        ct = ChordTrainer()
        ex = {"chord_type": "minor"}
        assert ct.check_answer(ex, "minor").correct
        assert not ct.check_answer(ex, "major").correct

    def test_accuracy_empty(self):
        assert ChordTrainer().accuracy() == 0.0


class TestRhythmDictation:
    def test_generate_pattern(self):
        rd = RhythmDictation(difficulty=1)
        p = rd.generate_pattern()
        assert isinstance(p, list)
        assert all(isinstance(v, (int, float)) for v in p)

    def test_check_pattern_perfect(self):
        score = RhythmDictation.check_pattern([1, 1, 1, 1], [1, 1, 1, 1])
        assert score == 1.0

    def test_check_pattern_wrong_length(self):
        score = RhythmDictation.check_pattern([1, 1], [1, 1, 1])
        assert score == 0.0

    def test_check_pattern_partial(self):
        score = RhythmDictation.check_pattern([1, 1, 2], [1, 0.5, 2])
        assert 0.0 < score < 1.0


class TestSightReading:
    def test_generator_deterministic(self):
        g1 = SightReadingGenerator(seed=42)
        g2 = SightReadingGenerator(seed=42)
        ex1 = g1.generate(difficulty=2, n_bars=2)
        ex2 = g2.generate(difficulty=2, n_bars=2)
        assert ex1.notes == ex2.notes

    def test_exercise_fields(self):
        g = SightReadingGenerator(seed=0)
        ex = g.generate()
        assert len(ex.notes) > 0
        assert len(ex.durations) > 0
        assert 0.0 <= ex.difficulty <= 1.0

    def test_difficulty_estimator_empty(self):
        est = DifficultyEstimator()
        assert est.estimate([], [], 0, (4, 4)) == 0.0

    def test_difficulty_increases_with_range(self):
        est = DifficultyEstimator()
        narrow = est.estimate([60, 62, 64], [1, 1, 1])
        wide = est.estimate([40, 60, 80], [1, 1, 1])
        assert wide > narrow


class TestSpacedRepetition:
    def test_first_interval(self):
        sr = SpacedRepetition()
        rec = SkillRecord(name="scales")
        interval = sr.next_interval(rec, quality=4)
        assert interval == 1.0

    def test_failed_resets(self):
        sr = SpacedRepetition()
        rec = SkillRecord(name="scales", attempts=5, interval_days=10.0)
        interval = sr.next_interval(rec, quality=1)
        assert interval == 1.0

    def test_update_advances(self):
        sr = SpacedRepetition()
        rec = SkillRecord(name="scales")
        rec2 = sr.update(rec, quality=4, current_day=1.0)
        assert rec2.attempts == 1
        assert rec2.level > rec.level


class TestSkillTracker:
    def test_add_and_get(self):
        st = SkillTracker()
        st.add_skill("arpeggios")
        assert st.get_skill("arpeggios") is not None
        assert st.get_skill("missing") is None

    def test_record_practice(self):
        st = SkillTracker()
        rec = st.record_practice("scales", quality=4, current_day=0.0)
        assert rec.attempts == 1
        assert rec.successes == 1

    def test_due_skills(self):
        st = SkillTracker()
        st.record_practice("scales", quality=4, current_day=0.0)
        due = st.due_skills(current_day=2.0)
        assert len(due) == 1

    def test_overall_level(self):
        st = SkillTracker()
        st.record_practice("a", quality=5)
        st.record_practice("b", quality=5)
        assert st.overall_level() > 0.0


class TestPracticePlanner:
    def test_plan_with_skills(self):
        st = SkillTracker()
        st.record_practice("scales", quality=3, current_day=0.0)
        st.record_practice("chords", quality=2, current_day=0.0)
        pp = PracticePlanner(session_minutes=60)
        plan = pp.plan(st, current_day=2.0)
        assert len(plan) == 2
        assert all("skill" in p and "minutes" in p for p in plan)


class TestAssessment:
    def test_rubric_score(self):
        rubric = PerformanceRubric()
        ratings = {"pitch_accuracy": 3, "rhythm_accuracy": 4, "dynamics": 3,
                   "articulation": 3, "expression": 4}
        score = rubric.score(ratings)
        assert score > 0.0

    def test_normalized_score_range(self):
        rubric = PerformanceRubric()
        ratings = {"pitch_accuracy": 2, "rhythm_accuracy": 2, "dynamics": 2,
                   "articulation": 2, "expression": 2}
        ns = rubric.normalized_score(ratings)
        assert 0.0 <= ns <= 1.0

    def test_feedback_structure(self):
        rubric = PerformanceRubric()
        ratings = {"pitch_accuracy": 4}
        fb = rubric.feedback(ratings)
        assert len(fb) == 5
        assert fb[0]["criterion"] == "pitch_accuracy"

    def test_custom_criterion(self):
        c = RubricCriterion("intonation", weight=2.0)
        assert c.max_score() == 8.0

    def test_skill_assessment_trend(self):
        sa = SkillAssessment()
        for _ in range(3):
            sa.add_assessment({"pitch_accuracy": 1, "rhythm_accuracy": 1,
                               "dynamics": 1, "articulation": 1, "expression": 1})
        for _ in range(3):
            sa.add_assessment({"pitch_accuracy": 4, "rhythm_accuracy": 4,
                               "dynamics": 4, "articulation": 4, "expression": 4})
        assert sa.trend() > 0.0

    def test_mastery_levels(self):
        sa = SkillAssessment()
        assert sa.mastery_level() == "beginning"
        for _ in range(5):
            sa.add_assessment({"pitch_accuracy": 4, "rhythm_accuracy": 4,
                               "dynamics": 4, "articulation": 4, "expression": 4})
        assert sa.mastery_level() in ("advanced", "master")
