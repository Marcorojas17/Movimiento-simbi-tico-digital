#!/usr/bin/env bash
set -euo pipefail
EXPECTED="41a3683bbf83296eeb45da9b0e0ea5a7c095e78b493772e79520a92dbc39f4c3"
ASSET="provenance/2607086319439/original/VID-20260708-WA0038.mp4"
if [ ! -f "$ASSET" ]; then echo "⚠️  Video no encontrado"; exit 0; fi
ACTUAL=$(sha256sum "$ASSET" | awk "{print \$1}")
[ "$EXPECTED" = "$ACTUAL" ] && echo "✅ Hash OK" || { echo "❌ Hash mismatch"; exit 1; }
