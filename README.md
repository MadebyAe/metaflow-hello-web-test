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
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the local development server   |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
src/
  app.tsx                  # Root application component
  main.tsx                 # React entry point
  index.css                # Global styles
  types.ts                 # Shared TypeScript types (Task, Priority, Filter)
  use-tasks.ts             # (legacy) task hook — superseded by hooks/use-tasks.ts
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

Every push to `main` automatically deploys to GitHub Pages via the workflow at `.github/workflows/deploy.yml`.

To enable GitHub Pages on a new fork:

1. Go to **Settings → Pages**
2. Set **Source** to `Deploy from a branch`
3. Select the `gh-pages` branch
