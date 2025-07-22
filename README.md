# SvelteKit + Cloudflare Pages Library Test Template

🚨 **CRITICAL**: Many popular libraries cause **SILENT HYDRATION FAILURE** on Cloudflare Pages. This framework helps you test libraries BEFORE deploying broken apps to production.

## The Problem

Libraries like `lucide-svelte` can cause your SvelteKit app to:
- ❌ Look perfect but be completely non-interactive
- ❌ Fail silently with NO error messages
- ❌ Work locally but break on Cloudflare Pages
- ❌ Leave users with a dead app

## Quick Start

```bash
# Clone this template
git clone https://github.com/yourusername/sveltekit-cf-lib-test-template
cd sveltekit-cf-lib-test-template

# Install dependencies
npm install

# Test a library
npm run test:library lucide-svelte
```

## Testing Your Libraries

1. **Run the test**:
   ```bash
   ./scripts/test-library.sh your-library-name
   ```

2. **Check results**:
   - 🟢 **SAFE** - Use without worry
   - 🟡 **CONDITIONAL** - Requires specific setup
   - 🔴 **BROKEN** - DO NOT USE

3. **View detailed results** in the console output

## Known Library Status

| Library | Status | Notes |
|---------|--------|-------|
| lucide-svelte | 🔴 | Causes silent hydration failure |
| heroicons | 🟢 | Static SVGs, safe to use |
| date-fns | 🟢 | Pure functions, no issues |
| chart.js | 🟡 | Requires client-only rendering |

Full database: [docs/LIBRARY_DATABASE.md](docs/LIBRARY_DATABASE.md)

## Add Hydration Monitoring to Your App

Protect your production app:

```html
<!-- Add to your app.html -->
<script>
  setTimeout(() => {
    if (typeof window.__SVELTEKIT__ === 'undefined') {
      // Alert your monitoring service
      console.error('🚨 HYDRATION FAILED! App is broken!');
    }
  }, 5000);
</script>
```

## Contributing

1. Test your libraries using this template
2. Add results to `docs/LIBRARY_DATABASE.md`
3. Submit a PR
4. Help save other developers from silent failures!

## The Full Story

Read about the 12-hour debugging journey: [blog/cloudflare-sveltekit-hydration-guide.md](blog/cloudflare-sveltekit-hydration-guide.md)

## License

MIT - Help the community avoid broken production apps!