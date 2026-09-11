#!/usr/bin/env bash
set -euo pipefail
IDFILE="certificate/idfile.json"
ASSET="assets/VID-20260708-WA0038.mp4"
if [ ! -f "$IDFILE" ]; then echo "❌ No $IDFILE"; exit 1; fi
if [ ! -f "$ASSET" ]; then echo "⚠️ No $ASSET, omito"; exit 0; fi
EXPECTED=$(python3 -c "import json; print(json.load(open('$IDFILE'))['sha256'])")
ACTUAL=$(sha256sum "$ASSET" | awk '{print $1}')
if [ "$EXPECTED" != "$ACTUAL" ]; then echo "❌ Hash mismatch $EXPECTED vs $ACTUAL"; exit 1; fi
echo "✅ Hash verificado 2607086319439"
