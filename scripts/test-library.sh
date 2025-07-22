#!/bin/bash

set -e

LIBRARY_NAME=$1
if [ -z "$LIBRARY_NAME" ]; then
  echo "Usage: ./scripts/test-library.sh <library-name>"
  echo "Example: ./scripts/test-library.sh lucide-svelte"
  exit 1
fi

echo "🧪 Testing library: $LIBRARY_NAME"
echo "================================"

# Clean previous test
echo "🧹 Cleaning previous build..."
rm -rf .svelte-kit

# Install the library
echo "📦 Installing $LIBRARY_NAME..."
npm install "$LIBRARY_NAME" --save

# Build
echo "🔨 Building SvelteKit app..."
npm run build

# Create unique project name
PROJECT_NAME="lib-test-$(echo $LIBRARY_NAME | tr '/@' '-' | tr -d ' ')-$(date +%s)"
echo "🚀 Deploying to Cloudflare Pages as: $PROJECT_NAME"

# Deploy
OUTPUT=$(npx wrangler pages deploy .svelte-kit/cloudflare --project-name="$PROJECT_NAME" 2>&1)
echo "$OUTPUT"

# Extract URL
URL=$(echo "$OUTPUT" | grep -oE 'https://[a-z0-9-]+\.pages\.dev' | head -1)

if [ -z "$URL" ]; then
  echo "❌ Failed to get deployment URL"
  exit 1
fi

echo "✅ Deployed to: $URL"

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
sleep 10

# Run hydration test
echo "🔬 Running hydration test..."
node tests/hydration-test.js "$URL" "$LIBRARY_NAME"

# Cleanup deployment
echo "🧹 Cleaning up test deployment..."
npx wrangler pages project delete "$PROJECT_NAME" --yes || true

echo "✅ Test complete!"