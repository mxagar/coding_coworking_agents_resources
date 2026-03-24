# Multiple Agents in Local/Cloud Hybrid Setup

Let's consider a Codex-style multi-agent setup with these agents, which are both local and cloud-based:

- Planner (local, Ollama, RTX 3060) -> Qwen 14B Q4
- Coder (API) -> GPT-5.4 (OpenAI)
- Helper (local, Ollama, RTX 3060) -> Qwen 3B

Local machine: RTX 3060, 12GB RAM, running Ollama with Qwen 14B and Qwen 3B models.

Repo structure:

```
your-repo/
├─ .codex/
│  ├─ config.toml
│  └─ agents/
│     ├─ planner.toml
│     ├─ coder.toml
│     └─ helper.toml
└─ AGENTS.md
```

Ollama is started:

```bash
ollama pull qwen2.5-coder:14b
ollama pull qwen2.5:3b
ollama serve
# Models exposed to
# http://localhost:11434/v1
```

Main config (`~/.codex/config.toml`):

```toml
# Default agent (fallback)
model = "gpt-5.4"
model_provider = "openai"
model_reasoning_effort = "medium"

# OpenAI provider
[model_providers.openai]
name = "OpenAI"
base_url = "https://api.openai.com/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"

# Local Ollama provider
[model_providers.ollama_local]
name = "Ollama Local"
base_url = "http://localhost:11434/v1"
env_key = "OLLAMA_API_KEY"
wire_api = "responses"

# Subagents
[agents.planner]
description = "Breaks tasks into steps and decides execution strategy."
config_file = "agents/planner.toml"

[agents.coder]
description = "Implements code, fixes bugs, performs refactors."
config_file = "agents/coder.toml"

[agents.helper]
description = "Performs fast auxiliary tasks like summarization or test suggestions."
config_file = "agents/helper.toml"
```

Planner config (`.codex/agents/planner.toml`):

```toml
model = "qwen2.5-coder:14b"
model_provider = "ollama_local"
model_reasoning_effort = "low"

approval_policy = "never"
sandbox_mode = "read-only"
web_search = "disabled"
```

Coder config (`.codex/agents/coder.toml`):

```toml
model = "gpt-5.4"
model_provider = "openai"
model_reasoning_effort = "high"

approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

Helper config (`.codex/agents/helper.toml`):

```toml
model = "qwen2.5:3b"
model_provider = "ollama_local"
model_reasoning_effort = "low"

approval_policy = "never"
sandbox_mode = "read-only"
```

Agent behavior description in `AGENTS.md`:

```markdown
# Agent roles

## planner
Use for:
- task decomposition
- identifying relevant files
- deciding workflow

Do NOT write final code.

---

## coder
Use for:
- implementing changes
- debugging
- refactoring
- producing final output

---

## helper
Use for:
- summarization
- file analysis
- test suggestions
- log classification

---

# Execution policy

1. Start with planner for complex tasks
2. Run helper in parallel for mechanical tasks
3. Use coder for final implementation
4. Avoid using coder for trivial work
5. Avoid using planner for execution
```

Environment variables:

```bash
export OPENAI_API_KEY="your_key"
export OLLAMA_API_KEY="ollama"   # can be dummy locally
```

Example prompt for Codex:

```
Use planner first to break down the task.

In parallel, use helper to summarize relevant files and propose tests.

Then use coder to implement the solution.

Do not use coder for simple file inspection tasks.
```

Necessary upgrades so that this works smoothly:

- increase VRAM! :)
- helper: increase at least to 7B
- planner: increase at least to 32B
- add critic agent

