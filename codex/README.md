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
      - [Example App](#example-app)
      - [SPEC File](#spec-file)
      - [Prompt and Context Engineering](#prompt-and-context-engineering)
      - [Plan Mode](#plan-mode)
      - [Reviewing Generated Code](#reviewing-generated-code)
      - [AGENTS.md](#agentsmd)
      - [Nested AGENTS.md](#nested-agentsmd)
      - [Worktrees and Environments](#worktrees-and-environments)
      - [Adding External Context](#adding-external-context)
      - [Steering and Queeuing Follow Up Questions](#steering-and-queeuing-follow-up-questions)
      - [Model Context Protocol (MCP) Servers](#model-context-protocol-mcp-servers)
      - [Agent Skills](#agent-skills)
        - [Skill Examples](#skill-examples)
      - [Advanced Skills: References and Scripts](#advanced-skills-references-and-scripts)
      - [Built-IN Skill Creator](#built-in-skill-creator)
      - [Adding 3rd Party Skills](#adding-3rd-party-skills)
      - [Feedback Loops, Reviews and Tests](#feedback-loops-reviews-and-tests)
      - [Browser Access for Self-Review](#browser-access-for-self-review)
      - [Forking Sessions](#forking-sessions)
      - [Codex Cloud Setup](#codex-cloud-setup)
      - [Codex Cloud Usage](#codex-cloud-usage)
      - [Codex App Automations](#codex-app-automations)

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

Sources:

- [Udemy course: Codex - The Practical Guide (Max Schwarzmüller)](https://www.udemy.com/course/codex-the-practical-guide/).
- [GitHub repository: Codex course resources](https://github.com/academind/codex-course-resources)
- [Academind Community (Discord)](https://academind.com/community/)

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
  - Every time codex makes some changes, diffs are shown in the app; also we can use the diff panel or the `/diff` slash command to see the changes.
  - Get used to committing changes every time Codex makes some changes, so that we can easily revert if something goes wrong; also this makes possible to better track what Codex is doing and how it's changing the codebase.
- We can paste images! Just copy an image, then `Ctrl + V` in the composer/app/IDE prompt.

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
# Or:
[mcp_servers.context7]
url = "https://mcp.context7.com/mcp"
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

The context window is filled by many stuff:

- Prompt
- Codebase files
- Tool calls
- etc.

If it is close to be full, Codex starts to summarize the conversation to free up space. This is the *auto-compact* feature.

We can also ask it to summarize with the `/compact` slash command.

Note that if we start a new session (e.g., with `/new`), the context window is reset, but we can still access the previous sessions with `/resume`.

### 2. Core Concepts & Advanced Usage

#### Example App

This section uses the example project in the folder [`example-app/`](./example-app/), which is provided in [`codex-course-resources/code-snapshots/starting-project.zip`](https://github.com/academind/codex-course-resources/blob/main/code-snapshots/starting-project.zip).

[Bun](https://bun.com/) is needed; Bun is a combination of a runtime, package manager, and bundler for JavaScript and TypeScript. It is a great alternative to `Node.js + npm`. The [`/example-app/README.md`](./example-app/README.md) explains how to install and run it.

The app is based on [Next.js](https://nextjs.org/), which is a framework on top of React for building web applications. The app is a simple note taking app, where we can create, edit, delete, and share notes.

Summary:

```bash
cd ./example-app

# Install bun
npm install -g bun

# Install dependencies
bun install

# Start the development server
bun run dev
# Open http://localhost:3000 in the browser to see the app running.

# To stop the server, press Ctrl + C in the terminal.
```

#### SPEC File

In general, it's a very good idea to create two files in every project we work on with Codex or any other agentic framework:

- `Prompts.md`: we collect the (most important) prompts we use to create the app. Specially, the initial project description prompt, which is used to create a larger and detailed specifications prompt/file, listed below: `SPEC.md`.
- `SPEC.md`: this file contains the ellaborated project description, worked by leveraging an LLM. It should contain, among others:
  - App description
  - Tech stack
  - Goals and constraints
  - Architecture overview (incl. authentication, database, frontend/backend, etc.)
  - Routes (UI), connections: e.g., if authenticated redirect to `/notes`, else redirect to `/login`, etc.
  - Data models, Database schema
  - Example SQL statements
  - Pipelines, common workflows for the user
  - Error handling and security
  - Styling
  - Migration
  - Environment variables
  - Acceptance criteria
  - etc.

The `SPEC.md` is very important; an example file for the example app is here: [`example-app/SPEC.MD`](./example-app/SPEC.MD).

We should spend time crafting that `SPEC.md` and edit it manually until we are happy with it.

We can use `codex` to clean up the `SPEC.md`; we can point to it explicitly by naming it or also using the `@filename` syntax, which creates a link to the file. Example:

```
# Low reasoning enough
Analyze the @SPEC.md file and fix/change the following:
- ...
```

#### Prompt and Context Engineering

A **prompt** is the sum of two things:

- Instructions
- **Relevant** Context

The more precise we are in both, the better.

In that sense, adding the `@SPEC.md` file to the prompt is a very good idea

Similarly, if we think there might be important context for the model in a file, we need to explicitly mention it in the prompt with the `@filename` syntax.

#### Plan Mode

If we are unsure whether the prompt will lead to a good solution or not, we can use the *Plan Mode*. To activate:

- `SHIFT + TAB`: toggle on/off everywhere (CLI, app, IDE)
- In the IDE & app: click on `+`, select Plan mode
- In the CLI: `/plan` slash command

In plan mode, we send the prompt and Codex:

- Asks questions it needs
- It makes a plan of how to solve the problem, with steps and subtask

The created plan is presented as a Markdown. We should review it and accept it, if we consider it, else ask to modify it as desired. Then, we exit the plan mode and codex starts to implement the plan.

Initial prompt example in plan mode:

```
You need to build a simple note taking app. The app starter code is in codex/example-app/, and you should implement inside that folder always. The app description is given in codex/example-app/README.md, codex/example-app/Instrcutions.md, and most importantly in codex/example-app/SPEC.MD.

Set up all base pages and layouts, as described in the specs @SPEC.MD. Do not add any concrete logic, UI, authentication, database logic, or anything like that.

Just create the pages + layout and output dummy content.
```

This outputs the following plan:

```markdown
# TinyNotes route scaffold in codex/example-app

## Summary

Create a scaffold-only App Router structure for TinyNotes inside codex/example-app/app, matching the routes in SPEC.MD and using placeholder
content only. This pass will set up the page tree, shared layouts, route segmentation, a custom 404, and minimal loading placeholders for note/
share flows. It will not add auth logic, note logic, database code, server actions, forms with behavior, or polished UI components.

## Implementation Changes

- Replace the current single demo homepage with a route scaffold that matches the spec:
    - /
    - /login
    - /register
    - /notes
    - /notes/new
    - /notes/[id]
    - /s/[token]
    - custom not-found.tsx
- Organize the App Router with route groups to reflect the product structure even though no auth logic exists yet:
    - a public/auth group for /login and /register
    - an authenticated app group for /notes, /notes/new, and /notes/[id]
    - the shared-note route /s/[token] outside the authenticated group
- Add group-level layouts so the future app has the right structural seams:
    - root layout remains global shell and metadata entrypoint
    - auth-group layout with simple placeholder auth-shell wrapper
    - notes-group layout with simple placeholder app-shell wrapper
- Each page will render dummy static content that makes the intended purpose explicit:
    - / states that it is the redirect entrypoint in the real app
    - /login and /register show placeholder auth page content
    - /notes shows placeholder note list page and empty-state text
    - /notes/new shows placeholder create-note editor page
    - /notes/[id] shows placeholder note editor/share-controls page
    - /s/[token] shows placeholder public shared note page
    - not-found.tsx shows a custom TinyNotes 404 page
- Add minimal route-adjacent placeholders where the spec explicitly calls for loading states:
    - loading placeholder for the notes area
    - loading placeholder for the shared-note route
- Keep styling intentionally minimal and structural:
    - reuse the existing global CSS entrypoint
    - adjust layout/page markup only enough to distinguish shells and placeholders
    - no component library, no real forms, no interactive editor, no “elegant acqua” UI buildout in this pass

## Public Interfaces / Route Structure

- App Router routes created:
    - GET /
    - GET /login
    - GET /register
    - GET /notes
    - GET /notes/new
    - GET /notes/[id]
    - GET /s/[token]
- App Router support files created:
    - root layout.tsx
    - group layouts for auth and notes sections
    - not-found.tsx
    - loading placeholders for notes/share flows
- No server actions, API routes, middleware, auth handlers, database files, or client-side logic are introduced.

- Start the app and confirm each path renders placeholder content without runtime errors.
- Confirm the notes pages render inside the notes-group layout and auth pages render inside the auth-group layout.
- Confirm /s/test-token resolves to the shared-note placeholder page.
- Confirm unknown routes render the custom not-found.tsx.
- Confirm no placeholder page imports non-existent logic modules or server-side dependencies.

## Assumptions

- “Set up all base pages and layouts” means scaffold the route tree and shared layout boundaries now, without implementing any redirects, auth
  guards, data fetching, mutations, editor behavior, or share behavior.
- “Do not add concrete logic, UI, authentication, database logic, or anything like that” means placeholders may contain static headings,
  descriptive copy, and structural wrappers only.
- The scaffold will include loading placeholders because the spec explicitly calls for loading states and you selected that scope.
- Route grouping is an implementation detail that should be added now to keep the future authenticated/public split clean, even though it does not
  affect URLs.
```

#### Reviewing Generated Code

Once the code is generated, we can try starting the app in the CLI:

```bash
# Install dependencies if not done yet
cd .../example-app
bun install

# Start the development server
bun run dev
# Open http://localhost:3000 in the browser to see the app running.

# To stop the server, press Ctrl + C in the terminal.
```

Next, we should carefully review the code changes:

- The diff panel in the Codex app is useful.
- We can also use the `/diff` slash command to see the changes.
- If we are in the IDE, we can check the version control diff.

The advantage of the app is that we can add comments in the diff planel, which are included in the next prompt. If we are not using the app, we need to explicitly mention the change we would like to modify, e.g., do not remove a font, or whatsoever.

It is very important to commit the changes we want in order to have a tracking history.

#### AGENTS.md

The `SPEC.md` file is very large and not always relevant, i.e., not for all prompts. Instead, we can use an `AGENTS.md` file, where we define general instructions for any agent we spawn in any session.

If we have contents in a project, we can use the slash command `/init`, which creates an appropriate `AGENTS.md` file with some initial instructions.

We can also create the `AGENTS.md` file manually, or prompt it:

```markdown
create an AGENTS.md file in the app folder codex/example-app
```

Look at the [example AGENTS.md](./example-app/AGENTS.md):

- Brief description of the project and its goals.
- Main usage commansds.
- General instructions.
- etc.

In Claude Code, we don't use `AGENTS.md`, but instead `CLAUDE.md`. One way to deal with that is to use `CLAUDE.md` for general agent instructions and then add this line in the `.codex/config.toml`:

```toml
project_doc_fallback_filenames = ["CLAUDE.md"]
```

That way, if `AGENTS.md` is not found, it will fallback to `CLAUDE.md` and use it as the source of instructions for the agents.

We can check that the `AGENTS.md` is being used by asking Codex *what are your instructions?* in a new session.

An `AGENTS.md` file should be:

- Clear and concise.
- Changed as the project evolves.

#### Nested AGENTS.md

We can also have `AGENTS.md` files in subfolders, with specific instructions for that folder (e.g., `backend/`, `frontend/`, etc.).

The loading logic is the following:

- If we start codex in a subfolder, it will load the `AGENTS.md` file in that subfolder, if it exists, and ignore the one in the root.
- If we start codex in the root, it will always load the `AGENTS.md` file in the root, and then the ones in the subfolders, if they exist. The instruction sets will be extended, so it is important to make sure they are not contradicting each other.

#### Worktrees and Environments

Worktrees are a Git feature that allows us to have multiple working directories associated with the same repository.
This is useful when we want to work on multiple branches at the same time without having to switch between them, which makes sense when we have 2+ agents working on different sessions simultaneously.

The Codex app comes with built-in support for worktrees; the CLI and the IDE still do not support them, but we can use the Git commands to create and manage worktrees.

Workflow in the Codex app:

- In the branch selector menu, we create a new branch.
- Click on `local/cloud` button, select `New worktree`, select the new branch we created: then, everything is done for us.
- We should also be able to create a worktree from non-existing branch, but it seems that the app doesn't support it yet?
- So if we have 2 agents, one can be working in the `main` branch and the other one in the `feature-x` branch, and they won't interfere with each other.
- When the `main` agent finishes, we can merge the `feature-x` branch into `main`; we can do that with the Codex app or manually with Git commands.

Notes on the Codex app settings (Settings > Worktrees / Environments):

- Under Settings > Worktrees we can see the past worktrees we have created, and we can also delete them.
- Under Settings > Environments we can see the environments we have created; for each environment, we need to configure the setup script, which is a script that runs every time we start a session in that environment. Example setup script:
  ```bash
  pip install -r requirements.txt
  ./run_seyup.sh
  cp ../.env .  # copy the .env file to the worktree, if it is needed for the session
  ```

If we cannot use the Codex app, the usual manual workflow is the following:

```bash
# Create a worktree for a new feature branch
# This creates a new folder `../feature-x` with the content of the branch `feature-x`
# Note that not all the files are copied, the ones managed/used by git
git worktree add ../feature-x -b feature-x  # if no branch exists yet
git worktree add ../feature-x feature-x  # if the branch already exists
git worktree add ../hotfix <commit-hash>  # to create a worktree from a specific commit, useful for hotfixes

# Work inside the worktree
cd ../feature-x
# ... work, edit, etc.
git add .
git commit -m "Add feature"
git push

# Final commit in the feature branch
git commit -m "Feature complete"  

# Switch back to the repository directory and pull main branch
cd ../original-repo
git checkout main
git pull

# Merge the feature branch back to main
git merge feature-x
```

#### Adding External Context

Sometimes we want the agents to use a tool they don't necessarily know. We have different options:

1. We can provide the URL of the relevant page; but, for that, `web_search` needs to be set to `live` in the configuration, which is dangerous. We can also hope that the cached search has the relevant page indexed, but it is not guaranteed.
2. We can copy and paste the relevant content from the web page (nowadays, many documentation pages have a copy button). Then, we paste it in the composer, and often change to plan mode (`SHIFT + TAB`) to give the model more time to process the information and create a better plan. Example:
    ```
    <tool-x-documentation>  # optional
    [Pasted Content 1234 chars]  # when content is pasted, this appears
    </tool-x-documentation>  # optional
    SHIFT + TAB  # to switch to plan mode
    ```

#### Steering and Queeuing Follow Up Questions

When Codex is working (e.g., implementing, or in plan mode), we can still use it in two ways:

- `ENTER`: we *steer* it, i.e., we inject the question immediately, and it will stop the current process, answer the question, and then continue with the previous process. This is useful when we want to change the course of action immediately, or we want to clarify something that is crucial for the current process.
- `TAB`: we *queue* the question, i.e., it will be answered once the current task is finished. This is useful when we don't want to interrupt the current process, but we want to make sure that a question is answered once it finishes.

In the Codex app is the opposite: `ENTER` queues the question.

Also, when *we get asked by Codex* (e.g., in plan mode), sometimes we have the option of hitting `TAB` to add more notes.

#### Model Context Protocol (MCP) Servers

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro) Servers are a standardized way of exposing tools to LLMs.

We can build our MCP servers or use exiting ones.

There is one MCP server which serves many up-to-date documentation pages of different tools: [Context7](https://context7.com/); that way, we can use it instead of allowing live web search. This makes sense for hot or trendy new libraries, like [better-auth](https://github.com/better-auth/better-auth), used in the example app.

In general, we should carefully add MCP servers, because agents (LLMs) tend to get worse if we expose them to too many MCP servers; so we should use the ones we only know we need. Some other interesting MCP servers:

- [Playwright](https://github.com/microsoft/playwright-mcp?tab=readme-ov-file), to give Codex browser access.
- [DeepWiki](https://docs.devin.ai/work-with-devin/deepwiki-mcp), to give Codex search access to essentially ALL GitHub repositories.

To install or connect to that server, we can check the documentation to the different clients: [Context7: MCP Clients](https://context7.com/docs/resources/all-clients).
We are interested in the OpenAI Codex client, which has the following instructions:

```markdown

**Install Using CLI (Don't use this one)**

    codex mcp add context7 -- npx -y @upstash/context7-mcp --api-key YOUR_API_KEY


**Local Server Connection (Don't use this one)**

Add this to your Codex configuration file (`~/.codex/config.toml` or `.codex/config.toml`):

    [mcp_servers.context7]
    command = "npx"
    args = ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
    startup_timeout_sec = 20

**Remote Server Connection <- USE THIS ONE!**

Add this to your Codex configuration file (`~/.codex/config.toml` or `.codex/config.toml`):

    [mcp_servers.context7]
    url = "https://mcp.context7.com/mcp"
    http_headers = { "CONTEXT7_API_KEY" = "YOUR_API_KEY" }  # we don't need the API key, we can remove this line

```

So we need to add the following to the `.codex/config.toml` file:

```toml
[mcp_servers.context7]
url = "https://mcp.context7.com/mcp"
# The API key is for higher rate limits, but we don't really need it
```

Then, we should see the MCP sever after starting a new session:

- In the Codex app: Settings > MCP Servers > Context7: Enable it.
- IDE: same, open Settings.
- In the CLI: `/mcp` to see the available MCP servers; status `enabled` is shown for context7.

MCPs are in theory automatically used, but in practice, it doesn't damage to explicitly mention them in the prompt:

```text
Implement the authentication using better-auth. Use tge Context7 MCP to access the up-to-date documentation of better-auth.
```

#### Agent Skills

Agent skills are already a standard: [Agent Skills Standard](https://agentskills.io/home).

The standard defines a folder structure for skills, which is the following:

```
.agents/skills/
    <skill-name>/
    ├── SKILL.md          # Required: instructions + metadata
    ├── scripts/          # Optional: executable code
    ├── references/       # Optional: documentation
    └── assets/           # Optional: templates, resources
```

Note: that's the standard; codex also allows defining the skills inside the `.codex/skills/` folder, but it is recommended to use the `.agents/skills/` folder for compatibility with other agentic frameworks and tools (e.g., Cursor, etc.).

As we see, a skill is basically defined in a `SKILL.md` file inside its `<skill-name>/` folder. Then, we can optionally add scripts, references, and assets.

We could write in the `AGENTS.md` file the skill description, but `AGENTS.md` could become huge and it is loaded every time taking space in the context.
**The main idea with `SKILL.md` is that the files are LAZY-loaded, i.e., they are loaded only when needed!**
That way `AGENTS.md` is kept lean and contains only general at all times **relevant** knowledge.

> Skills use progressive disclosure to manage context efficiently:
> - Discovery: At startup, agents load only the name and description of each available skill, just enough to know when it might be relevant.
> - Activation: When a task matches a skill’s description, the agent reads the full SKILL.md instructions into context.
> - Execution: The agent follows the instructions, optionally loading referenced files or executing bundled code as needed.
> This approach keeps agents fast while giving them access to more context on demand.

We can check the available skills as follows:

- CLI: with the `/skills` slash command.
- Codex app: left panel > Skills. We can add new skills from there as well.
- IDE: Settings > Skill Settings.

An exemplary `SKILL.md` file for the skill [`docs-maintainer`](../.agents/skills/docs-maintainer/SKILL.md):

```markdown
<!-- .agents/skills/docs-maintainer/SKILL.md -->
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
```

In order to use/invoke the skill:

- We can ask in the prompt a task clearly related to the skill description
- or we can explicitly mention the skill in the prompt, e.g., `Use the docs-maintainer skill to...`
- or we can use the `$<skill-name>` syntax, which creates a link to the skill, e.g., `Use the $docs-maintainer skill to...`

There are some example skills from the course in [`.agents/skills/`](.agents/skills/).

##### Skill Examples

- code-review
- python-library-scaffold: if we start new projects often, we can set up a template
- lint-and-typecheck: run linters and typecheckers, and fix the errors
- pytest-fix-loop: run pytest, and fix the errors in a loop until all tests pass
- check-repo-conventions
- notebook-to-module
- analyze-training-logs
- pr-review-checklist
- api-docs-from-code
- wiki-post-edit
- pr-review
- ...

#### Advanced Skills: References and Scripts

There two skills [`.agents/skills/`](.agents/skills/) which implement *references* and *scripts*:

- `.agents/skills/modern-best-practice-react-components` has a `references/` folder with a Markdown inside, which is quite extensive; but it will be loaded only when needed.
- `.agents/skills/sqlite-explorer` has a `scripts/` folder with a SQL script inside, which is executed when needed.

In their respective `SKILL.md` files, we make reference to these files:

```markdown
**AVOID** `useEffect()`. See the ["You Might Not Need An Effect" guide](references/you-dont-need-useeffect.md) for detailed guidance.
...
**Use Bun script**: `sqlite-explorer.ts`. You find a `sqlite-explorer.ts` script (which must be executed using Bun!) in [`${SKILL_DIR}/scripts/sqlite-explorer.ts`](scripts/sqlite-explorer.ts) that implements this skill. It accepts command-line arguments to specify the database path, query, and mode (read-only vs write).
...
```

#### Built-IN Skill Creator

Codex ships with a built-in *skill creator*, which is lauched with `$skill-creator`.
It then asks which skill we want to create (and we need to answer the questions).

1. skill name and description
2. example prompts to trigger it
3. reusable resources we might want: references, scripts, etc.
4. where to place it

This *skill creator* creates an optional file `.../<skill-name>/agents/openai.yaml` with a nicedisplay name and short description which is used when we run `/skills`.

#### Adding 3rd Party Skills

We can install/find (3rd party) skills in several ways:

- In the Codex app: left pannel > Skills > We can select and add any skill curated by OpenAI. They are added to the global `conf.toml`.
- In the IDE: Settings > Skill Settings > We can select and add any skill curated by OpenAI.
- We can open [https://skills.sh/](https://skills.sh/), find a skill we like (and check it's safe) and the install it with the provided command; we often 
- In the CLI: with the `$find-skills <description>` we find the skill in our skill set. 

#### Feedback Loops, Reviews and Tests

We should make sure that Codex/the agent self-verfies its outputs:

- Linting
- Type checks
- Building the project
- Automated tests (unit, E2E, etc.)
- Give browser access to self-iterate the outputs (in case the output is a web app, for instance)

We should prompt Codex to do that and provide the necessary instructions and tools (MCP servers):

- pylint
- mypy
- uv, poetry
- pytest
- ...

Recall that we can also add the documentation in the prompt:

```text
Implement E2E tests with pytest
<pytest_documentation>
[Pasted Content X chars]
</pytest_documentation>
```

Usually, using *plan mode* (`SHIFT + TAB`) is a good idea in this case, to give the model more time to process the information and create a better plan.

Note that maybe it makes sense to add in the `AGENTS.md` file that we need to lint, run tests & Co. if available! Provide briefly the command for that: *ALWAYS run unit tests via `poetry run pytest`*.

Codex has also a built-in *code reviewer* which can review the uncommitted changes or the committed changes against the base branch:

- App/IDE: `/` > Code Review
- CLI: `/review` slash command

Whenever the agent has performed important changes in the codebase, we should use this.

#### Browser Access for Self-Review

One way of achieving that is using the [Playwright MCP](https://github.com/microsoft/playwright-mcp).

Playwright opens a Chromium browser and gives access to it to Codex; we basically open the page we want and let Codex interact with it:

- Go to URL
- Capture screenshots
- Refresh
- Click on things
- ...

As explained in the link, we can install it in codex as follows:

```bash
codex mcp add playwright npx "@playwright/mcp@latest"
```

Alternatively, we can add it manually in the `config.toml` file:

```toml
[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]
```

We can check that with `/mcp` slash command.

Then, we can give browser access to Codex with a prompt instruction like this:

```text
Can you check how the app looks in the browser? Use the Playwright MCP to open http://localhost:3000 and check if the UI looks good? Click around and check if there are any errors in the console.
```

Similarly to testing, it is convenient to add the instruction of verifying the app in the browser in the `AGENTS.md` file, so that it is always loaded in context: *ALWAYS use Playwright MCP to verify changes that have an impact on the UI or user experience*.

#### Forking Sessions

We can fork sessions: `/fork`. This opens the possibility of exploring different approaches in parallel:

- In a sessions, we fork it; so we have 2 sessions with the same context and instructions.
- We post the same prompt in the two sessions, and change to plan mode `SHIFT + TAB`.
- Each session will produce a different output/solution!

#### Codex Cloud Setup

We can run Codex in the Cloud: [https://chatgpt.com/codex](https://chatgpt.com/codex).

To that end, we need to grant access to our GitHub account, and then we can select the repositories we want to work on with Codex. Then, the repo(s) are cloned in the cloud (on OpenAI's servers), and we can start working on them.

We can even ask to launch several Codex agents (1-4x versions) so that different approaches are implemented.

The agents create the pull requests by themselves, and we can review them and merge them if we like the changes.

**Important**: we need to create a *cloud environment*: [https://chatgpt.com/codex](https://chatgpt.com/codex) > Settings > Create Environment:

- Select repo
- Container image
- Environment variables (visible)
- Cached container or not
- Secrets (hidden)
- Setup script (e.g., `pip install -r requirements.txt`)
- Maintenance script (run when containers are resumed from cached state)
- Agent internet access: OFF by default; we can also define a domain whitelist. Note that the Cloud session will run without us interacting with it.

Then, we can select that environment when we start a new session.

#### Codex Cloud Usage

Instead of using the web app on [https://chatgpt.com/codex](https://chatgpt.com/codex), we can also use the CLI or the IDE, and select the Cloud environment when starting a new session.

```bash
codex cloud --help

Commands:
  exec    Submit a new Codex Cloud task without launching the TUI
  status  Show the status of a Codex Cloud task
  list    List Codex Cloud tasks
  apply   Apply the diff for a Codex Cloud task locally
  diff    Show the unified diff for a Codex Cloud task
  help    Print this message or the help of the given subcommand(s)
```

We see we can submit a new task with `exec`, check the status with `status`, list all the tasks with `list`.

It is also possible to toggle/send a task to the cloud from the Codex app or the IDE: *composer* box, click on the `Local` icon, and select remote/cloud. We need a cloud environment for that, as explained in the previous section.

If the `Cloud` execution is selected, even though we are using the CLI/IDE/App, the execution happens in the Cloud.

We can also run the *plan mode* locally and then send the task to the cloud!

On the web interface [https://chatgpt.com/codex](https://chatgpt.com/codex), we'll see the tasks, and we can open an observation shell into them.

Usual workflow:

- Run *plan mode* locally, to check the plan and make sure it is good.
- Send the task to the Cloud, where it is executed.
- Check the status and logs in the Cloud.
- Check the task is finished and pick its id: `codex cloud list`
- Fetch the diff and apply it locally: `codex cloud apply <task-id>`
- Now, we have the results locally, we can review them, test them, etc.
- Commit and push the changes if we like them.

#### Codex App Automations

In the Codex app, we can create *automations*, which are custom workflows that can be triggered with a slash command or a button.

Example: Update `AGENTS.md` with new instructions for the agents, and add a summary of the changes in the commit message.

- Assign to a project
- Select when: days, times, etc.


