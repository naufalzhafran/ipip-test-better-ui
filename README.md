# IPIP personality app

React + TypeScript + Vite implementation of both the 120-item and 300-item IPIP-NEO inventories.

## Deploy to Vercel

[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnaufalzhafran%2Fipip-test-better-ui)

Alternatively, import `naufalzhafran/ipip-test-better-ui` from Vercel's **Add New → Project** screen. Keep the root directory at the repository root and click **Deploy**. No environment variables or backend setup are required. For a private repository, allow Vercel access to that repository when importing it.

The checked-in `vercel.json` selects the Vite preset, installs with `npm ci`, builds with `npm run build`, and serves `dist/`. It also handles single-page app fallback routing. `package.json` selects Node.js 22.x. Git integration can redeploy future pushes automatically.

Reference: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).

## Run

Use Node.js 22.x and npm.

```sh
npm ci
npm run dev
```

`npm run build` produces a static site in `dist/`. `npm test` checks inventory completeness, reverse scoring, extremes, neutral scores, incomplete responses, saved-state validation, and explanation coverage for every question and scale.

## Features

- Both lengths, five domains, and 30 facets.
- Individual plain-language reading help for every statement in both versions, plus simpler explanations of all five answer choices.
- Meaning, everyday examples at both ends of the scale, and reflection prompts for every trait and facet.
- Share the complete profile and all individual responses through a URL, without a backend.
- One question at a time with 1–5 keyboard shortcuts and Enter to continue.
- Device-local saved progress, pause/resume, review, and confirmed replacement of an existing test.
- Light and dark themes, responsive controls, native modal focus handling.
- Raw scores, clearly labeled 0–100 scale positions, facet details, and JSON export. Standard browser printing uses a dedicated stylesheet and expands all facets; print/PDF availability depends on the host browser.

## Sources and interpretation

Items are public-domain IPIP material, imported with wording and scoring polarity intact from:

- https://ipip.ori.org/30FacetNEO-PI-RItems.htm
- https://ipip.ori.org/newNEOKey.htm
- https://ipip.ori.org/newScoringInstructions.htm
- Original site: https://drj60472.virtualave.net/IPIP/index.html

The original CGI scripts and population norm tables are not bundled. This app does **not** claim to reproduce the original site's age/sex normed percentiles or narrative reports. Scale position = (raw score − minimum possible) / (maximum possible − minimum possible) × 100. Domains sum all six facets. Item order is adapted to interleave facets and domains.

Reading aids and result explanations are editorial additions in `src/explanations.ts`. They do not replace the original statements or scoring keys. Their effect on how people answer has not been validated. Result examples describe possible tendencies, not personalized predictions or diagnostic conclusions.

Open `/?preview=results` for a visibly labeled sample profile. This uses synthetic responses in memory and does not read or overwrite saved questionnaire answers.

## Share results

On a completed profile, choose **Share full results**, then **Copy link**. A recipient opens the full results directly, including all five traits, 30 facets, explanations, and a read-only list of every answer. Opening a shared link does not replace the recipient's saved test. Use the deployed site when sharing between devices; localhost links work only on the machine running the app.

The versioned URL fragment contains the test length, sample/profile flag, and one digit per response. No server or database is required. URL fragments are not included in the HTTP page request, but the contents are **not encrypted or access-controlled**: anyone with the link can read the answers, and a copied link cannot be revoked. Treat it like sharing the full response sheet. Explanations are rendered by the current app version rather than frozen inside the link.

`src/sharing.ts` implements the format and rejects malformed, truncated, unsupported-version, and out-of-range payloads. Keep the version-1 item order and scoring semantics stable; introduce a new format version if they change. Sample links retain their sample label.

The inventory is for reflection and education, not diagnosis. No answers are sent to a server; saved answers remain in localStorage for the current browser profile. Google Fonts loads the two typefaces without sending questionnaire answers. No account, telemetry, or backend is included. Clear site storage to remove a saved test, or begin a new test to replace it.

The import script expects source HTML at `/tmp/ipip-key120.html` and `/tmp/ipip-key300.html` and uses Python BeautifulSoup. It is a maintenance tool; running the app does not require Python or access to the source site.
