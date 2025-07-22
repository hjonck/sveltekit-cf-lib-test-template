#!/bin/bash

set -e

echo "🚀 Deploying current state to Cloudflare Pages for testing..."

npm run build

PROJECT_NAME="sveltekit-cf-test-$(date +%s)"
npx wrangler pages deploy .svelte-kit/cloudflare --project-name="$PROJECT_NAME"

echo "✅ Deployed as: $PROJECT_NAME"
echo "📝 To delete: npx wrangler pages project delete $PROJECT_NAME --yes"