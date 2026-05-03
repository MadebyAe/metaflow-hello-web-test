# React Migration

Migrate this plain HTML/CSS/JS task app to React + Vite. Preserve every existing feature exactly.

## Tech Stack
- React 18 with hooks (no class components)
- Vite as the build tool
- TypeScript (strict mode)
- Plain CSS (migrate existing style.css as-is, no CSS modules)
- No external state management — useState and useEffect only
- No UI libraries — keep the existing visual design

## Existing Features to Preserve
- Add a task via input + button (or pressing Enter)
- Mark tasks complete via checkbox
- Delete tasks via × button
- Priority dot on each task (none / low / medium / high) — click to cycle
- Filter buttons: All / Active / Completed
- Clear completed button (only visible when completed tasks exist)
- Empty state: "No tasks yet — add one above" / "No tasks match this filter"
- localStorage persistence (tasks: [{ id, text, done, priority }])
- Browser tab title: "(N) Tasks" when tasks remain, "Tasks" when none

## Target Structure
src/
  app.tsx
  components/
    task-input.tsx
    task-list.tsx
    task-item.tsx
    filters.tsx
    footer.tsx
  hooks/
    use-tasks.ts
  types.ts          ← shared types: Task, Priority, Filter
  index.css
  main.tsx
index.html
package.json
tsconfig.json
vite.config.ts

## GitHub Pages Deployment

Set up automatic deployment so every merge to main publishes the app live.

### vite.config.ts
Set `base` to the repo name so assets resolve correctly on the Pages subdomain:
```ts
base: '/metaflow-hello-web-test/'
```

### .github/workflows/deploy.yml
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

After the first deploy, enable GitHub Pages in the repo settings:
**Settings → Pages → Source → Deploy from branch → gh-pages**

Live URL: `https://madebyae.github.io/metaflow-hello-web-test/`

## Acceptance Criteria
- All existing features work identically to the current version
- App runs with: npm install && npm run dev
- TypeScript compiles with no errors: npm run build
- No console errors on load
- Old files (app.js, style.css) replaced by the React + TypeScript structure
- `.github/workflows/deploy.yml` created and triggers on push to main
- `vite.config.ts` includes correct `base` for GitHub Pages
