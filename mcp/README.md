# Model Context Protocol (MCP)

This is a collection of notes on the Model Context Protocol (MCP), a protocol for connecting AI models to external tools and data sources. MCP allows AI agents to access a wide range of capabilities and information, enabling them to perform complex tasks and make informed decisions.

Courses and resources on MCP:

- [Udemy: Intro to MCP - Model Context Protocol (Claude)](https://www.udemy.com/course/intro-to-mcp-model-context-protocol-claude/)
- [FastMCP](https://gofastmcp.com/getting-started/welcome)
- [Udemy: MCP Crash Course: Complete Model Context Protocol in a Day (Eden Marco)](https://www.udemy.com/course/model-context-protocol/)
- [Udemy: Learn MCP - Model Context Protocol Complete Guide](https://www.udemy.com/course/learn-mcp-model-context-protocol-complete-guide/)
- [Docker Just Made Using MCP Servers 100x Easier (One Click Installs!)](https://www.youtube.com/watch?v=TxlVdB2gmGE)

Table of Contents:

- [Model Context Protocol (MCP)](#model-context-protocol-mcp)
  - [Introduction to MCP](#introduction-to-mcp)
    - [MCP Architecture](#mcp-architecture)
      - [How the Pieces Relate](#how-the-pieces-relate)
      - [GitHub MCP Example](#github-mcp-example)
    - [Example: Calculartor MCP Server](#example-calculartor-mcp-server)
        - [Tools](#tools)
        - [Setup](#setup)
        - [Server Code](#server-code)
        - [Running the server](#running-the-server)
        - [Install the Server Tool in the Client](#install-the-server-tool-in-the-client)
        - [Test the tool in the client](#test-the-tool-in-the-client)
        - [Uninstalling and Managing the Server Tool in the Client](#uninstalling-and-managing-the-server-tool-in-the-client)
    - [Example: Leave Management MCP Server](#example-leave-management-mcp-server)
    - [Example: Project Management MCP Server](#example-project-management-mcp-server)
  - [FastMCP](#fastmcp)
  - [Docker MCP Toolkit](#docker-mcp-toolkit)

## Introduction to MCP

Most of the content in this section is sourced from the following course:

[Udemy: Intro to MCP - Model Context Protocol (Claude)](https://www.udemy.com/course/intro-to-mcp-model-context-protocol-claude/)

Relevant sources:

- [Anthropic: Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/docs/getting-started/intro)

> MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems.
> Using MCP, AI applications like Claude or ChatGPT can connect to data sources (e.g. local files, databases), tools (e.g. search engines, calculators) and workflows (e.g. specialized prompts)--enabling them to access key information and perform tasks.

Also, MCPs provide a secure way to connect AI models to external tools and data sources, without giving them direct access to the underlying systems. This allows for greater control and security when using AI agents.

### MCP Architecture

```mermaid
graph TD
    subgraph HOST["🖥️ Host Application"]
        CLIENT["🤖 MCP Client\n(e.g. Claude Desktop, IDE)"]
    end

    subgraph PROTOCOL["⚡ MCP Protocol Layer"]
        direction LR
        REQ["📤 Requests"]
        RES["📥 Responses"]
        NOT["🔔 Notifications"]
        REQ <--> RES
        REQ --> NOT
    end

    subgraph SERVER["🗄️ MCP Server"]
        direction TB
        TOOLS["🔧 Tools\n(executable functions)"]
        RES_SRC["📚 Resources\n(data & files)"]
        PROMPTS["💬 Prompts\n(templates)"]
        SAMPLING["🎲 Sampling\n(LLM requests)"]
    end

    subgraph EXTERNAL["🌐 External Systems"]
        API["REST APIs"]
        DB["Databases"]
        FS["File Systems"]
        SVC["Cloud Services"]
    end

    CLIENT <-->|"JSON-RPC 2.0\n(stdio / SSE / HTTP)"| PROTOCOL
    PROTOCOL <-->|"Capability\nNegotiation"| SERVER
    SERVER --> TOOLS
    SERVER --> RES_SRC
    SERVER --> PROMPTS
    SERVER --> SAMPLING
    TOOLS <--> EXTERNAL
    RES_SRC <--> EXTERNAL

    classDef host fill:#4A90D9,stroke:#2C5F8A,color:#fff,rx:8
    classDef protocol fill:#7B68EE,stroke:#4B3BBE,color:#fff
    classDef server fill:#2ECC71,stroke:#1A8A4A,color:#fff
    classDef capability fill:#F39C12,stroke:#B07D0E,color:#fff
    classDef external fill:#E74C3C,stroke:#A93226,color:#fff

    class CLIENT host
    class REQ,RES,NOT protocol
    class SERVER,TOOLS,RES_SRC,PROMPTS,SAMPLING server
    class API,DB,FS,SVC external
```

#### How the Pieces Relate

**Client <-> MCP Protocol** -- The client (e.g. Claude Desktop or an IDE plugin) speaks **JSON-RPC 2.0** over one of three transports: `stdio`, `SSE`, or `HTTP`. It sends *Requests*, receives *Responses*, and reacts to *Notifications* pushed by the server. The client never calls external systems directly.

- JSON-RPC 2.0 is a simple, language-agnostic protocol for remote procedure calls.
- `stdio` is a simple, synchronous communication channel using standard input and output streams.
- `SSE` (Server-Sent Events) is a unidirectional streaming protocol ideal for real-time updates.
- `HTTP` is a request-response protocol suitable for stateless interactions.

**MCP Protocol <-> Server** -- Before any real work happens, the two sides exchange a **capability negotiation** handshake. The server declares which of its four capability types it supports; the client learns exactly what it can ask for. This makes the protocol extensible without breaking older implementations.

**Server -> Tools / Resources / Prompts / Sampling** -- A server exposes up to four capability classes:
- **Tools** -- callable functions the model can invoke (e.g. `create_issue`, `search_code`).
- **Resources** -- read-only data sources the model can pull into context (e.g. a file, a DB row).
- **Prompts** -- reusable prompt templates parameterised by the server.
- **Sampling** -- lets the server ask the *client's* LLM to generate text (server-side orchestration).

**Server <-> External Systems** -- Tools and Resources are the bridge to the real world -- REST APIs, databases, file systems, cloud services.

#### GitHub MCP Example

```
Claude Desktop (Client) -- JSON-RPC --> github-mcp-server (MCP Server) -- REST --> api.github.com (External)
```

1. You ask Claude: *"Open an issue in my repo for the login bug."*
2. Claude (the **Client**) sends a `tools/call` request through the **Protocol** layer with tool name `create_issue` and arguments `{ repo, title, body }`.
3. The **GitHub MCP Server** receives it, authenticates with a stored token, and calls `POST /repos/{owner}/{repo}/issues` against the GitHub REST API.
4. GitHub returns the new issue URL -> the server wraps it in a JSON-RPC **Response** -> Claude reads it and tells you: *"Done! Issue #42 is open."*

Other tools the GitHub MCP server typically exposes: `list_repos`, `get_file_contents`, `create_pull_request`, `search_code`, `list_commits` -- all following the exact same Client -> Protocol -> Server -> External flow.

### Example: Calculartor MCP Server

##### Tools

- IDE, Python, [`uv`](https://docs.astral.sh/uv/#installation)
- Library: [mcp](https://pypi.org/project/mcp/)

##### Setup

```bash
# Create a python project with uv
mkdir calculator_mcp
uv init calculator_mcp  # empty project with main.py, README.md, pyproject.toml
cd calculator_mcp
uv venv  # if no venv created, create one explicitly
# Note: we can remove the empty main file main.py or hello.py

# Activate the venv
source .venv/bin/activate  # macOS / Linux / WSL
.venv\Scripts\Activate.ps1  # Windows (PowerShell)

# Install the mcp library
uv add "mcp[cli]"  # Alternatively, without uv: pip install "mcp[cli]"
# This will update the pyproject.toml file with the mcp dependency
# and create a uv.lock file with the exact versions of all dependencies.

# Create the server code
touch server.py
# Then, add the code below
```

##### Server Code

File: [calculator_mcp/server.py](./calculator_mcp/server.py).  
Important: by default, the server will run on port 8000.  
If the port is already in use, we can specify a different port when creating the FastMCP instance.

```python
"""
FastMCP quickstart example.

Run from the repository root:
    uv run examples/snippets/servers/fastmcp_quickstart.py
"""

from mcp.server.fastmcp import FastMCP


# Create an MCP server
# mcp = FastMCP("Demo", json_response=True) # Default port is 8000, specify a different port if needed
mcp = FastMCP("Demo", json_response=True, port=8001)


# Add an addition tool
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b


# Add a dynamic greeting resource
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"


# Add a prompt
@mcp.prompt()
def greet_user(name: str, style: str = "friendly") -> str:
    """Generate a greeting prompt"""
    styles = {
        "friendly": "Please write a warm, friendly greeting",
        "formal": "Please write a formal, professional greeting",
        "casual": "Please write a casual, relaxed greeting",
    }

    return f"{styles.get(style, styles['friendly'])} for someone named {name}."


# Run with streamable HTTP transport
if __name__ == "__main__":
    mcp.run(transport="streamable-http")

```

##### Running the server

```bash
cd calculator_mcp
uv run server.py

# Without uv, we would activate the venv and run
python server.py
```

##### Install the Server Tool in the Client

```bash
# Example for Claude Desktop client, Port 8001
# and installed globally to ~/.claude/settings.json
claude mcp add --transport http calculator-server http://localhost:8001/mcp

# To install locally to project
# in .claude/settings.json
# add the server with --scope project
claude mcp add --transport http --scope project calculator-server http://localhost:8001/mcp

```

##### Test the tool in the client

```bash
# If we are in a corporate network with a proxy, set the env variable to bypass the proxy for localhost
$env:NO_PROXY="localhost,127.0.0.1"

claude
/mcp
# Our MCP should appear connected under local MCPs
# calculator-server · ✔ connected

# Send prompt
"add the values 679238462736539 and 28346453836365 using the calculator-server"
# Grant permission if prompted
# calculator-server - add (MCP)(a: 679238462736539, b: 28346453836365)
#   ⎿  {
#        "result": 707584916572904
#      }
# 679238462736539 + 28346453836365 = 707,584,916,572,904
```

##### Uninstalling and Managing the Server Tool in the Client

Notes:

- In the server is down, Claude Code will show a connection error for that MCP server when we run `/mcp` or try to use its tools, but everything else keeps working normally -- it just won't have access to that server's tools until it's running again. It fails gracefully.
- Config is saved in `~/.claude/settings.json` (or project-level `.claude/settings.json` if added with `--scope` project).
- To uninstall the server tool, we can run `claude mcp remove calculator-server` (or `claude mcp remove --scope project calculator-server` if it was added with `--scope` project).

```bash
claude mcp remove calculator-server
```

### Example: Leave Management MCP Server



### Example: Project Management MCP Server



## FastMCP

Source: [FastMCP](https://gofastmcp.com/getting-started/welcome)

TBD.

## Docker MCP Toolkit

Source: [Docker Just Made Using MCP Servers 100x Easier (One Click Installs!)](https://www.youtube.com/watch?v=TxlVdB2gmGE)

Docker Desktop offers an MCP toolkit now:

- We can install MCP servers from a catalogue to Docker Desktop
- Then we connect clients: Claude Code, Codex, VSCode
- And all installed MCP servers are automatically installed in all clients
- Docker creates basically an MCP which aggregates all other MCPs
- We can also expose all the docker MCPs to an HTTP server so that any tool (e.g., n8n) with MCP connectors can attach to it, and boom, we have access to all MCP servers installed in docker!
- It seems that each installed MCP is a lightweight docker container which is spun up/down every time we use it...
- We have also the chatbot `docker ai`

Summary of the video:

- **What is it?**
  - Docker launched the **Docker MCP Catalog** -- a curated, one-click marketplace for connecting MCP servers to AI agents
- **The Problem It Solves**
  - Previously, adding MCP servers required manually writing JSON configs for each one -- tedious and error-prone
  - Docker's catalog eliminates all of that with single-click installs
- **How It Works**
  - Requires only **Docker Desktop** (already common for devs)
  - Each MCP tool runs as a **Docker container** -- spun up on demand, torn down when done --> efficient and secure
  - A single **mcp_docker** server aggregates all your installed tools and appears as one server in clients like Claude Desktop
- **Setup Flow**
  - Browse the catalog (sorted by popularity), click "Add MCP Server," optionally configure API keys -- done
  - Supported clients include: Claude Desktop, Claude Code, Gemini CLI, Cursor, and more
  - Can also test servers immediately via **Gordon** (Docker's built-in AI agent, currently in beta)
- **Servers Demoed**
  - YouTube Transcripts, Slack, GitHub, Obsidian -- all connected in ~10 minutes
- **Multi-Server Workflow Demo**
  - Claude Desktop was prompted to:
    1. Pull a YouTube transcript --> summarize it into Obsidian vault
    2. Read a Slack channel for extra context
    3. Create a GitHub issue for a relevant code integration
    4. Post a comment tagging `@claudecode` to trigger Claude Code to autonomously work on the issue
  - Result: A pull request was created entirely by automation, end-to-end
- **Using It in Custom Agents**
  - Docker's underlying **MCP Gateway is open-source** and can be self-hosted
  - Run `docker mcp gateway` on a local port (e.g. 8089) --> exposes all catalog tools as an HTTP endpoint; then **any tool that has MCP connections can attach to it and we have access to all MCP servers in docker!**
  - Demoed connecting this to **n8n** (no-code automation) and a **LiveKit voice agent** -- both worked seamlessly with the same catalog tools
- **Key Takeaway**
  - Docker MCP Catalog is now a central command center for managing MCP servers -- one-click installs, works with virtually any agent framework, efficient container-based execution
