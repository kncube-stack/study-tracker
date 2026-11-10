# Life in the UK Study Tracker

A 21-day study plan with daily task checks, practice scores, progress charts and a revision summary. This is an unofficial study aid. Check current requirements and approved study materials at https://www.gov.uk/life-in-the-uk-test. The study content is not automatically updated.

## Your progress

Progress is saved only in this browser. Clearing site data or using another browser does not transfer it. Export a save code regularly and keep it private. Codes are not encrypted.

Sync transfers daily scores and tasks, not the Summary checklist. Scan the QR code or paste a save code, review it, then explicitly confirm replacement. Cancel leaves current progress untouched. Older query-string links still work; new links keep progress in the URL fragment, which is not sent with the page request.

If storage cannot be read or written, or another tab changes progress, saving pauses with a visible warning. Export your current work before closing and reload to pick up the latest stored progress. Invalid stored data is never automatically erased. Restore a valid backup only when you intend to replace it.

## Development

Use Node.js 22 or newer.

- `npm ci`
- `npm run dev` (local development only)
- `npm test`
- `npm run lint`
- `npm run build`
- `npm run preview`

Vercel hosts the static `dist` build. `vercel.json` sets the app's security headers. No server, account, analytics or external data service is required. Keep tests in isolated browser contexts with synthetic data; never clear a real browser profile.
