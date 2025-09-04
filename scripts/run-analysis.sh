#!/bin/bash

# Production-grade audio validation and analysis pipeline
# Usage: ./scripts/run-analysis.sh [dry-run]

set -e

echo "🎵 NeuroTunes Audio Analysis Pipeline"
echo "===================================="

# Check dependencies
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is required but not installed. Please install:"
    echo "   Ubuntu/Debian: sudo apt-get install ffmpeg"
    echo "   macOS: brew install ffmpeg"
    echo "   Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required (current: $(node -v))"
    exit 1
fi

# Environment setup
export SUPABASE_URL="https://pbtgvcjniayedqlajjzz.supabase.co"
export DEFAULT_BUCKET="neuralpositivemusic"
export CANONICAL_PREFIX="tracks"
export CONCURRENCY="6"

# Check for service role key
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required"
    echo "   Please set it with your Supabase service role key"
    exit 1
fi

# Set dry run mode if requested
if [ "$1" = "dry-run" ]; then
    export DRY_RUN="1"
    echo "🔍 Running in DRY RUN mode (no database changes)"
else
    echo "⚡ Running in LIVE mode (will modify database)"
fi

echo ""
echo "Configuration:"
echo "  SUPABASE_URL: $SUPABASE_URL"
echo "  DEFAULT_BUCKET: $DEFAULT_BUCKET"
echo "  CANONICAL_PREFIX: $CANONICAL_PREFIX"
echo "  CONCURRENCY: $CONCURRENCY"
echo "  DRY_RUN: ${DRY_RUN:-false}"
echo ""

# Run the analysis
echo "🚀 Starting analysis..."
npx tsx scripts/validate-and-analyze.ts

echo ""
echo "✅ Analysis complete! Check the generated report file for details."