#!/usr/bin/env bash
set -euo pipefail
echo "🔍 Verificando provenance..."
./provenance/verifiers/verify-hashes.sh
./provenance/verifiers/verify-blockchain.sh
