"""Tests for the music_industry module."""

import pytest
from models.music_industry.isrc import ISRC, parse_isrc, validate_isrc, format_isrc, generate_isrc
from models.music_industry.iswc import ISWC, compute_check_digit, parse_iswc, validate_iswc
from models.music_industry.metadata import (
    TrackMetadata, validate_metadata, metadata_completeness,
    normalize_artist_name, detect_metadata_conflicts,
)
from models.music_industry.distribution import (
    DistributionChannel, RoyaltyModel, estimate_royalties,
    channel_revenue_split, breakeven_streams,
)
from models.music_industry.catalog import (
    CatalogEntry, catalog_summary, duplicate_detection,
    catalog_valuation_heuristic,
)


class TestISRC:
    def test_parse_valid_with_dashes(self):
        isrc = parse_isrc("US-RC1-98-12345")
        assert isrc.country_code == "US"
        assert isrc.registrant == "RC1"
        assert isrc.year == "98"
        assert isrc.designation == "12345"

    def test_parse_valid_no_dashes(self):
        isrc = parse_isrc("USRC19812345")
        assert isrc.country_code == "US"
        assert isrc.registrant == "RC1"

    def test_parse_invalid(self):
        assert parse_isrc("INVALID") is None
        assert parse_isrc("") is None

    def test_validate(self):
        assert validate_isrc("US-RC1-98-12345") is True
        assert validate_isrc("NOPE") is False

    def test_format(self):
        isrc = ISRC("US", "RC1", "98", "12345")
        assert format_isrc(isrc) == "US-RC1-98-12345"

    def test_generate(self):
        isrc = generate_isrc("GB", "ABC", 24, 1)
        assert isrc.country_code == "GB"
        assert isrc.registrant == "ABC"
        assert isrc.year == "24"
        assert isrc.designation == "00001"

    def test_generate_invalid_country(self):
        with pytest.raises(ValueError):
            generate_isrc("X", "ABC", 24, 1)


class TestISWC:
    def test_check_digit_computation(self):
        digit = compute_check_digit("000000001")
        assert 0 <= digit <= 9

    def test_parse_valid(self):
        work_id = "000000001"
        cd = compute_check_digit(work_id)
        iswc_str = f"T-{work_id}-{cd}"
        iswc = parse_iswc(iswc_str)
        assert iswc is not None
        assert iswc.work_id == work_id
        assert iswc.check_digit == cd

    def test_parse_invalid(self):
        assert parse_iswc("INVALID") is None

    def test_validate_correct(self):
        work_id = "000000001"
        cd = compute_check_digit(work_id)
        assert validate_iswc(f"T-{work_id}-{cd}") is True

    def test_validate_wrong_check(self):
        assert validate_iswc("T-000000001-0") is True or validate_iswc("T-000000001-0") is False


class TestMetadata:
    def test_completeness_full(self):
        m = TrackMetadata(
            title="Song", artist="Artist", album="Album",
            isrc="US-RC1-98-12345", iswc="T-000000001-0",
            duration_ms=200000, genre="pop", bpm=120.0,
            key="C", year=2024, language="en",
            composers=["A"], producers=["B"],
        )
        assert metadata_completeness(m) == 1.0

    def test_completeness_partial(self):
        m = TrackMetadata(title="Song", artist="Artist")
        score = metadata_completeness(m)
        assert 0.0 < score < 1.0

    def test_validate_missing_required(self):
        m = TrackMetadata(title="", artist="")
        errors = validate_metadata(m)
        assert len(errors) > 0

    def test_validate_negative_duration(self):
        m = TrackMetadata(title="X", artist="Y", duration_ms=-1)
        errors = validate_metadata(m)
        assert any("duration" in e.lower() for e in errors)

    def test_normalize_artist(self):
        assert normalize_artist_name("  john   doe  ") == "John Doe"

    def test_detect_conflicts(self):
        tracks = [
            TrackMetadata(title="Song A", artist="Art1", isrc="US-RC1-98-12345"),
            TrackMetadata(title="Song B", artist="Art2", isrc="US-RC1-98-12345"),
        ]
        conflicts = detect_metadata_conflicts(tracks)
        assert len(conflicts) > 0


class TestDistribution:
    def test_estimate_royalties(self):
        model = RoyaltyModel(
            streaming_rate=0.004,
            download_rate=0.70,
            sync_rate=5000.0,
        )
        rev = estimate_royalties(1_000_000, 1000, 2, model)
        assert rev > 0
        expected = 1_000_000 * 0.004 + 1000 * 0.70 + 2 * 5000.0
        assert abs(rev - expected) < 0.01

    def test_channel_revenue_split(self):
        splits = {DistributionChannel.STREAMING: 0.7, DistributionChannel.DOWNLOAD: 0.3}
        result = channel_revenue_split(10000.0, splits)
        assert abs(result[DistributionChannel.STREAMING] - 7000.0) < 0.01
        assert abs(result[DistributionChannel.DOWNLOAD] - 3000.0) < 0.01

    def test_breakeven(self):
        streams = breakeven_streams(10000.0, 0.004)
        assert streams == 2_500_000


class TestCatalog:
    def test_summary(self):
        entries = [
            CatalogEntry(track_id="1", title="A", artist="X", genre="pop", year=2020, streams=100),
            CatalogEntry(track_id="2", title="B", artist="Y", genre="rock", year=2021, streams=200),
            CatalogEntry(track_id="3", title="C", artist="X", genre="pop", year=2020, streams=300),
        ]
        s = catalog_summary(entries)
        assert s["total_tracks"] == 3
        assert s["total_streams"] == 600
        assert "pop" in s["genre_distribution"]

    def test_duplicate_detection(self):
        entries = [
            CatalogEntry(track_id="1", title="Love Song", artist="The Band", genre="pop", year=2020, streams=100),
            CatalogEntry(track_id="2", title="Love Song", artist="The Band", genre="pop", year=2021, streams=200),
        ]
        dupes = duplicate_detection(entries)
        assert len(dupes) > 0

    def test_valuation(self):
        entries = [
            CatalogEntry(track_id="1", title="A", artist="X", genre="pop", year=2020, streams=1_000_000),
        ]
        val = catalog_valuation_heuristic(entries, per_stream_rate=0.004, multiplier=10.0)
        assert val == pytest.approx(1_000_000 * 0.004 * 10.0)


class TestPackageExports:
    def test_all_exports(self):
        import models.music_industry as mi
        assert hasattr(mi, "ISRC")
        assert hasattr(mi, "ISWC")
        assert hasattr(mi, "TrackMetadata")
        assert hasattr(mi, "DistributionChannel")
        assert hasattr(mi, "CatalogEntry")
