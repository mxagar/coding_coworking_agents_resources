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
    - [1. Setup, Configuration, and Basic Usage](#1-setup-configuration-and-basic-usage)
      - [Introduction](#introduction)
      - [Codex Configuration](#codex-configuration)
      - [Security](#security)
      - [Profiles and Configuration Override](#profiles-and-configuration-override)
      - [Using Other Model Providers](#using-other-model-providers)
      - [Advanced CLI Calls](#advanced-cli-calls)
      - [Context Window Management](#context-window-management)
    - [2. Core Concepts \& Advanced Usage](#2-core-concepts--advanced-usage)

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

Source: [Udemy course: Codex - The Practical Guide (Max Schwarzmüller)](https://www.udemy.com/course/codex-the-practical-guide/).

### 1. Setup, Configuration, and Basic Usage

#### Introduction

Key ideas:

- We need a paid plan; ChatGPT Plus is not enough.
- Codex is both the agent as well as the coding model `*-codex`.
- We have: CLI, app (recommended), cloud/web interface.
- We can also use local models with `--oss` (e.g., Ollama, LM Studio); but they are not as powerful as the OpenAI models.
- **Important**: we should switch off the option that uses our data/history to train the model: ChatGPT settings > Data Controls > Disable "Improve the model for everyone".
- See [Setup](#setup) to see how to install Codex.
- VSCode integration: look for extension + install + open + login.
- We can use the VSCode extension and/or the CLI instead of the Codex app.
- If we use the CLI by running `codex`, the input field of the interactive session is called *composer*.
- In an interactive session, we have the *slash commands*: `/status`.
- In a session, we can choose the model and the reasoning effort (e.g., low, medium, high, extra high).
  - Models: 5.1, 5.2, 5.3, 5.4, etc.
  - Spark: faster
  - In the app/CLI, we can select the model with the *slash command* `/model`.
- Overview of the Codex app given:
  - Threads, sessions
  - Settings
  - Slash commands
  - Model selection
  - Integrated terminal
  - Open in VSCode
  - Run/Play action: commands that should be run when the button is pressed, like install dependencies, etc. Alternatively, we can pass the commands we want to the composer.
  - We can archive/pin/rename threads with the `...` button.
- Tracking usage: `/status` or `Local` button, then usage/rate limits.
- Every session is new and doesn't the previous ones. We can resume previous sessions with `/resume`.
- The IDE and the Codex app have an `Undo` button, but it doesn't work in all cases.
  - Therefore, we should use `git`. Version control is more important than ever using agents!

#### Codex Configuration

Resources:

- [Configuration Reference](https://developers.openai.com/codex/config-reference)
- [Useful Configurations](https://github.com/academind/codex-course-resources/blob/main/other/useful-config.md): [`useful_config.md`](./useful_config.md)

Key ideas:

- We configure codex in a `config.toml` file, located at `~/.codex/config.toml` (for global user settings) or `.codex/config.toml` (inside a specific project to override settings just for that repo). For local configuration, we just create our `.codex/` folder and the `config.toml` file inside it.
- The Codex app has also some settings, which are not completely reflected in the `config.toml` file. Example app settings:
  - General > Open in VSCode, Notifications, etc.
  - Configuration > Select config file, sanbox settings, etc.
  - Personalization > Personality, custom instructions, etc. **IMPORTANT**: custom instructions are stored in the global `AGENTS.md`, so they are injected into any session.

Example `config.toml` from [`useful_config.md`](./useful_config.md):

```toml

### --- Core Model Settings: Control intelligence, cost, and speed.

# The default model to use.
# Options: "gpt-5.2-codex" (Standard), "gpt-5.3-codex" (Newest), "gpt-5.1-codex-mini" (Cheaper/Faster)
model = "gpt-5.2-codex"

# How hard the model thinks before answering (for models that support reasoning).
# Options: "low", "medium" (default), "high", "xhigh"
# Use "high" for complex refactors, "low" for quick syntax questions.
model_reasoning_effort = "medium"

# The communication style of the assistant.
# Options: "friendly" (default), "pragmatic" (concise, less chatty), "none"
personality = "pragmatic"

### --- Permissions & Safety (Critical): Control what the agent is allowed to do without asking you.

# When to pause and ask you for permission before running a command or editing a file.
# Options:
# - "on-request": (Default) The agent decides when to ask (balanced).
# - "never":      (Risky) Runs everything automatically. Good for autonomous "codex exec" scripts.
# - "untrusted":  Strict. Asks for almost everything.
approval_policy = "on-request"

# Controls file system and network access.
# Options:
# - "read-only":       Agent can look but cannot touch.
# - "workspace-write": (Default) Can edit files inside the repo, but blocked from system files (e.g. /etc).
# - "danger-full-access": No sandbox. Agent can edit system files and access the internet freely.
sandbox_mode = "workspace-write"

# Web search behavior.
# Options:
# - "cached": (Default) Safer. Uses OpenAI's pre-indexed copy of the web (prevents prompt injection).
# - "live":   Fetches real-time data. Use this if you need docs for a library released yesterday.
# - "disabled": No web access.
web_search = "cached"

### --- Environment & Integration: Make Codex play nicely with your tools and shell.

# How citations (file links) in the chat response should open.
# Options: "vscode", "cursor", "windsurf", "vscode-insiders", "none"
file_opener = "vscode"

# Controls which environment variables are passed to the agent's shell.
# By default, Codex scrubs secrets to prevent leaks.
[shell_environment_policy]
# inherit = "all" # Default: Pass everything except known secrets.
# Or use this to be strict and only pass specific variables:
# include_only = ["PATH", "HOME", "TERM"]

### --- Privacy & Telemetry

# Disable anonymous usage statistics sent to OpenAI.
[analytics]
enabled = false

# Disable the "/feedback" command and prompts.
[feedback]
enabled = false

### --- Useful Features: Toggle experimental or optional capabilities.

[features]
# Speed up repeated commands by snapshotting the shell state (Beta).
shell_snapshot = true

# Enable "Plan Mode" to let the agent propose a strategy before coding (Stable).
collaboration_modes = true

### --- Profiles (Advanced): Switch between these using `codex --profile <name>`.

# A profile for cheap, fast fixes.
[profiles.fast]
model = "gpt-5.1-codex-mini"
web_search = "disabled"
approval_policy = "never"

# A profile for deep architectural work.
[profiles.deep]
model = "gpt-5.3-codex"
model_reasoning_effort = "high"
sandbox_mode = "read-only" # Safety first when thinking deeply

### --- Model Context Protocol (MCP): Connect external tools (databases, Linear, Slack, etc.).

# Example: Connect to a local documentation server
# [mcp_servers.docs]
# command = "npx"
# args = ["-y", "@modelcontextprotocol/server-docs"]
# enabled = true
```

Example `AGENTS.md`:

```markdown
Work carefully, don't rush changes. Always search for the cleanest best solution. Evaluate different solutions insteadd of picking the first one that comes to mind.
Ensure a clean architecture and codebase. don't shy away big refactors - embrace them if they make sense.
```

#### Security

Codex has some security features:

- It can **read files** in the workspace: sandboxed environment, limited file access.
- It can **edit files** in the workspace (current directory) and other explicitly writable roots, e.g.: `~/.codex/memories/`, etc.
- **Commands** that need broader system access may **require explicit approval**; e.g.: `git add ...`
- **Network access** is restricted by default.
- **Limited web search** by default (cached, no live access). Cached is curated by OpenAI; live search can end up in prompt injection attacks!

Dangerous configuration, which disables default safety features:

```toml
approval_policy = "never"  # vs "on-request" (default) or "untrusted"
sandbox_mode = "danger-full-access"  # vs "workspace-write" (default) or "read-only"
web_search = "live"  # vs "cached" (default) or "disabled"
```

Also :

- In the Codex app, we can toggle the "Default permissions" to "Full access" (dangerous) in each session.
- In the IDE, we can do the same
- In the CLI, we use `/permissions` and/or the `--dangerously-bypass-approvals-and-sandbox` or `--yolo` flag.

#### Profiles and Configuration Override

We can define profiles in the `config.toml`.

```toml
# ==============================================================================
# PROFILE 1: "Deep Work"
# For complex refactors requiring high reasoning and full autonomy.
# ==============================================================================
[profiles.deep-work]
# Use the smarter model with more effort
model = "gpt-5.3-codex"
model_reasoning_effort = "xhigh"
 
# ==============================================================================
# PROFILE 2: "Quick Fix"
# For fast, low-cost tasks like fixing typos or simple bugs.
# ==============================================================================
[profiles.quick-fix]
# Use the smaller, faster model to save costs/time
model = "gpt-5.3-codex-spark"
model_reasoning_effort = "low"
web_search = "disabled"
```

We use the profiles as follows:

```bash
# codex --profile <name>
codex --profile deep-work
codex --profile quick-fix
```

Also, it's possible to override some configuration settings on the fly in the CLI:

```bash
# codex --config <config-setting> / codex -c <config-setting>
codex -c model="gpt-5.2-codex"
codex -c model="gpt-5.2-codex" -c sandbox_mode="read-only"
```

#### Using Other Model Providers

Official guide: [Custom model providers](https://developers.openai.com/codex/config-advanced#custom-model-providers).

By default, Codex uses OpenAI's models, but we can configure it to use other providers, too, e.g., Ollama, Mistral, etc.

It seems it works best with OpenAI models, though.

The quick way using the CLI to launch local models is the following:

```bash
# Start Ollama server
ollama list  # get available local models
ollama serve <model-name>  # e.g., llama3

# Call codex CLI with the --oss flag to use the local model
# which defaults to Ollama if it's running
# The model name must be the Ollama <model-name>
codex --oss --model llama3
```

This can be configured in the `config.toml` permanently as well:

```toml
# Set the default "oss" provider to be ollama
oss_provider = "ollama"
 
[model_providers.ollama]
name = "Ollama Local"
base_url = "http://localhost:11434/v1" # Must end in /v1 for compatibility
wire_api = "chat" # Tells Codex to use the /chat/completions endpoint
```

To use other **cloud/API providers**, we can configure `config.toml` as follows:

```toml
### --- Groq: You can add any provider that offers an OpenAI-compatible endpoint.

model_provider = "groq" # Set this to match the key below
model = "llama-3.1-70b-versatile"
 
[model_providers.groq]
name = "Groq"
base_url = "https://api.groq.com/openai/v1"
env_key = "GROQ_API_KEY" # Reads from your environment variables
wire_api = "chat"

### --- Azure OpenAI: Codex has specific native support for Azure OpenAI.

model_provider = "azure"
 
[model_providers.azure]
name = "Azure OpenAI"
# Your endpoint usually looks like this
base_url = "https://YOUR_RESOURCE_NAME.openai.azure.com/openai"
wire_api = "responses" # or "chat" depending on your deployment
env_key = "AZURE_OPENAI_API_KEY"
 
# Azure often requires specific query parameters for API versions
[model_providers.azure.query_params]
api-version = "2025-04-01-preview"
```

#### Advanced CLI Calls

```bash
# Initial prompt
codex "Explain the codebase"

# Avoid interactive sessions
# This is useful for: cron jobs, CICD jobs, etc.
# This makes possible to build our own automations on top of codex!
codex exec "Analyze the codebase and suggest improvements"
codex exec "Analyze the code" --json  # request JSON output!
```

#### Context Window Management



### 2. Core Concepts & Advanced Usage

TBD.
