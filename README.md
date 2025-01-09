### Structure

This repro has two components:

1. The Next.js app -- it needs to trigger side effects in `waitUntil`/`after`. We observe those using
2. The pinger -- an instance of `pinger.mjs` running somewhere accessible publicly (because the Next.js app needs to send requests to it). Note that this is stateful - it keeps a list of recent requests in memory.

### Running the repro

- Deploy the `pinger.mjs` server at some public URL. in the next.js app, set the `PINGER_BASE_URL` env var to that (including 'http://')
- Deploy the Next.js app to vercel
- Visit `/`
- From there each link will trigger a different side-effect in middleware (reading `middleware.ts` will make this make more sense)
- Go to `/logs` to see if/when the pings were performed (it auto-refreshes)
- Observe that pings from `waitUntil`/`event.waitTuntil` and `after` (which uses `waitUntil`) happen with a big delay or not at all
  - Notably, sometimes we'll only receive the ping when _another_ ping was triggered, like something gets stuck somewhere. the "instant" link is good for this
