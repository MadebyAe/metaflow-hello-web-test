# Tasks App

A minimal task manager built with React, TypeScript, and Vite. Add tasks, set priorities, filter by status, and persist everything in localStorage.

## Features

- Add tasks via input field (Enter key or Add button)
- Mark tasks complete via checkbox
- Delete tasks with the × button
- Priority levels per task: none → low → medium → high (click the dot to cycle)
- Filter view: All / Active / Completed
- Clear all completed tasks at once
- Empty states for no tasks and no filter matches
- Persists to `localStorage` across page reloads
- Browser tab shows count of remaining tasks

## Tech Stack

- [React 18](https://react.dev/) with hooks
- [TypeScript](https://www.typescriptlang.org/) in strict mode
- [Vite](https://vitejs.dev/) for dev server and build
- Plain CSS — no UI libraries

## Requirements

- [Node.js](https://nodejs.org/) v20 or later
- npm v9 or later (bundled with Node.js v20)

## Local Development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Build

```bash
# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview
```

Output is written to the `dist/` directory.

## Project Structure

```
src/
  app.tsx                  # Root component — layout and filter state
  main.tsx                 # React entry point
  index.css                # Global styles
  types.ts                 # Shared types: Task, Priority, Filter
  hooks/
    use-tasks.ts           # Task state, localStorage sync, title sync
  components/
    task-input.tsx         # Controlled input form for adding tasks
    filters.tsx            # All / Active / Completed filter buttons
    task-list.tsx          # Renders task list or empty state
    task-item.tsx          # Individual task row
    footer.tsx             # Remaining count and clear completed
index.html
vite.config.ts
tsconfig.json
package.json
```

## Deployment

The app deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

Live URL: `https://madebyae.github.io/metaflow-hello-web-test/`

To enable Pages on a fresh fork:

1. Push to `main` to trigger the workflow
2. Go to **Settings → Pages → Source → Deploy from branch → gh-pages**