#!/usr/bin/env bash
# ============================================================
# Verificación de la transacción en blockchain Ethereum
# ============================================================
set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

TX_HASH="0x8ca8e84e1258abac9acb29d14d25114e4775d782ecfda51ae29933247ed2970e"

echo "⛓️  Verificando transacción en Ethereum..."
echo "   Hash: $TX_HASH"
echo ""

RESPONSE=$(curl -s "https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=$TX_HASH")

if echo "$RESPONSE" | grep -q '"result":null'; then
  echo -e "${RED}❌ Transacción no encontrada.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Transacción confirmada en Ethereum.${NC}"
echo ""
echo "🔗 Ver en Etherscan:"
echo "   https://etherscan.io/tx/$TX_HASH"
