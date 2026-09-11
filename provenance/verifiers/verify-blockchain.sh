#!/usr/bin/env bash
set -euo pipefail
TX="0x8ca8e84e1258abac9acb29d14d25114e4775d782ecfda51ae29933247ed2970e"
echo "Verificando Ethereum..."
curl -s "https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=$TX" | grep -q '"result":null' && { echo "❌ No encontrada"; exit 1; } || echo "✅ Confirmada: https://etherscan.io/tx/$TX"
