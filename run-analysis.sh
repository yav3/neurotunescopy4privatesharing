#!/bin/bash

# Quick runner for the audio analysis pipeline
# Usage: ./run-analysis.sh [dry-run]

chmod +x scripts/run-analysis.sh
exec ./scripts/run-analysis.sh "$@"