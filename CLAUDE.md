# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

A collection of guides, working examples, and reusable patterns for AI coding agent frameworks: Claude Code, OpenAI Codex, and OpenCode. Also includes MCP (Model Context Protocol) server examples and an autonomous agent loop implementation (Ralph).

## Environment Setup

```bash
conda env create -f conda.yaml   # creates 'agents' environment (Python 3.12)
conda activate agents
pip-compile requirements.in      # regenerate requirements.txt after editing requirements.in
pip-sync requirements.txt
```

Credentials go in `.env` (git-ignored): `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`.

## Running MCP Servers

Each MCP example is a standalone FastMCP server under `mcp/`:

```bash
cd mcp/calculator_mcp
mcp run server.py --transport streamable-http --port 8001

cd mcp/leave_manager_mcp
mcp run server.py

cd mcp/project_management_server
mcp run server.py
```

## Running the Example Next.js App (Codex)

The `codex/example-app/` uses Bun as runtime:

```bash
cd codex/example-app
bun install
bun run dev      # http://localhost:3000
bun run build
bun run lint     # oxlint
bun run format   # oxfmt
```

## Repository Structure

```
claude/        # Claude Code guide (README.md) + skills, custom agents, Ralph loop
codex/         # Codex guide (README.md) + example Next.js app + skills
opencode/      # OpenCode guide (README.md)
mcp/           # MCP guide (README.md) + 3 working FastMCP server examples
anthropic_api/ # Anthropic API resource links
openai_api/    # OpenAI API resource links
```

## Architecture Notes

**Documentation-first**: Each subdirectory's README.md is the canonical reference. No separate wiki. New material goes into the relevant README unless it warrants a new top-level section.

**MCP examples** follow a consistent pattern: a single `server.py` using `FastMCP` with tools (callable functions), resources (read-only URIs), and prompts (template generators). Each has its own `pyproject.toml` with `mcp[cli]>=1.26.0`.

**Ralph** (`claude/ralph/`) is an autonomous coding agent loop. It reads a task list from `prd.json`, implements features, verifies via Playwright MCP, marks tasks done, and commits — driven by `ralph.sh` with `claude --dangerously-skip-permissions`.

**Skills** (`claude/.claude/skills/`, `codex/.agents/skills/`) are reusable `SKILL.md` prompt files that encode domain knowledge (e.g., `bun-first`, `web-security`, `modern-best-practice-nextjs`).

## Commit Style

Conventional Commits: `feat:`, `docs:`, `fix:`, `chore:`. Keep messages concise.
