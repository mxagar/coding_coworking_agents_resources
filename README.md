# Coding and Co-Working Agents: Guides and Resources

This project contains resources related to coding and co-working agents.

## Codex CLI

### Resources

- [https://developers.openai.com/codex/cli](https://developers.openai.com/codex/cli)
- ...

## Setup

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
- In an interactive session, we have the *slash commands*: `/status`.
- Non-interactive sessions are started with `codex exec ...`.
- Each conversation is a sessions; session history is usually saved in `~/.codex/`
- If we configure a session in a dir in a different way than the default, the configuration is saved in that directory under `.codex/`.
- TUI = Terminal UI, interactive CLI with menus, etc.

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

# Codex arguments
codex --model gpt-5.4
codex --cd "/path/to/dir". # override current dir
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
```

### Slash Commands

We run *slash commands* in an interactive session.

```bash
# Change model + reasoning level
/model

# Select permissions
/approvals
# default = RW in current dir
# full access

# Start fresh chat
/clear

# Copy last codex output
/copy

# Review local code: A dedicated agent for reviewing starts:
# review a branch, staged/uncommitted, a commit, custom 
/review
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