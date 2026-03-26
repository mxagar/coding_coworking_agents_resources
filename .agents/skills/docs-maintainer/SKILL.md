---
name: docs-maintainer
description: Use when the user asks to improve or expand repository documentation with concise, accurate, actionable Markdown edits.
---

# Purpose
Use this skill when the user asks to improve or expand repository documentation (README, guides, onboarding notes) with accurate, concise, actionable Markdown.

# When to use
- User asks to update `README.md`, `AGENTS.md`, or other docs
- User asks for examples, quickstart steps, or command snippets
- User asks for doc cleanup, structure, or consistency fixes

# When not to use
- Pure code implementation requests with no documentation scope
- Tasks requiring external research that is not requested

# Inputs expected
- Target file(s), if specified
- User intent (add section, rewrite, fix structure, etc.)
- Existing style conventions in repository docs

# Workflow
1. Read the target documentation and repository instructions (especially `AGENTS.md`).
2. Identify the minimum focused change that satisfies the request.
3. Edit docs in-place, preserving existing voice and heading structure.
4. Validate:
   - Headings are consistent
   - Commands are plausible and copy-pasteable
   - Examples match repository context
5. Summarize what changed and note any assumptions/unverified commands.

# Style rules
- Keep prose concise and instructional.
- Prefer short sections and flat bullet lists.
- Use fenced code blocks with language hints (`bash`, `powershell`, `json`).
- Avoid fluff and generic boilerplate.

# Output contract
- Provide:
  - Files changed
  - Short change summary
  - Any follow-up suggestions (only if useful)

# Guardrails
- Do not invent files/tools that don’t exist in the repo.
- Do not claim commands were executed unless actually run.
- If uncertain, state assumptions explicitly.

# Example invocation
User: “Add a section to README with ripgrep tips for finding TODOs.”

Expected behavior:
- Locate best placement in `README.md`
- Add practical `rg` examples
- Keep formatting aligned with current doc style
- Return concise summary with file reference
