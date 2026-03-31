# Anthropic API Guide

Sources:

- [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action)
- [Claude 101](https://anthropic.skilljar.com/claude-101)
- [Building with the Claude API](https://anthropic.skilljar.com/claude-with-the-anthropic-api)
- [Anthropic Python SDK (GitHub)](https://github.com/anthropics/anthropic-sdk-python)
- [Anthropic API Reference](https://platform.claude.com/docs/en/api/getting-started)
- [Anthropic Courses](https://anthropic.skilljar.com)

See also the companion notebook with runnable examples: [`anthropic_examples.ipynb`](./anthropic_examples.ipynb).

Table of contents:

- [Anthropic API Guide](#anthropic-api-guide)
  - [Setup](#setup)
    - [Getting an Anthropic API Key](#getting-an-anthropic-api-key)
    - [Storing the Key in `.env`](#storing-the-key-in-env)
    - [Installation](#installation)
  - [1. Basic Message](#1-basic-message)
  - [2. Multi-Turn Conversation](#2-multi-turn-conversation)
  - [3. Streaming](#3-streaming)
  - [4. Tool Use / Function Calling](#4-tool-use--function-calling)
  - [5. Structured Output with Pydantic](#5-structured-output-with-pydantic)
  - [6. Vision (Image Input)](#6-vision-image-input)
  - [7. Extended Thinking](#7-extended-thinking)
  - [8. Async Client](#8-async-client)
  - [9. Token Counting](#9-token-counting)
  - [Model Reference](#model-reference)

## Setup

### Getting an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com) and sign in or create an account.
2. Navigate to **API Keys** in the left sidebar.
3. Click **Create Key**, give it a name, and copy it immediately — it won't be shown again.

> **Billing note:** Add a payment method under **Settings → Billing** and purchase credits before the key will work for API calls.

### Storing the Key in `.env`

Create a `.env` file at the root of your project (git-ignored):

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Add `.env` to `.gitignore` if not already there:

```bash
echo ".env" >> .gitignore
```

### Installation

```bash
conda activate agents      # or your environment
pip install anthropic python-dotenv
```

The client auto-reads `ANTHROPIC_API_KEY` from the environment. Load it via `dotenv`:

```python
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()              # reads .env into os.environ
client = Anthropic()       # picks up ANTHROPIC_API_KEY automatically
```

## 1. Basic Message

Every request requires a `model`, `max_tokens`, and a `messages` list. The `system` prompt is a top-level parameter (not a message role).

```python
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()
client = Anthropic()

message = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=256,
    system="You are a concise assistant.",
    messages=[
        {"role": "user", "content": "What is the capital of Japan?"},
    ],
)

print(message.content[0].text)
# Tokyo
```

Key response fields:

| Field | Description |
|---|---|
| `content[0].text` | The text reply |
| `stop_reason` | `"end_turn"`, `"max_tokens"`, `"tool_use"`, … |
| `usage.input_tokens` | Tokens consumed by the input |
| `usage.output_tokens` | Tokens consumed by the output |
| `model` | Exact model version used |

## 2. Multi-Turn Conversation

Maintain history by appending each assistant reply to the messages list. Note: roles must alternate `user` / `assistant`.

```python
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()
client = Anthropic()

messages = []

def chat(user_input: str) -> str:
    messages.append({"role": "user", "content": user_input})
    response = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=256,
        system="You are a helpful assistant.",
        messages=messages,
    )
    reply = response.content[0].text
    messages.append({"role": "assistant", "content": reply})
    return reply

print(chat("My name is Alice."))
print(chat("What is my name?"))   # model remembers: "Your name is Alice."
```

## 3. Streaming

Use the `.stream()` context manager to receive tokens as they are generated.

```python
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()
client = Anthropic()

with client.messages.stream(
    model="claude-haiku-4-5",
    max_tokens=256,
    messages=[{"role": "user", "content": "Write a haiku about Python."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()

# Access final message with usage stats
final = stream.get_final_message()
print(f"Input tokens:  {final.usage.input_tokens}")
print(f"Output tokens: {final.usage.output_tokens}")
```

Alternatively, use `stream=True` for a lower-level chunk iterator:

```python
with client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=256,
    messages=[{"role": "user", "content": "Write a haiku about Python."}],
    stream=True,
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            print(event.delta.text, end="", flush=True)
print()
```

## 4. Tool Use / Function Calling

Define tools with `input_schema`. The model returns a `tool_use` block; you execute the function and return a `tool_result` to get the final answer.

```python
import json
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()
client = Anthropic()

# 1. Define tools
tools = [
    {
        "name": "get_weather",
        "description": "Return current weather for a city.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
            },
            "required": ["city"],
        },
    }
]

# 2. First call — model may request a tool
messages = [{"role": "user", "content": "What's the weather in Tokyo?"}]
response = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=256,
    tools=tools,
    messages=messages,
)

print("Stop reason:", response.stop_reason)  # "tool_use"

# 3. Execute the tool and return the result
if response.stop_reason == "tool_use":
    tool_use_block = next(b for b in response.content if b.type == "tool_use")
    tool_name = tool_use_block.name
    tool_input = tool_use_block.input
    print(f"Tool called: {tool_name} | {tool_input}")

    # Your actual implementation here:
    tool_result = {"temperature": 18, "condition": "Cloudy", "city": tool_input["city"]}

    messages.append({"role": "assistant", "content": response.content})
    messages.append({
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": tool_use_block.id,
                "content": json.dumps(tool_result),
            }
        ],
    })

    # 4. Second call — model produces the final answer
    final = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=256,
        tools=tools,
        messages=messages,
    )
    print("\nFinal answer:", final.content[0].text)
```

## 5. Structured Output with Pydantic

Use `client.messages.parse()` with `output_format` set to a Pydantic model. The SDK converts it to JSON schema and parses the reply back into typed Python objects.

```python
import pydantic
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()
client = Anthropic()

class CalendarEvent(pydantic.BaseModel):
    title: str
    date: str
    time: str
    attendees: list[str]
    location: str | None = None

parsed = client.messages.parse(
    model="claude-sonnet-4-5",
    max_tokens=512,
    output_format=CalendarEvent,
    messages=[{
        "role": "user",
        "content": "Extract: Team meeting tomorrow at 3pm with Alice and Bob in Room A.",
    }],
)

event = parsed.parsed_output
print(f"Title:     {event.title}")
print(f"Date:      {event.date}")
print(f"Time:      {event.time}")
print(f"Attendees: {', '.join(event.attendees)}")
print(f"Location:  {event.location}")
```

## 6. Vision (Image Input)

Pass images alongside text in `content`. Supports both public URLs and base64-encoded local files.

```python
import base64
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()
client = Anthropic()

# --- Option A: image URL ---
response = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=256,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "url",
                    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/2023_06_08_Raccoon1.jpg/400px-2023_06_08_Raccoon1.jpg",
                },
            },
            {"type": "text", "text": "What animal is in this image?"},
        ],
    }],
)
print(response.content[0].text)

# --- Option B: local file (base64) ---
with open("photo.jpg", "rb") as f:
    b64 = base64.b64encode(f.read()).decode()

response = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=256,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": b64,
                },
            },
            {"type": "text", "text": "Describe this image."},
        ],
    }],
)
print(response.content[0].text)
```

> **Note:** Supported media types are `image/jpeg`, `image/png`, `image/gif`, `image/webp`.

## 7. Extended Thinking

Enable Claude to reason step-by-step before answering. Set `thinking.type = "enabled"` and allocate a `budget_tokens` for internal reasoning. The response includes both a `thinking` block and the final `text` block.

```python
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()
client = Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=8000,
    thinking={
        "type": "enabled",
        "budget_tokens": 5000,   # tokens reserved for internal reasoning
    },
    messages=[{
        "role": "user",
        "content": "A train leaves Chicago at 9am at 60 mph. Another leaves New York at 10am at 80 mph toward Chicago (800 miles apart). When and where do they meet?",
    }],
)

for block in response.content:
    if block.type == "thinking":
        print("=== Thinking ===")
        print(block.thinking[:300], "...\n")   # truncated for readability
    elif block.type == "text":
        print("=== Answer ===")
        print(block.text)
```

> **Note:** Extended thinking requires `claude-sonnet-4-5` or later, and `max_tokens` must be larger than `budget_tokens`.

## 8. Async Client

Use `AsyncAnthropic` for non-blocking calls in async frameworks (FastAPI, asyncio).

```python
import asyncio
from dotenv import load_dotenv
from anthropic import AsyncAnthropic

load_dotenv()
client = AsyncAnthropic()

async def main():
    # Basic async message
    response = await client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=256,
        messages=[{"role": "user", "content": "Name three planets."}],
    )
    print(response.content[0].text)

    # Async streaming
    async with client.messages.stream(
        model="claude-haiku-4-5",
        max_tokens=256,
        messages=[{"role": "user", "content": "Count to five."}],
    ) as stream:
        async for text in stream.text_stream:
            print(text, end="", flush=True)
    print()

asyncio.run(main())
```

## 9. Token Counting

Estimate token usage before making a call — useful for staying within context limits and estimating cost.

```python
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()
client = Anthropic()

count = client.messages.count_tokens(
    model="claude-haiku-4-5",
    system="You are a helpful assistant.",
    messages=[
        {"role": "user",      "content": "Hello, how are you?"},
        {"role": "assistant", "content": "I'm doing well, thank you!"},
        {"role": "user",      "content": "Can you explain quantum entanglement?"},
    ],
)

print(f"Estimated input tokens: {count.input_tokens}")
```

## Model Reference

| Model | Context | Best for |
|---|---|---|
| `claude-opus-4-5` | 200k | Most capable, complex tasks |
| `claude-sonnet-4-5` | 200k | Balanced performance/cost |
| `claude-haiku-4-5` | 200k | Fast, cost-efficient |
| `claude-sonnet-4-5` | 200k | Extended thinking, tool use |

> Models are updated frequently. Check [platform.claude.com/docs/en/models](https://platform.claude.com/docs/en/models/overview) for the latest list and exact version strings (e.g., `claude-haiku-4-5-20251001`).
