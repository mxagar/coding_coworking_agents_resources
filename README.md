# Coding and Co-Working Agents: Guides and Resources

This project contains resources related to coding and co-working agents.

Each subdirectory contains a README file with specific information about the resources and guides related to that particular agent framework or topic.

- [`codex/`](./codex/)
- [`claude_code/`](./claude_code/)
- [`mcp/`](./mcp/)
- [`n8n/`](./n8n/)
- [`open_claw/`](./open_claw/)

## Collection of Other Resources

- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [Worktrunk](https://worktrunk.dev/)
- [Cmux](https://cmux.com/)

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

## Authorship

Mikel Sagardia, 2026.  
No guarantees.  
