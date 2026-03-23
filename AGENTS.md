# Repository Guidelines

## Project Structure & Module Organization

This repository is currently documentation-first. The main content lives in [README.md](./README.md), which collects guides and notes about coding and co-working agents. [CLAUDE.md](./CLAUDE.md) captures repository context for Claude-based tooling. There is no `src/`, `tests/`, or asset pipeline yet; add new material near the relevant section in `README.md` unless a new top-level guide is justified.

## Build, Test, and Development Commands

There is no build system or automated test suite configured today. Use lightweight validation commands while editing:

```bash
rg -n "Codex|slash commands|features" README.md
sed -n '1,220p' README.md
git diff -- README.md AGENTS.md
```

Use `rg` to find sections quickly, `sed` to inspect exact ranges, and `git diff` to verify documentation edits before committing.

## Coding Style & Naming Conventions

Write in concise, instructional Markdown. Prefer short sections, bullet lists, and fenced `bash` blocks for commands. Keep examples realistic and repository-specific. Use sentence case for explanatory text and title case for major headings. When adding files, prefer descriptive uppercase Markdown names such as `README.md` and `AGENTS.md`.

## Testing Guidelines

Testing here means documentation verification. Confirm commands are plausible, headings render correctly, and examples match current content. For larger edits, review the changed section in-context with `sed` or your editor preview. If a command is unverified or platform-specific, label it clearly in the text.

## Commit & Pull Request Guidelines

Recent history uses short Conventional Commit-style messages such as `feat: intro`, `feat: basic instructions`, and `chore: ignore`. Follow that pattern:

```text
feat: add codex slash command examples
docs: clarify cloud session notes
chore: clean up formatting
```

Pull requests should include a brief summary, the affected files, and screenshots only when formatting or rendered Markdown layout is important. Keep changes focused and explain any unverified commands or assumptions.
