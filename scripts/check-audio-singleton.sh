#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Checking for audio singleton compliance..."

# Check for raw <audio> tags (should only be in AudioEngine)
if grep -R "<audio" src --exclude-dir=node_modules 2>/dev/null | grep -v "AudioEngine"; then
  echo "❌ Found raw <audio> tags outside AudioEngine. Remove them."
  exit 1
fi

# Check for new Audio() constructors (should only be in AudioEngine)
if grep -R "new Audio(" src --exclude-dir=node_modules 2>/dev/null | grep -v "AudioEngine"; then
  echo "❌ Found extra Audio() constructors. Use AudioEngine singleton only."
  exit 1
fi

echo "✅ Audio singleton respected."