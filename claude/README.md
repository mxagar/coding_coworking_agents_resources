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
    - [Installation](#installation)
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

### Installation

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
```

Note that, as in Codex, there are 3 types of interaction interfaces:

- CLI
- Claude App
- IDE

## 2. Key Features and Efficient Usage

## 3. Beyond Local CLI Usage


