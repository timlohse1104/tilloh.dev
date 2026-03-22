#!/bin/bash
set -e

# Load E2E test environment variables if available
if [ -f "$(dirname "$0")/../.env.test" ]; then
  export $(grep -v '^#' "$(dirname "$0")/../.env.test" | xargs)
fi

# Start the backend with E2E-specific environment variables
cd "$(dirname "$0")/../../backend"

SERVER_ADDRESS="${E2E_SERVER_ADDRESS:-localhost}" \
GLOBAL_PREFIX="v1" \
PORT="${E2E_PORT:-61155}" \
MONGO_DB_URL="${E2E_MONGO_DB_URL:-mongodb://localhost/tilloh-dev-e2e}" \
ADMIN_IDENTIFIER="${E2E_ADMIN_IDENTIFIER:-e2e-admin-identifier}" \
OCR_SPACE_URL="${E2E_OCR_SPACE_URL:-https://api.ocr.space/parse/image}" \
OCR_SPACE_API_KEY="${E2E_OCR_SPACE_API_KEY:-e2e-test-key}" \
SPOTIFY_CLIENT_ID="${E2E_SPOTIFY_CLIENT_ID:-e2e-spotify-id}" \
SPOTIFY_CLIENT_SECRET="${E2E_SPOTIFY_CLIENT_SECRET:-e2e-spotify-secret}" \
node dist/apps/tilloh-dev/main.js
