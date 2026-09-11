.PHONY: help install build test lint verify clean

help:
	@echo "🏛️  KRONOS — Movimiento Co-Creatividad Simbiótica"

install:
	pnpm install

build:
	pnpm build

verify:
	./provenance/verifiers/verify-hashes.sh

clean:
	rm -rf node_modules dist .turbo
