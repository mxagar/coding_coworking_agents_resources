# Claude Code

This directory contains resources related to Anthropic's Claude Code, a powerful tool for interacting with codebases using natural language.

These are the sources I have used:

- [**Udemy: Claude Code - The Practical Guide (Max Schwarzmüller)**](https://www.udemy.com/course/claude-code-the-practical-guide/)
- [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action)
- [Introduction to Claude Cowork](https://anthropic.skilljar.com/introduction-to-claude-cowork)
- [Claude 101](https://anthropic.skilljar.com/claude-101)
- [Claude Code Documentation](https://code.claude.com/docs)
- [Claude Code Common Workflows](https://code.claude.com/docs/en/common-workflows)
- [Claude API Quickstarts](https://github.com/anthropics/claude-quickstarts/tree/main)
- [Building with the Claude API](https://anthropic.skilljar.com/claude-with-the-anthropic-api)

Table of contents:

- [Claude Code](#claude-code)
  - [1. Getting Started](#1-getting-started)
    - [Installation and Getting Started](#installation-and-getting-started)
    - [Claude Internal Tools](#claude-internal-tools)
    - [Configuration](#configuration)
    - [Permissions Management](#permissions-management)
  - [2. Key Features and Efficient Usage](#2-key-features-and-efficient-usage)
  - [3. Beyond Local CLI Usage](#3-beyond-local-cli-usage)

## 1. Getting Started

I mainly followed the course 

[Udemy: Claude Code - The Practical Guide (Max Schwarzmüller)](https://www.udemy.com/course/claude-code-the-practical-guide/)

which has an example project to try the different capabilities of Claude.
That example project is the same as in [`../codex/example-app/`](../codex/example-app/).
That project needs [bun](https://bun.com/docs/installation) installed:

```bash
# Install bun on Mac/Linux
curl -fsSL https://bun.com/install | bash

# Install bun on Windows Powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

However, I skip the project here.

Note: We need a paid subscription.

### Installation and Getting Started

```bash
# Mac, Linux
curl -fsSL https://claude.ai/install.sh | bash
brew install --cask claude-code

# Windows Powershell
irm https://claude.ai/install.ps1 | iex

# Run
cd /path/to/my/project
claude
/login

# Other ways of starting Claude
claude "Analyze the codebase"  # initial prompt given claude starts
claude -p "Analyze the codebase"  # initial prompt given, Claude runs in the background and returns the answer when finished
claude -c  # Resume last session
```

Note that, as in Codex, there are 3 types of interaction interfaces:

- CLI
- Claude App
- IDE

As in codex, we have *slash commands*; here are the most important ones:

```bash
# Conversation
/help     # Show help and available commands
/clear    # Clear conversation history and free up context
/resume   # Resume a previous conversation by ID or name
/rewind   # Rewind conversation to a prior point
/cost     # Show token usage statistics

# Configuration
/config       # Open settings (theme, model, preferences)
/model        # Switch AI model
/permissions  # View or update allowed tools
/vim          # Toggle Vim editing mode
/effort       # Set model effort level (low, medium, high, max)
/status       # Show version, model, and account info

# Output
/copy    # Copy last response to clipboard
/export  # Export conversation as plain text
/diff    # View uncommitted changes interactively

# Modes
/plan    # Enter plan mode to analyze before making changes
/memory  # Edit CLAUDE.md files and manage auto-memory
```

Among them, note these:

- `/clear`: in a session, if we want to start anew, use this to remove history/context.
- `/context`: statistics of the context we have used
  - We see that system prompts & co. can reach up to 10% of all 200k tokens
  - There is an autocompact buffer; autocompact is triggered when we reach 85% of all tokens
- `/usage`: usage statistics shown, i.e., remaining tokens
- `/compact`: we run compaction of the history manually
- `/resume`: start a past session

### Claude Internal Tools

Claude runs these tools available to it:

```
File Operations

- Read -- Read a file's contents (with line numbers)
- Write -- Create or fully overwrite a file
- Edit -- Make targeted string replacements in a file
- Glob -- Find files by pattern (e.g. **/*.py)
- Grep -- Search file contents with regex

Execution

- Bash -- Run shell commands

Research & Web

- WebFetch -- Fetch content from a URL
- WebSearch -- Search the web

Agents & Parallelism

- Agent -- Spawn a specialized subagent (e.g. Explore, Plan, general-purpose) to handle complex subtasks autonomously
- ToolSearch -- Fetch full schemas for deferred/lazy-loaded tools

Task Management

- TaskCreate / TaskGet / TaskList / TaskUpdate / TaskStop / TaskOutput -- Create and manage tasks to track multi-step work

Scheduling & Automation

- CronCreate / CronDelete / CronList -- Manage cron-scheduled jobs
- RemoteTrigger -- Trigger remote scheduled agents

Notebooks

- NotebookEdit -- Edit Jupyter notebook cells

IDE Integration

- mcp__ide__executeCode -- Execute code in the IDE
- mcp__ide__getDiagnostics -- Get IDE diagnostics (errors/warnings)

Notion (MCP)

- notion-fetch, notion-search, notion-create-pages, notion-update-page, etc. -- Read and write Notion content

Planning & Modes

- EnterPlanMode / ExitPlanMode -- Enter a planning mode before making changes
- EnterWorktree / ExitWorktree -- Work in an isolated git worktree

Memory

- Skill -- Invoke a named skill (e.g. /commit, /simplify)

Other

- AskUserQuestion -- Ask the user a clarifying question when genuinely stuck
```

### Configuration

There are 3 main configurations:

- Global: [`~/.claude/settings.json`](~/.claude/settings.json)
- Project: [`.claude/settings.json`](.claude/settings.json); it overwrites the global settings for our project.
- Local: [`.claude/settings.local.json`](.claude/settings.local.json); it overwrites the previous two, the idea is that we don't commit it, so it's our personal.

The *slash command* `/config` modified the **global** settings.

For more info, check: [Claude Code Available Settings](https://code.claude.com/docs/en/settings#available-settings)

### Permissions Management



## 2. Key Features and Efficient Usage

## 3. Beyond Local CLI Usage


