# Anthropic API Guide

Sources:

- [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action)
- [Claude 101](https://anthropic.skilljar.com/claude-101)
- [Claude Code Documentation](https://code.claude.com/docs)
- [Claude Code Common Workflows](https://code.claude.com/docs/en/common-workflows)
- [Claude API Quickstarts](https://github.com/anthropics/claude-quickstarts/tree/main)
- [Building with the Claude API](https://anthropic.skilljar.com/claude-with-the-anthropic-api)
- [Introduction to Model Context Protocol](https://anthropic.skilljar.com/introduction-to-model-context-protocol)
- [Model Context Protocol: Advanced Topics](https://anthropic.skilljar.com/model-context-protocol-advanced-topics)
- [Introduction to agent skills](https://anthropic.skilljar.com/introduction-to-agent-skills)
- [Introduction to subagents](https://anthropic.skilljar.com/introduction-to-subagents)
- [Anthropic Courses](https://anthropic.skilljar.com)

## Setup

First, create a Python environment which contains the `anthropic` library. You can use the following recipe to based on [conda](https://docs.conda.io/en/latest/) and [pip-tools](https://github.com/jazzband/pip-tools):

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

Then, get an Anthropic API Key:

1. Go to [console.anthropic.com](https://console.anthropic.com) or [https://platform.claude.com](https://platform.claude.com) and sign in or create an account.
2. Navigate to **API Keys** in the left sidebar.
3. Click **Create Key**, give it a name, and copy the key immediately -- it won't be shown again.

> **Billing note:** Add a payment method under **Settings --> Billing** and purchase credits before the key will work for API calls.

Finally, create a `.env` file at the root of your project (it must be git-ignored) and paste the key there:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Then, load the key in your code using `dotenv` (`pip install python-dotenv`):

```python
from dotenv import load_dotenv
import os

load_dotenv()

# This is not necessary, because the Anthropic API client will automatically look for the key in the environment variables.
api_key = os.getenv("ANTHROPIC_API_KEY")
```
