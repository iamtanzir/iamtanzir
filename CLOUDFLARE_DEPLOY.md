# Deploy the live clock (Cloudflare Worker)

The file `cloudflare-worker.js` returns your exact clock design as an SVG, but
with the **current Dhaka time rendered on every request** (via time.now API).
Unlike GitHub README images (which are cached snapshots), a Worker URL is
re-fetched on each page view, so the time stays live.

## Deploy (one-time)

1. Install Wrangler:
   ```sh
   npm install -g wrangler
   ```
2. Login:
   ```sh
   wrangler login
   ```
3. From this repo folder:
   ```sh
   wrangler deploy cloudflare-worker.js --name live-clock
   ```
   (Or rename the file to `index.js` and add a `wrangler.toml`.)

4. You'll get a URL like:
   `https://live-clock.<your-subdomain>.workers.dev`

## Wire it into the README

Replace the clock image line in `README.md`:

```markdown
<img src="https://live-clock.<your-subdomain>.workers.dev" alt="Live Dhaka Digital Clock" width="350" />
```

The Worker sets `Cache-Control: no-cache, no-store, must-revalidate`, so GitHub
re-fetches it on every README view and the time stays live.
