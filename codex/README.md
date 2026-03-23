# Codex

This directory contains resources related to OpenAI's Codex CLI, a powerful tool for interacting with codebases using natural language.

These are the sources I have used to learn about Codex:

- [The official OpenAI Codex CLI guide](https://developers.openai.com/codex/cli)
- [Udemy course: Codex - The Practical Guide (Max Schwarzmüller)](https://www.udemy.com/course/codex-the-practical-guide/)

Table of contents:

- [Codex](#codex)
  - [Codex CLI Official Guide Summary](#codex-cli-official-guide-summary)
    - [Setup](#setup)
    - [Basic Usage](#basic-usage)
    - [Other Command Line Options](#other-command-line-options)
    - [Other Subcommands](#other-subcommands)
    - [Slash Commands](#slash-commands)
    - [Features and Configuration](#features-and-configuration)
    - [Agents: AGENTS.md](#agents-agentsmd)
    - [Skills: SKILL.md](#skills-skillmd)
    - [Subagents](#subagents)
  - [Codex - The Practical Guide (Udemy)](#codex---the-practical-guide-udemy)

## Codex CLI Official Guide Summary

Source: [https://developers.openai.com/codex/cli](https://developers.openai.com/codex/cli)

### Setup

```bash
# Install via npm
npm i -g @openai/codex

# Install via homebrew
brew install codex

# Run: Log in first time
codex
codex login  # to log in explicitly

# Upgrade
brew upgrade codex
npm i -g @openai/codex@latest
```

### Basic Usage

Key ideas:

- We get access to the directory files we are in by default.
- `codex` can interact with the computer via bash/cli.
- We can have interactive and non-interactive sessions, and every session can be left and resumed (state & history are saved). 
- Interactive sessions are started with `codex`.
- The input field of the interactive session is called *composer*.
- In an interactive session, we have the *slash commands*: `/status`.
- Non-interactive sessions are started with `codex exec ...`.
- Each conversation is a sessions; session history is usually saved in `~/.codex/`
- The default configuration is in `~/.codex/config.toml`; diffs or changes are saved in the project dir under `.codex/config.toml`.
- If we configure a session in a dir in a different way than the default, the configuration is saved in that directory under `.codex/`.
- TUI = Terminal UI, interactive CLI with menus, etc.
- IMPORTANT: before running `codex` we should set our environment, so that Codex doesn't waste tokens setting it up; e.g.: `conda activate my_env`, etc.

```bash
# Start with initial prompt
codex "explain this codebase to be"

# Start in interactive mode
codex

# Get session info, e.g., id, tokens burnt, model, etc
/status

# Exit
/exit
Ctrl + C

# Pick up from previous sessions
codex resume
codex resume --all  # complete history beyond current dir
codex resume --last
codex resume <sessions_id>

# Codex Command Line Options
codex --model gpt-5.4
codex --cd /path/to/dir  # override current dir
codex --add-dir /path/to/dir  # expose more writeable roots
codex --cd apps/frontend --add-dir ../backend --add-dir ../shared
codex help  # see all args/options, subcommands, etc.
codex <subcommmand> help  # 

# Image inputs
# - We can PASTE images into the interactive session
# - or we can start a session with a path to an image
codex -i screenshot.png "Explain this error"

# Enable CLI code completions
eval "$(codex completion zsh)"  # bash, ...
# Then we type codex TAB and we see options!

# Interact with cloud sessions.
# Codex runs locally, but if we connect out Github account
# it can work on the cloud and make changes to our repo.
# It makes sense for tasks that can be run in parallel in their own env.
codex cloud  # open interactive picker, or start a new task with n, ...
codex cloud exec --env ENV_ID "Summarize open bugs"  # start a new cloud task from CLI

# If we set our EDITOR/VISUAL variables,
# then Ctrl + G opens the editor for a more comfortable
# prompt writing experience
export VISUAL="vim"
export EDITOR="vim"
source ~/.zshrc
...
codex ...
Ctrl + G
# vim opens: we write, ESC :wq
# prompt appears in interactive session

# Insie a session...
!ls  # ! to run shell commands
@filename  # run a fuzzy search, use TAB / ENTER, refer to a filename
ENTER  # Inject new instructions while Codex is running
TAB  # Follow up prompt while Codex is running
ESC x2  # Edit previous message
```

### Other Command Line Options

```bash
--ask-for-approval untrusted | on-request | never  # Should codex ask for human approval?
--dangerously-bypass-approvals-and-sandbox  # Run everything without approvals or sandboxing; only for external hardened envs!
--yolo  # Same as before
--oss  # Use local Ollama model!
--profile  # Load specific profile from ~/.codex/config.toml
--sandbox read-only | workspace-write | danger-full-access  # Select the sandbox policy for model-generated shell commands
--search  # Enable live web search (sets web_search = "live" instead of the default "cached"); should be enabled by default?
```

### Other Subcommands

```bash
codex app  # Launch the Codex desktop app on macOS
codex fork  # Fork a previous interactive session into a new thread
codex mcp  # Manage Model Context Protocol servers: codex mcp list, add, remove, authenticate
codex mcp-server  # Run Codex itself as an MCP server over stdio. Useful when another agent consumes Codex
codex sandbox  # Run arbitrary commands inside Codex-provided macOS seatbelt or Linux sandboxes
```

### Slash Commands

We run *slash commands* in an interactive session, entering them into the *composer* (i.e., the input field).

```bash
# Set what Codex can do without asking first
/permissions  # change approval mode mid-session, opens permission picker

# Grant sandbox read access to an extra directory outside of current dir
/sandbox-add-read-dir  # Windows only
# Example: /sandbox-add-read-dir C:\projects\shared-docs

# Switch the active agent thread
# Lets you inspect or continue work in another spawned agent thread
/agent

# Browse apps/connectors and insert them into your prompt: opens app picker
/apps  # attach an app as $app-slug

# Clear the terminal and start a fresh chat
/clear  # unlike Ctrl+L, this also resets the conversation

# Summarize the visible conversation to free tokens, more context
/compact

# Copy the latest completed Codex output to clipboard
/copy

# Show the Git diff, including untracked files, before committing/testing
/diff

# Exit the CLI
/exit  # same as /quit

# Toggle experimental features: toggle UI is opened
/experimental

# Send logs to the Codex maintainers: report bugs, issues
/feedback

# Generate an AGENTS.md scaffold/starter in the current directory
/init

# Sign out of Codex
/logout

# List configured/available MCP tools
/mcp

# Attach a file or folder to the conversation, for explicit inspection
/mention
# Example: /mention src/app.ts

# Choose the active model: model picker + reasoning level
/model  # may also include reasoning effort when available

# Toggle Fast mode on/off for GPT-5.4
/fast  # supports on, off, and status
# Example: /fast on

# Switch to plan mode
/plan  # can include an inline prompt
# Example: /plan Propose a migration plan for this service

# Choose a communication style for responses: personality picker opens
/personality  # docs list friendly, pragmatic, and none

# Show experimental background terminals and recent output
# Lists background terminals and their recent output when long-running commands are active
/ps

# Fork the current conversation into a new thread
/fork

# Resume a saved conversation: session list opens
/resume

# Start a new conversation in the same CLI session
# Resets chat context without leaving the current repository session
/new

# Exit the CLI
/quit

# Ask Codex to review your working tree
# Starts a code review pass over your current local changes
/review

# Display session configuration and token usage
# Prints the active model, approval mode, writable roots, and current token usage
/status

# Print config layer and policy diagnostics
# Shows which config layers and policy settings are active and where they came from
/debug-config

# Configure TUI status-line fields
/statusline

# Legacy alias for /permissions
/approvals  # still works, but no longer appears in the slash popup
```

### Features and Configuration

We can enable/disable features; the changes are automatically saved to `~/.codex/config.toml`.

```bash
# Get all features and their flag
codex features list

apply_patch_freeform             under development  false
apps                             experimental       false
artifact                         under development  false
child_agents_md                  under development  false
...

# Set feature flags
codex features enable unified_exec
codex features disable shell_snapshot
```

If we change anything, the diff or user settings are saved into  `.codex/config.toml`.

Common configuration settings; we can define them

- in `config.toml`
- or in the codex call: `codex -c log_dir=./.codex-log`, `codex --config log_dir=./.codex-log`; the CLI call overrides the `config.toml`

```conf
model = "gpt-5.4"
approval_policy = "on-request"  # Control when Codex pauses to ask before running generated commands
sandbox_mode = "workspace-write"  # Adjust how much filesystem and network access Codex has while executing commands
web_search = "cached"  # default; serves results from the web search cache
web_search = "live"  # fetch the most recent data from the web (same as --search)
web_search = "disabled"
model_reasoning_effort = "high"
personality = "friendly" # or "pragmatic" or "none"
log_dir = "/absolute/path/to/codex-logs"  # Override where Codex writes local log files such as codex-tui.log

[shell_environment_policy]  # Control which environment variables Codex forwards to spawned commands
include_only = ["PATH", "HOME"]

[features]
shell_snapshot = true  # Speed up repeated commands
```

We can define profiles in the `config.toml` and then use them in the codex call: `codex --profile <name>`.

```conf
model = "gpt-5-codex"
approval_policy = "on-request"
model_catalog_json = "/Users/me/.codex/model-catalogs/default.json"

[profiles.deep-review]
model = "gpt-5-pro"
model_reasoning_effort = "high"
approval_policy = "never"
model_catalog_json = "/Users/me/.codex/model-catalogs/deep-review.json"

[profiles.lightweight]
model = "gpt-4.1"
approval_policy = "untrusted"
```

We can define custom model providers, too:

```conf
model = "gpt-5.1"
model_provider = "proxy"

[model_providers.proxy]
name = "OpenAI using LLM proxy"
base_url = "http://proxy.example.com"
env_key = "OPENAI_API_KEY"

[model_providers.ollama]
name = "Ollama"
base_url = "http://localhost:11434/v1"

[model_providers.mistral]
name = "Mistral"
base_url = "https://api.mistral.ai/v1"
env_key = "MISTRAL_API_KEY"
```

An easier way of using local models i `--oss`:

```conf
# Default local provider used with `--oss`
oss_provider = "ollama" # or "lmstudio"
```

We can control the shell environment variables passed to subprocesses:

```conf
[shell_environment_policy]
inherit = "none"
set = { PATH = "/usr/bin", MY_FLAG = "1" }
ignore_default_excludes = false
exclude = ["AWS_*", "AZURE_*"]
include_only = ["PATH", "HOME"]
```

### Agents: AGENTS.md

We can create persistent agent definitions or requirements:

```bash
mkdir -p ~/.codex
touch ~/.codex/AGENTS.md
# we write the content
```

This file is optional, but if it exists, Codex will read it on startup and use the agent definitions inside. It defines how agents behave semantically, what they can do, and how they should be used. Example:

```markdown
- Always write numpy-first implementations
- Avoid unnecessary dependencies
- Add unit tests for all logic
```

### Skills: SKILL.md

A skill is a directory with a required `SKILL.md` file. It defines a specific behavior for Codex to trigger when certain conditions are met.

We can use the built-in skill creator:

```bash
$skill-creator
```

Creator asks:

- What the skill does
- When it should trigger
- and whether it should stay instruction-only or include scripts.

... and it creates the directory and the `SKILL.md` file with the manifest (yaml front matter) and instructions.

We can also create a `SKILL.md` manually:

```bash
---
name: skill-name
description: Explain exactly when this skill should and should not trigger.
---

Skill instructions for Codex to follow.
```

We can save skills in several places:

- Repo scope
  - `$CWD/.agents/skills/<skill-name>/SKILL.md`
  - `$CWD/../.agents/skills/<skill-name>/SKILL.md`
  - `$REPO_ROOT/.agents/skills/<skill-name>/SKILL.md`
- User scope
  - `$HOME/.agents/skills/<skill-name>/SKILL.md`

We can also **install** skills:

```bash
$skill-installer linear
```

We can enable/disable given skills in the `~/.codex/config.toml`:

```conf
[[skills.config]]
path = "/path/to/skill/SKILL.md"
enabled = false
```

### Subagents

Codex can orchestrate the launch and management of several sub-agents in parallel, each specialized in specific themes.

There are default sub-agents, and we can define custom ones, too.

Be careful with context pollution; check: [Subagents](https://developers.openai.com/codex/concepts/subagents).

Sub-agents are spawned only when we explicitly request it. They inherit the general settings.

Example prompt to trigger agents:

```text
I would like to review the following points on the current PR (this branch vs main). Spawn one agent per point, wait for all of them, and summarize the result for each point.
1. Security issue
2. Code quality
3. Bugs
4. Race
5. Test flakiness
6. Maintainability of the code
```

Then, we use `/agent` to switch between agents.

We can ask Codex to stop the agents with natural language.

Default subagents:

- default: general-purpose fallback agent.
- worker: execution-focused agent for implementation and fixes.
- explorer: read-heavy codebase exploration agent.

To define custom agents:

- Create TOML files in `~/.codex/agents/` or `.codex/agents/` with the agent definitions.
- Codex only spawns subagents when we explicitly ask it to.
- Agents can be launched in parallel; we need to specify that in the configuration.

Agent definition structure example:

```
my-project/
  .codex/
    config.toml
    AGENTS.md
    agents/
      reviewer.toml
      implementer.toml
      explorer.toml
```

Example TOML:

```toml
name = "reviewer"
description = "Reviews code for correctness, bugs, and missing tests."

developer_instructions = """
Act like a strict senior engineer.
Focus on:
- correctness
- edge cases
- performance
- missing tests
"""

model = "gpt-5.4"
sandbox_mode = "read-only"
```

Example configuration to spawn agents in parallel, in `.codex/config.toml`:

```conf
[agents]
max_threads = 6  # maximum number of parallel agents
max_depth = 1  # whether agents can spawn sub-agents; 1 means only direct children of the main session
```

## Codex - The Practical Guide (Udemy)

TBD.