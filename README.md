# Tasks

A minimal task management app built with React, TypeScript, and Vite.

## Features

- Add tasks via input field (button click or Enter key)
- Mark tasks complete via checkbox
- Delete tasks via × button
- Priority levels per task (none / low / medium / high) — click the dot to cycle
- Filter view: All / Active / Completed
- Clear all completed tasks at once
- Empty states for no tasks and no filter matches
- Persists tasks to `localStorage`
- Browser tab title shows remaining task count: `(N) Tasks`

## Live App

[https://madebyae.github.io/metaflow-hello-web-test/](https://madebyae.github.io/metaflow-hello-web-test/)

## Requirements

- [Node.js](https://nodejs.org/) v20 or later
- npm v10 or later (included with Node.js v20)

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the test suite |

## Project Structure

```
src/
  app.tsx                  # Root application component
  main.tsx                 # React entry point
  index.css                # Global styles
  types.ts                 # Shared TypeScript types (Task, Priority, Filter)
  use-tasks.ts             # Re-export shim → hooks/use-tasks.ts
  components/
    task-input.tsx         # Add-task form
    task-list.tsx          # Renders the list or empty state
    task-item.tsx          # Individual task row
    filters.tsx            # All / Active / Completed filter buttons
    footer.tsx             # Remaining count + Clear completed
  hooks/
    use-tasks.ts           # Task state, localStorage persistence, derived counts
index.html
vite.config.ts
tsconfig.json
package.json
```

## Deployment

Every push to `main` automatically deploys to GitHub Pages via `.github/workflows/deploy.yml`.

To enable GitHub Pages on a new fork:
1. Go to **Settings → Pages**
2. Set **Source** to `Deploy from a branch`
3. Select the `gh-pages` branch

---

## Security Audit

**Date:** 2025  
**Scope:** Full codebase — source, configuration, CI/CD workflows, dependencies

---

### Summary

| Severity | Count | Status |
|----------|-------|--------|
| High     | 0     | —      |
| Medium   | 3     | Fixed  |
| Low      | 3     | Fixed  |
| Info     | 2     | Noted  |

---

### Findings

---

#### [MEDIUM] Unvalidated `localStorage` deserialization crashes the app

**File:** `src/hooks/use-tasks.ts`  
**Status:** Fixed

`JSON.parse` on localStorage data with no error handling causes an uncaught exception if the stored value is malformed (corrupted, manually edited, written by a different app version, or truncated by a quota error). This silently crashes the React tree with no recovery path.

Additionally, parsed data was cast directly to `Task[]` without structural validation, meaning a stored object with incorrect field types (e.g. `priority: 42`) would propagate invalid state throughout the app.

**Fix applied:**
- Wrapped `JSON.parse` and `localStorage.setItem` in `try/catch` blocks; both return/no-op gracefully on failure.
- Added an `isValidTask` guard that validates the shape and type of every deserialized object before it enters state. Invalid entries are silently dropped rather than crashing.

```ts
function isValidTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'number' &&
    typeof obj.text === 'string' &&
    typeof obj.done === 'boolean' &&
    ['none', 'low', 'medium', 'high'].includes(obj.priority as string)
  );
}
```

---

#### [MEDIUM] Duplicate `permissions` key in deploy workflow causes silent misconfiguration

**File:** `.github/workflows/deploy.yml`  
**Status:** Fixed

The workflow declared `permissions: contents: write` twice at the top level. YAML parsers treat duplicate keys as last-write-wins, meaning the intended value could be silently overridden by a future edit that reorders the block. The GitHub Actions runner accepted the file, but the behaviour was undefined.

**Fix applied:** Removed the duplicate block, leaving a single `permissions` declaration.

---

#### [MEDIUM] Third-party GitHub Actions referenced by mutable version tags

**Files:** `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`  
**Status:** Fixed

Actions pinned to floating tags (`@v4`, `@v3`) are vulnerable to tag mutation. A compromised or updated action at that tag would automatically execute in this repository's CI pipeline with `contents: write` permission — enough to push malicious commits or modify release artifacts.

**Fix applied:** All third-party actions are now pinned to immutable commit SHAs with the version tag preserved as a comment for human readability.

```yaml
# Before
- uses: actions/checkout@v4

# After
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
```

Pinned SHAs:
| Action | Tag | SHA |
|--------|-----|-----|
| `actions/checkout` | v4.2.2 | `11bd71901bbe5b1630ceea73d27597364c9af683` |
| `actions/setup-node` | v4.1.0 | `39370e3970a6d050c480ffad4ff0ed4d3fdee5af` |
| `peaceiris/actions-gh-pages` | v3.9.3 | `4f9cc6602d3f66b9c108549d231e62369c1b3ca5` |

---

#### [LOW] Prop name mismatch between `Footer` and `App` causes a silent runtime break

**Files:** `src/components/footer.tsx`, `src/app.tsx`  
**Status:** Fixed

`App` passed `onClear` but `Footer` declared `onClearCompleted`. TypeScript did not catch this because the prop was typed identically in both places and the mismatch was in the name only. The "Clear completed" button would call `undefined` at runtime and silently do nothing.

**Fix applied:** Standardised on `onClear` in both files to match the call site in `App`.

---

#### [LOW] `npm install` used in CI instead of `npm ci`

**Files:** `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`  
**Status:** Fixed

`npm install` can silently upgrade or modify `package-lock.json` during CI runs, meaning builds may use different dependency versions than what was tested locally or committed. This undermines the purpose of a lockfile and can introduce unexpected behaviour.

**Fix applied:** Both workflows now use `npm ci`, which installs exactly what is in `package-lock.json` and fails if there is any mismatch.

---

#### [LOW] Dead ESLint config file

**File:** `eslint.config.ts`  
**Status:** Noted — safe to delete

A `eslint.config.ts` file coexists with the authoritative `eslint.config.js`. ESLint resolves `.js` first; the `.ts` file is never loaded. It references `eslint-plugin-react-refresh` (present in devDependencies) while the active `.js` config does not, creating a false impression of what rules are enforced.

**Recommendation:** Delete `eslint.config.ts`. If `react-refresh` lint rules are desired, add the plugin to `eslint.config.js`.

---

#### [INFO] XSS — not a vulnerability in this codebase

All user-supplied content (task text) is rendered via React JSX as text nodes, never via `dangerouslySetInnerHTML` or direct DOM manipulation. React escapes all interpolated values by default. No XSS surface exists in the current code.

This remains safe as long as no future change introduces `dangerouslySetInnerHTML`, `eval`, or raw `innerHTML` assignment.

---

#### [INFO] `localStorage` stores task text in plaintext

Task data (including all task text entered by the user) is stored unencrypted in `localStorage`, which is accessible to any JavaScript running on the same origin, including browser extensions.

This is the standard, expected behaviour for a client-side productivity app with no authentication model. It is noted here because it becomes relevant if:
- The app is ever embedded in a shared origin
- Future features handle sensitive data (e.g. notes with PII)

No action required for the current scope.

---

### Recommendations for Future Work

| Priority | Recommendation |
|----------|---------------|
| Medium | Add a `Content-Security-Policy` header on the GitHub Pages deployment to restrict script sources. |
| Medium | Enable [Dependabot](https://docs.github.com/en/code-security/dependabot) version updates for both `npm` and `github-actions` ecosystems. |
| Low | Add `npm audit` as a CI step to catch newly disclosed vulnerabilities in dependencies automatically. |
| Low | Delete `eslint.config.ts` to eliminate the dead config confusion. |