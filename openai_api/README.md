# OpenAI API Guide

Resources used:

- [OpenAI Python Library (GitHub)](https://github.com/openai/openai-python)
- [OpenAI Agents SDK (GitHub)](https://github.com/openai/openai-agents-python)
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
  - [9. Audio and Speech](#9-audio-and-speech)
  - [10. Responses API](#10-responses-api)
  - [11. MCP Connectors](#11-mcp-connectors)
  - [12. Agents SDK](#12-agents-sdk)
  - [13. File Uploads and PDF Handling](#13-file-uploads-and-pdf-handling)
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

## 9. Audio and Speech

### 9a. Text-to-Speech (TTS)

Convert text to audio. Stream directly to a file to avoid loading the full response into memory.

```python
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

speech_file = Path("speech.mp3")

with client.audio.speech.with_streaming_response.create(
    model="tts-1",          # or "tts-1-hd" for higher quality
    voice="alloy",          # alloy, echo, fable, onyx, nova, shimmer
    input="The quick brown fox jumped over the lazy dogs.",
) as response:
    response.stream_to_file(speech_file)

print(f"Saved to {speech_file}")
```

Available voices: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`.

| Model | Quality | Speed |
|---|---|---|
| `tts-1` | Standard | Faster, lower latency |
| `tts-1-hd` | Higher fidelity | Slightly slower |

### 9b. Transcription (Speech-to-Text)

Transcribe an audio file with Whisper. Supports mp3, mp4, wav, webm, and more.

```python
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

with open("speech.mp3", "rb") as audio_file:
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        language="en",          # optional — auto-detected if omitted
        response_format="text", # "text", "json", "srt", "vtt", "verbose_json"
    )

print(transcription)
```

For word-level timestamps use `response_format="verbose_json"`:

```python
with open("speech.mp3", "rb") as audio_file:
    result = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="verbose_json",
        timestamp_granularities=["word"],
    )

for word in result.words:
    print(f"{word.word:20s} {word.start:.2f}s – {word.end:.2f}s")
```

### 9c. Translation (audio → English)

Translate non-English audio directly to English text:

```python
with open("french_audio.mp3", "rb") as audio_file:
    translation = client.audio.translations.create(
        model="whisper-1",
        file=audio_file,
    )
print(translation.text)
```

## 10. Responses API

The Responses API (`client.responses.*`) is OpenAI's newer, simpler interface. Key differences from Chat Completions:

- Single `input` string or list instead of a `messages` array
- `instructions` replaces the `system` message
- Built-in server-side tools: `web_search`, `file_search`, `code_interpreter`
- Stateful by default: pass `previous_response_id` to continue a conversation
- Background mode: pause and resume long-running generations

### 10a. Basic call

```python
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

response = client.responses.create(
    model="gpt-4o-mini",
    instructions="You are a concise assistant.",
    input="What is the capital of Japan?",
)
print(response.output_text)
```

### 10b. Multi-turn (stateful)

Pass `previous_response_id` to continue the conversation without resending history:

```python
r1 = client.responses.create(
    model="gpt-4o-mini",
    input="My name is Alice.",
)

r2 = client.responses.create(
    model="gpt-4o-mini",
    input="What is my name?",
    previous_response_id=r1.id,   # server remembers r1
)
print(r2.output_text)   # "Your name is Alice."
```

### 10c. Streaming

```python
with client.responses.stream(
    model="gpt-4o-mini",
    input="Write a haiku about Python.",
) as stream:
    for event in stream:
        if event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)

final = stream.get_final_response()
print(f"\n\nTotal tokens: {final.usage.total_tokens}")
```

### 10d. Structured output

Use `text_format` (or `client.responses.parse()`) with a Pydantic model:

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

rsp = client.responses.parse(
    model="gpt-4o-2024-08-06",
    input="Solve: 8x + 31 = 2",
    text_format=MathResponse,
)

parsed = rsp.output[0].content[0].parsed
for step in parsed.steps:
    print(f"{step.explanation}  →  {step.output}")
print("Answer:", parsed.final_answer)
```

### 10e. Built-in server-side tools

These tools run on OpenAI's infrastructure — no execution code needed on your side.

```python
# Web search
response = client.responses.create(
    model="gpt-4o-mini",
    tools=[{"type": "web_search_preview"}],
    input="What are the top Python news stories this week?",
)
print(response.output_text)

# Code interpreter
response = client.responses.create(
    model="gpt-4o-mini",
    tools=[{"type": "code_interpreter", "container": {"type": "auto"}}],
    input="Calculate the square root of 273 * 312821 + 1782. Show the Python code.",
)
print(response.output_text)
```

### 10f. Vision with Responses API

```python
response = client.responses.create(
    model="gpt-4o-mini",
    input=[{
        "role": "user",
        "content": [
            {"type": "input_text",  "text": "What animal is in this image?"},
            {"type": "input_image", "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/2023_06_08_Raccoon1.jpg/400px-2023_06_08_Raccoon1.jpg"},
        ],
    }],
)
print(response.output_text)
```

### 10g. Background mode (interruptible / resumable)

Start a long generation in the background, interrupt it, then resume:

```python
response_id = None

# Start and read a few events, then break
with client.responses.stream(
    model="gpt-4o-mini",
    input="Explain the history of computing in detail.",
    background=True,
) as stream:
    for i, event in enumerate(stream):
        if event.type == "response.created":
            response_id = event.response.id
        if event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)
        if i == 15:
            break   # interrupt after 15 events

print("\n\n--- resuming ---\n")

# Resume from where we left off
with client.responses.stream(
    response_id=response_id,
    starting_after=15,
) as stream:
    for event in stream:
        if event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)
```

## 11. MCP Connectors

The [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) provides first-class MCP support. Three transport types are available:

| Class | Transport | When to use |
|---|---|---|
| `MCPServerStdio` | Local subprocess (stdin/stdout) | Local MCP servers (e.g. `npx`, `uvx`) |
| `MCPServerSse` | HTTP + Server-Sent Events | Remote MCP servers via SSE |
| `MCPServerStreamableHttp` | Bidirectional HTTP streaming | Remote MCP servers via Streamable HTTP |

```bash
pip install openai-agents
```

### 11a. Local MCP server via stdio

```python
import asyncio
from agents import Agent, Runner
from agents.mcp import MCPServerStdio

async def main():
    async with MCPServerStdio(
        params={
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
        },
        cache_tools_list=True,   # cache the tool list for performance
    ) as mcp_server:
        agent = Agent(
            name="File Assistant",
            instructions="Use the filesystem tools to help the user.",
            mcp_servers=[mcp_server],
        )
        result = await Runner.run(agent, "List the files in /tmp.")
        print(result.final_output)

asyncio.run(main())
```

### 11b. Remote MCP server via SSE

```python
import asyncio
from agents import Agent, Runner
from agents.mcp import MCPServerSse

async def main():
    async with MCPServerSse(
        params={
            "url": "https://my-mcp-server.example.com/sse",
            "headers": {"Authorization": "Bearer MY_TOKEN"},
        },
        cache_tools_list=True,
    ) as mcp_server:
        agent = Agent(
            name="Remote Tool Agent",
            instructions="Use the available tools to answer questions.",
            mcp_servers=[mcp_server],
        )
        result = await Runner.run(agent, "What tools do you have?")
        print(result.final_output)

asyncio.run(main())
```

### 11c. Remote MCP server via Streamable HTTP

```python
import asyncio
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp

async def main():
    async with MCPServerStreamableHttp(
        params={"url": "https://my-mcp-server.example.com/mcp"},
        cache_tools_list=True,
    ) as mcp_server:
        agent = Agent(
            name="HTTP MCP Agent",
            instructions="Use tools from the MCP server.",
            mcp_servers=[mcp_server],
        )
        result = await Runner.run(agent, "Run a calculation for me.")
        print(result.final_output)

asyncio.run(main())
```

### 11d. Tool approval policy

Control which MCP tools require user approval before execution:

```python
from agents.mcp import MCPServerStdio

# Require approval for every call
server = MCPServerStdio(params={...}, require_approval="always")

# Never require approval (for trusted servers)
server = MCPServerStdio(params={...}, require_approval="never")

# Require approval only for specific tools
server = MCPServerStdio(
    params={...},
    require_approval={"always": {"tool_names": ["delete_file", "write_file"]}},
)
```

## 12. Agents SDK

The [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) (`openai-agents`) is a lightweight framework for building multi-step, multi-agent workflows. Core primitives: `Agent`, `Runner`, `@function_tool`, `handoffs`, `guardrails`, tracing.

```bash
pip install openai-agents
```

> **Skills:** In the Agents SDK, reusable capabilities are expressed as `@function_tool` decorated functions — the equivalent of what Codex CLI calls "skills". Bundle related tools in a module and import them into any agent.

### 12a. Basic agent

```python
import asyncio
from agents import Agent, Runner

agent = Agent(
    name="Assistant",
    instructions="You are a helpful, concise assistant.",
    model="gpt-4o-mini",
)

async def main():
    result = await Runner.run(agent, "What is the capital of Japan?")
    print(result.final_output)

asyncio.run(main())
```

### 12b. Function tools (`@function_tool`)

Decorate any Python function to turn it into a tool. Type hints and docstring become the schema automatically.

```python
import asyncio
from pydantic import BaseModel
from agents import Agent, Runner, function_tool

class Weather(BaseModel):
    city: str
    temperature_range: str
    conditions: str

@function_tool
def get_weather(city: str) -> Weather:
    """Get the current weather for a city.

    Args:
        city: The city name.
    """
    return Weather(city=city, temperature_range="14-20°C", conditions="Sunny")

agent = Agent(
    name="Weather Agent",
    instructions="Use the weather tool to answer questions.",
    tools=[get_weather],
)

async def main():
    result = await Runner.run(agent, "What's the weather in Tokyo?")
    print(result.final_output)

asyncio.run(main())
```

### 12c. Handoffs (multi-agent routing)

Route tasks to specialist agents automatically. The triage agent decides which specialist to call.

```python
import asyncio
from agents import Agent, Runner

history_agent = Agent(
    name="History Tutor",
    handoff_description="Specialist for historical questions.",
    instructions="Answer history questions clearly and concisely.",
)

math_agent = Agent(
    name="Math Tutor",
    handoff_description="Specialist for math questions.",
    instructions="Explain math step by step with worked examples.",
)

triage_agent = Agent(
    name="Triage Agent",
    instructions="Route each question to the right specialist.",
    handoffs=[history_agent, math_agent],
)

async def main():
    result = await Runner.run(triage_agent, "Who was the first US president?")
    print(f"Answer: {result.final_output}")
    print(f"Answered by: {result.last_agent.name}")

asyncio.run(main())
```

### 12d. Agent as a tool

Expose an agent as a callable tool instead of a full handoff — the orchestrator keeps control and the sub-agent just returns a result.

```python
from agents import Agent

translator = Agent(
    name="Translator",
    instructions="Translate the given text to the requested target language.",
)

orchestrator = Agent(
    name="Orchestrator",
    instructions="You coordinate translation tasks.",
    tools=[
        translator.as_tool(
            tool_name="translate_text",
            tool_description="Translate text to a given language.",
        ),
    ],
)
```

### 12e. Guardrails (input / output validation)

Attach guardrails to block unsafe tool inputs or outputs before they reach the model or the user.

```python
import json
from agents import (
    Agent, function_tool,
    tool_input_guardrail, tool_output_guardrail,
    ToolGuardrailFunctionOutput,
    ToolInputGuardrailData, ToolOutputGuardrailData,
)

@tool_input_guardrail
def block_sensitive_input(data: ToolInputGuardrailData) -> ToolGuardrailFunctionOutput:
    """Block tool calls whose arguments contain sensitive words."""
    args = json.loads(data.context.tool_arguments or "{}")
    for val in args.values():
        if "password" in str(val).lower():
            return ToolGuardrailFunctionOutput.reject_content(
                message="Blocked: argument contains 'password'.",
                output_info={"blocked": True},
            )
    return ToolGuardrailFunctionOutput(output_info="ok")

@tool_output_guardrail
def block_pii_output(data: ToolOutputGuardrailData) -> ToolGuardrailFunctionOutput:
    """Block tool outputs that contain a social security number pattern."""
    if "123-45-6789" in str(data.output):
        return ToolGuardrailFunctionOutput.raise_exception(
            output_info={"blocked": "SSN detected"},
        )
    return ToolGuardrailFunctionOutput(output_info="ok")

@function_tool(input_guardrails=[block_sensitive_input],
               output_guardrails=[block_pii_output])
def lookup_user(username: str) -> str:
    """Look up a user by username.

    Args:
        username: The username to look up.
    """
    return f"User info for {username}"
```

### 12f. Streaming events

Use `Runner.run_streamed()` to observe tool calls and message deltas as they happen:

```python
import asyncio
from agents import Agent, Runner, ItemHelpers, function_tool
import random

@function_tool
def how_many_jokes() -> int:
    """Return how many jokes to tell (1–5)."""
    return random.randint(1, 5)

agent = Agent(
    name="Joker",
    instructions="Call how_many_jokes, then tell exactly that many jokes.",
    tools=[how_many_jokes],
)

async def main():
    result = Runner.run_streamed(agent, "Tell me some jokes.")
    async for event in result.stream_events():
        if event.type == "run_item_stream_event":
            item = event.item
            if item.type == "tool_call_item":
                print(f"[tool call] {item.raw_item.name}")
            elif item.type == "tool_call_output_item":
                print(f"[tool output] {item.output}")
            elif item.type == "message_output_item":
                print(f"[message] {ItemHelpers.text_message_output(item)}")

asyncio.run(main())
```

### 12g. Usage tracking

```python
import asyncio
from agents import Agent, Runner, function_tool
from pydantic import BaseModel

class Weather(BaseModel):
    city: str
    temperature_range: str
    conditions: str

@function_tool
def get_weather(city: str) -> Weather:
    """Get weather for a city.
    Args:
        city: City name.
    """
    return Weather(city=city, temperature_range="14-20°C", conditions="Cloudy")

async def main():
    agent = Agent(name="Demo", instructions="Use tools if needed.", tools=[get_weather])
    result = await Runner.run(agent, "Weather in Paris?")
    usage = result.context_wrapper.usage
    print(f"Input tokens:  {usage.input_tokens}")
    print(f"Output tokens: {usage.output_tokens}")
    print(f"Total tokens:  {usage.total_tokens}")
    print(f"API requests:  {usage.requests}")

asyncio.run(main())
```

## 13. File Uploads and PDF Handling

OpenAI's Chat Completions and Responses APIs do not accept raw PDFs directly — you must parse the content first and send it as text and/or images.

**Strategy:**

1. **Text + structure** → extract with `pymupdf` (fitz) or `pdfplumber`; send as a plain-text message.
2. **Images inside the PDF** → extract as PNG/JPEG with `pymupdf`; send as `image_url` (base64).
3. **Tables** → extract with `pdfplumber` → CSV or Markdown; embed in the text message.

```bash
pip install pymupdf pdfplumber
```

### 13a. Extract text from a PDF

```python
import fitz   # pymupdf

def pdf_to_text(pdf_path: str) -> str:
    """Extract all text from a PDF, page by page."""
    doc = fitz.open(pdf_path)
    pages = []
    for i, page in enumerate(doc):
        pages.append(f"--- Page {i + 1} ---\n{page.get_text()}")
    doc.close()
    return "\n\n".join(pages)

text = pdf_to_text("report.pdf")
print(text[:500])
```

### 13b. Send PDF text to OpenAI

```python
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

text = pdf_to_text("report.pdf")

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a document analyst."},
        {"role": "user",   "content": f"Summarise this document:\n\n{text}"},
    ],
)
print(response.choices[0].message.content)
```

> **Context limit:** A dense 20-page PDF can easily exceed 50k tokens. For large documents consider chunking the text or using RAG with embeddings (see section 7).

### 13c. Extract images from a PDF and send them

```python
import base64
import fitz
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

def extract_images_from_pdf(pdf_path: str) -> list[dict]:
    """Return a list of base64-encoded images extracted from the PDF."""
    doc = fitz.open(pdf_path)
    images = []
    for page_num, page in enumerate(doc):
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            img_bytes = base_image["image"]
            img_ext   = base_image["ext"]   # "png", "jpeg", etc.
            b64 = base64.b64encode(img_bytes).decode()
            images.append({
                "page": page_num + 1,
                "index": img_index,
                "mime": f"image/{img_ext}",
                "b64": b64,
            })
    doc.close()
    return images

images = extract_images_from_pdf("report.pdf")
print(f"Found {len(images)} images")

if images:
    img = images[0]
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": f"Describe this figure from page {img['page']} of a PDF."},
                {"type": "image_url", "image_url": {
                    "url": f"data:{img['mime']};base64,{img['b64']}"
                }},
            ],
        }],
    )
    print(response.choices[0].message.content)
```

### 13d. Extract tables from a PDF

`pdfplumber` finds table regions precisely. Export to CSV or convert to a Markdown table to include in the message.

```python
import io
import csv
import pdfplumber

def extract_tables_as_markdown(pdf_path: str) -> str:
    """Extract all tables from a PDF and return them as Markdown."""
    md_tables = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            for t_idx, table in enumerate(page.extract_tables()):
                if not table:
                    continue
                header = table[0]
                rows   = table[1:]
                # Build Markdown table
                lines = ["| " + " | ".join(str(c or "") for c in header) + " |"]
                lines.append("|" + "|".join("---" for _ in header) + "|")
                for row in rows:
                    lines.append("| " + " | ".join(str(c or "") for c in row) + " |")
                md_tables.append(
                    f"**Table {t_idx + 1} (page {page_num + 1}):**\n" + "\n".join(lines)
                )
    return "\n\n".join(md_tables)

tables_md = extract_tables_as_markdown("report.pdf")
print(tables_md[:600])
```

Send the Markdown tables together with the page text:

```python
text   = pdf_to_text("report.pdf")
tables = extract_tables_as_markdown("report.pdf")

combined = f"{text}\n\n## Tables\n\n{tables}"

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a document analyst. Tables are formatted as Markdown."},
        {"role": "user",   "content": f"Analyse this document:\n\n{combined}"},
    ],
)
print(response.choices[0].message.content)
```

### 13e. Full pipeline — text + images + tables in one message

Send all three content types together for maximum context:

```python
def build_pdf_message(pdf_path: str, question: str) -> list[dict]:
    """Build a multimodal message from a PDF (text + images + tables)."""
    text   = pdf_to_text(pdf_path)
    tables = extract_tables_as_markdown(pdf_path)
    images = extract_images_from_pdf(pdf_path)

    content = [
        {"type": "text", "text": f"{question}\n\n## Document text\n\n{text}"},
    ]
    if tables:
        content.append({"type": "text", "text": f"\n\n## Tables\n\n{tables}"})
    for img in images[:5]:   # cap at 5 images to stay within token budget
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:{img['mime']};base64,{img['b64']}"},
        })
    return [{"role": "user", "content": content}]

messages = build_pdf_message("report.pdf", "Summarise the key findings of this report.")
response = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
print(response.choices[0].message.content)
```

## Model Reference

| Model | Context | Best for |
|---|---|---|
| `gpt-4o` | 128k | Multimodal, high accuracy |
| `gpt-4o-mini` | 128k | Fast, cost-efficient |
| `gpt-4o-2024-08-06` | 128k | Structured output, tool use |
| `gpt-5` | 1M | Frontier reasoning + multimodal |
| `gpt-5-mini` | 1M | Cost-efficient frontier model |
| `o3` | 200k | Complex multi-step reasoning |
| `o4-mini` | 200k | Fast reasoning, cost-efficient |
| `tts-1` | — | Text-to-speech (standard) |
| `tts-1-hd` | — | Text-to-speech (high quality) |
| `whisper-1` | — | Speech-to-text / translation |
| `text-embedding-3-small` | — | Embeddings (cheap) |
| `text-embedding-3-large` | — | Embeddings (accurate) |

> Models are updated frequently. Check [platform.openai.com/docs/models](https://platform.openai.com/docs/models) for the latest list and exact version strings.
