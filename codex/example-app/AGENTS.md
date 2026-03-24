# Repository Guidelines

## Project Structure & Module Organization

This app lives in `codex/example-app` and uses Next.js App Router with Bun. Route files live under `app/`. Public auth routes are grouped in `app/(auth)/`, authenticated notes routes are grouped in `app/(notes)/notes/`, and public shared-note routes live in `app/s/[token]/`. Global styling is defined in `app/globals.css`, and the root shell is defined in `app/layout.tsx`.

Keep new work inside this folder unless a change explicitly belongs at the repository root. Follow the existing route-group structure when adding features. Keep page-level files focused on route composition and move reusable UI into components once the app grows beyond simple scaffolding.

## Build, Test, and Development Commands

Use Bun for local development:

```bash
bun install
bun run dev
bun run build
bunx tsc --noEmit
```

`bun run dev` starts the local Next.js app. `bun run build` validates the production build. `bunx tsc --noEmit` is the fastest check for TypeScript and App Router typing issues when making structural changes.

## Coding Style & Naming Conventions

Use TypeScript, functional React components, and Next.js App Router conventions. Name route files with Next defaults such as `page.tsx`, `layout.tsx`, `loading.tsx`, and `not-found.tsx`. Prefer server components by default; add client components only when interactivity requires them.

Keep implementation aligned with `SPEC.MD`. For scaffold-only work, use static placeholder content and avoid introducing business logic prematurely. Use Tailwind utility classes for styling and preserve the existing acqua-leaning visual direction unless a task explicitly changes the design system.

## Testing Guidelines

At minimum, run:

```bash
bunx tsc --noEmit
```

When possible, also run:

```bash
bun run build
```

If a command fails due to the environment rather than the code, note that explicitly in the handoff. For route changes, verify that each affected path renders and that dynamic segments and special files such as `loading.tsx` and `not-found.tsx` are correctly placed.

## Commit & Pull Request Guidelines

Use short Conventional Commit-style messages, for example:

```text
feat: scaffold notes app routes
docs: add example app agent instructions
chore: refine app shell styling
```

Keep commits focused. In pull requests, summarize the user-visible route or layout changes, list the verification commands you ran, and call out any environment-specific build issues separately from code issues.
