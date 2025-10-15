#!/usr/bin/env bash
set -euo pipefail
npm -C server i && npm -C server run dev &  # bg server
PID=$!
sleep 1
npm -C sdk/packages/client i && npm -C sdk/packages/client run build
node examples/sendEmail.mjs
kill $PID || true