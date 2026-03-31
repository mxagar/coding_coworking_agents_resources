# OpenAI API Guide

[OpenAI API Documentation](https://developers.openai.com/api/docs)

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

Then, get an OpenAI API Key:

## Getting an OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com) and sign in or create an account.
2. Navigate to **Dashboard --> API Keys** (or go directly to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)).
3. Click **Create new secret key**, give it a name, and copy it immediately -- it won't be shown again.

> **Billing note:** Add a payment method under **Settings --> Billing** and purchase credits (or set up auto-recharge) before the key will work for API calls. New accounts may receive a small free credit allocation. If not there, try:
> - Home
> - Start building
> - ...

## Storing the Key in `.env`

Create a `.env` file at the root of your project (it must be git-ignored):

```env
OPENAI_API_KEY=sk-...


Finally, create a `.env` file at the root of your project (it must be git-ignored) and paste the key there:

```env
OPENAI_API_KEY=sk-...
```

Then, load the key in your code using `dotenv` (`pip install python-dotenv`):

```python
from dotenv import load_dotenv
import os

load_dotenv()

# This is not necessary, because the OpenAI API client will automatically look for the key in the environment variables.
api_key = os.getenv("OPENAI_API_KEY")
```
