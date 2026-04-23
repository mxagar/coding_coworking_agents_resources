# Coding and Co-Working Agents: Guides and Resources

This project contains resources related to coding and co-working agents.

Each subdirectory contains a README file with specific information about the resources and guides related to that particular agent framework or topic.

- [`claude/`](./claude/)
- [`codex/`](./codex/)
- [`opencode/`](./opencode/)
- [`mcp/`](./mcp/)
- [`openai_api/`](./openai_api)
- [`anthropic_api/`](./anthropic_api/)

## Collection of Other Resources

- [ ] [GitHub Spec-Kit](https://github.com/github/spec-kit)
- [ ] [qdm](https://github.com/tobi/qmd)
- [ ] [LLM Wiki (Karpathy)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [ ] [Autoresaerch (Karphathy)](https://github.com/karpathy/autoresearch)
- [ ] [Worktrunk](https://worktrunk.dev/)
- [ ] [Cmux](https://cmux.com/)
- [ ] [Claude Cookbooks](https://github.com/anthropics/claude-cookbooks)
- [ ] [System Prompts Leaks: Claude Code](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/claude-code.md)
- [ ] [Claude Memory Management](https://github.com/thedotmack/claude-mem): it can be installed via `/plugin`.

## Setup

Each subdirectory may contain its own setup instructions. If you need a generic Python environment, you can use the following recipe to based on [conda](https://docs.conda.io/en/latest/) and [pip-tools](https://github.com/jazzband/pip-tools):

```bash
# Create the necessary Python environment
conda env create -f conda.yaml
conda activate agents

# Compile and install all dependencies
pip-compile requirements.in
pip-sync requirements.txt

# If we need a new dependency,
# add it to requirements.in 
# And then:
pip-compile requirements.in
pip-sync requirements.txt
```

The environment variables are stored in the `.env` file, which is ignored by git. You can create a `.env` file with the necessary environment variables for your setup.

```bash
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Authorship

Mikel Sagardia, 2026.  
No guarantees.  
