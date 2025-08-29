#!/usr/bin/env bash
set -euo pipefail
grep -R "<audio" -n src | grep -v "AudioEngine" && {
  echo "❌ Found raw <audio> tags outside AudioEngine. Remove them."; exit 1;
}
grep -R "new Audio(" -n src | grep -v "AudioEngine" && {
  echo "❌ Found extra Audio() constructors. Use AudioEngine singleton only."; exit 1;
}
echo "✅ Audio singleton respected."