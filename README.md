# Coding and Co-Working Agents: Guides and Resources

This project contains resources related to coding and co-working agents.

- [Coding and Co-Working Agents: Guides and Resources](#coding-and-co-working-agents-guides-and-resources)
  - [Codex CLI](#codex-cli)
    - [Resources](#resources)
    - [Setup](#setup)
    - [Basic Usage](#basic-usage)
    - [Other Command Line Options](#other-command-line-options)
    - [Other Subcommands](#other-subcommands)
    - [Slash Commands](#slash-commands)
    - [Features](#features)


## Codex CLI

### Resources

- [https://developers.openai.com/codex/cli](https://developers.openai.com/codex/cli)
- ...

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

### Features

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
