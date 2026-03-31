# OpenAI API Guide

Resources used:

- [OpenAI Python Library (GitHub)](https://github.com/openai/openai-python)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [OpenAI Platform Documentation](https://platform.openai.com/docs)

See also the companion notebook with runnable examples: [`openai_examples.ipynb`](./openai_examples.ipynb).

Table of contents:

- [OpenAI API Guide](#openai-api-guide)
  - [Setup](#setup)
    - [Getting an OpenAI API Key](#getting-an-openai-api-key)
    - [Storing the Key in `.env`](#storing-the-key-in-env)
    - [Installation](#installation)
  - [1. Basic Chat Completion](#1-basic-chat-completion)
  - [2. Multi-Turn Conversation](#2-multi-turn-conversation)
  - [3. Streaming](#3-streaming)
  - [4. Structured Output with Pydantic](#4-structured-output-with-pydantic)
  - [5. Tool Use / Function Calling](#5-tool-use--function-calling)
  - [6. Vision (Image Input)](#6-vision-image-input)
  - [7. Embeddings](#7-embeddings)
  - [8. Async Client](#8-async-client)
  - [Model Reference](#model-reference)

## Setup

### Getting an OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com) and sign in or create an account.
2. Navigate to **Dashboard --> API Keys** (or go directly to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)).
3. Click **Create new secret key**, give it a name, and copy it immediately — it won't be shown again.

> **Billing note:** Add a payment method under **Settings --> Billing** and purchase credits (or set up auto-recharge) before the key will work. New accounts may receive a small free credit allocation.

### Storing the Key in `.env`

Create a `.env` file at the root of your project (git-ignored):

```env
OPENAI_API_KEY=sk-...
```

Add `.env` to `.gitignore` if not already there:

```bash
echo ".env" >> .gitignore
```

### Installation

```bash
conda activate agents      # or your environment
pip install openai python-dotenv
```

The client auto-reads `OPENAI_API_KEY` from the environment. Load it via `dotenv`:

```python
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()              # reads .env into os.environ
client = OpenAI()          # picks up OPENAI_API_KEY automatically
```

## 1. Basic Chat Completion

The core API. Every request is a list of `messages`, each with a `role` (`system`, `user`, `assistant`) and `content`.

```python
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a concise assistant."},
        {"role": "user",   "content": "What is the capital of Japan?"},
    ],
)

print(response.choices[0].message.content)
# Tokyo
```

Key response fields:

| Field | Description |
|---|---|
| `choices[0].message.content` | The text reply |
| `choices[0].finish_reason` | `"stop"`, `"length"`, `"tool_calls"`, … |
| `usage.prompt_tokens` | Tokens consumed by the input |
| `usage.completion_tokens` | Tokens consumed by the output |
| `usage.total_tokens` | Total tokens |

## 2. Multi-Turn Conversation

Maintain history by appending each assistant reply to the messages list before the next turn.

```python
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

messages = [{"role": "system", "content": "You are a helpful assistant."}]

def chat(user_input: str) -> str:
    messages.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )
    reply = response.choices[0].message.content
    messages.append({"role": "assistant", "content": reply})
    return reply

print(chat("My name is Alice."))
print(chat("What is my name?"))   # model remembers: "Your name is Alice."
```

## 3. Streaming

Use `stream=True` (or the `.stream()` context manager) to receive tokens as they are generated.

```python
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

# Simple stream=True approach
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Write a haiku about Python."}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
print()
```

The `.stream()` context manager gives richer event types and access to the final completion object:

```python
with client.chat.completions.stream(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Write a haiku about Python."}],
    stream_options={"include_usage": True},
) as stream:
    for event in stream:
        if event.type == "content.delta":
            print(event.delta, end="", flush=True)

completion = stream.get_final_completion()
print(f"\nTotal tokens: {completion.usage.total_tokens}")
```

## 4. Structured Output with Pydantic

Use `client.chat.completions.parse()` with a Pydantic model as `response_format`. The SDK converts the model to JSON schema, sends it to the API, and parses the reply back into typed Python objects.

```python
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

class Step(BaseModel):
    explanation: str
    output: str

class MathResponse(BaseModel):
    steps: List[Step]
    final_answer: str

completion = client.chat.completions.parse(
    model="gpt-4o-2024-08-06",          # structured output requires gpt-4o Aug 2024+
    messages=[
        {"role": "system", "content": "You are a math tutor."},
        {"role": "user",   "content": "Solve: 8x + 31 = 2"},
    ],
    response_format=MathResponse,
)

message = completion.choices[0].message
if message.parsed:
    for step in message.parsed.steps:
        print(f"{step.explanation}  -->  {step.output}")
    print("Answer:", message.parsed.final_answer)
else:
    print("Refusal:", message.refusal)
```

> **Note:** Structured output works with `gpt-4o-2024-08-06` and later. For older models use `response_format={"type": "json_object"}` and parse manually.

## 5. Tool Use / Function Calling

Define tools as JSON schemas. The model decides when to call them; you execute the function and feed the result back.

```python
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

# 1. Define the tool schema
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Return current weather for a city.",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "City name"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["city"],
            },
        },
    }
]

# 2. First call — model may request a tool
messages = [{"role": "user", "content": "What's the weather in Tokyo?"}]
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    tools=tools,
    tool_choice="auto",
)

message = response.choices[0].message

# 3. If the model called a tool, execute it and return the result
if message.tool_calls:
    tool_call = message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)

    # Your actual implementation here:
    tool_result = {"temperature": 18, "condition": "Cloudy", "city": args["city"]}

    messages.append(message)   # assistant message with tool_calls
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(tool_result),
    })

    # 4. Second call — model produces the final answer
    final = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        tools=tools,
    )
    print(final.choices[0].message.content)
```

## 6. Vision (Image Input)

Pass images alongside text by using a list in `content`. Supports public URLs and base64-encoded local files.

```python
import base64
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

# --- Option A: image URL ---
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text",      "text": "What is in this image?"},
                {"type": "image_url", "image_url": {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/2023_06_08_Raccoon1.jpg/400px-2023_06_08_Raccoon1.jpg"}},
            ],
        }
    ],
)
print(response.choices[0].message.content)

# --- Option B: local file (base64) ---
with open("photo.jpg", "rb") as f:
    b64 = base64.b64encode(f.read()).decode()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text",      "text": "Describe this image."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
            ],
        }
    ],
)
print(response.choices[0].message.content)
```

## 7. Embeddings

Convert text into a numerical vector. Useful for semantic search, clustering, and RAG.

```python
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

# Single text
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="The quick brown fox jumps over the lazy dog.",
)
vector = response.data[0].embedding
print(f"Dimensions: {len(vector)}")   # 1536 for text-embedding-3-small

# Batch (list of strings)
texts = ["Hello world", "Bonjour le monde", "Hola mundo"]
response = client.embeddings.create(
    model="text-embedding-3-small",
    input=texts,
)
vectors = [item.embedding for item in response.data]
print(f"Got {len(vectors)} embeddings")

# Cosine similarity helper
import numpy as np

def cosine_similarity(a, b):
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

sim = cosine_similarity(vectors[0], vectors[1])
print(f"EN vs FR similarity: {sim:.3f}")
```

Available models:

| Model | Dimensions | Best for |
|---|---|---|
| `text-embedding-3-small` | 1536 | Cost-efficient general use |
| `text-embedding-3-large` | 3072 | Higher accuracy tasks |
| `text-embedding-ada-002` | 1536 | Legacy (prefer v3) |

## 8. Async Client

Use `AsyncOpenAI` for non-blocking calls in async frameworks (FastAPI, asyncio, etc.).

```python
import asyncio
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()
client = AsyncOpenAI()

async def main():
    # Basic async completion
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Name three planets."}],
    )
    print(response.choices[0].message.content)

    # Async streaming
    stream = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Count to five."}],
        stream=True,
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            print(delta, end="", flush=True)
    print()

asyncio.run(main())
```

## Model Reference

| Model | Context | Best for |
|---|---|---|
| `gpt-4o` | 128k | Multimodal, high accuracy |
| `gpt-4o-mini` | 128k | Fast, cost-efficient |
| `gpt-4o-2024-08-06` | 128k | Structured output, tool use |
| `o3` | 200k | Complex reasoning |
| `o4-mini` | 200k | Fast reasoning |
| `text-embedding-3-small` | — | Embeddings (cheap) |
| `text-embedding-3-large` | — | Embeddings (accurate) |

> Models are updated frequently. Check [platform.openai.com/docs/models](https://platform.openai.com/docs/models) for the latest list.
