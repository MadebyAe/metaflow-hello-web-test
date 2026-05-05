# GitHub Pages Deployment Fix

## Context

The React migration (`epic-744c7c04`) generated a deploy workflow at
`.github/workflows/deploy.yml` that builds with Vite and pushes to the `gh-pages` branch.
The pipeline is failing at the push step due to two configuration issues.

## Issues

### 1. Workflow permissions — 403 on push

`github-actions[bot]` is denied write access to push to `gh-pages`.

**Fix:** Settings → Actions → General → Workflow permissions → **Read and write permissions** → Save

### 2. Pages source set to wrong branch

Pages is currently set to deploy from `main`. It should read from `gh-pages`
(the branch the workflow pushes the built `dist/` to).

**Fix:** Settings → Pages → Source → Branch → **gh-pages** → Save

### 3. TypeScript error in app.tsx

`npm run build` fails with:

```
src/app.tsx(43,9): error TS2322:
Property 'onClearCompleted' does not exist on type 'FooterProps'.
```

`app.tsx` passes `onClearCompleted` but `footer.tsx` expects `onClear`.

**Fix:** Rename the prop in `app.tsx` from `onClearCompleted` to `onClear`.

## Live URL

Once all three issues are resolved and the workflow runs successfully:

```
https://madebyae.github.io/metaflow-hello-web-test/
```
