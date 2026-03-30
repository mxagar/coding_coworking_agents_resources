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
  - [FastMCP](#fastmcp)
  - [Docker MCP Toolkit](#docker-mcp-toolkit)

## Introduction to MCP

Most of the content in this section is sourced from the following course:

[Udemy: Intro to MCP - Model Context Protocol (Claude)](https://www.udemy.com/course/intro-to-mcp-model-context-protocol-claude/)

TBD.

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
  - Docker launched the **Docker MCP Catalog** — a curated, one-click marketplace for connecting MCP servers to AI agents
- **The Problem It Solves**
  - Previously, adding MCP servers required manually writing JSON configs for each one — tedious and error-prone
  - Docker's catalog eliminates all of that with single-click installs
- **How It Works**
  - Requires only **Docker Desktop** (already common for devs)
  - Each MCP tool runs as a **Docker container** — spun up on demand, torn down when done --> efficient and secure
  - A single **mcp_docker** server aggregates all your installed tools and appears as one server in clients like Claude Desktop
- **Setup Flow**
  - Browse the catalog (sorted by popularity), click "Add MCP Server," optionally configure API keys — done
  - Supported clients include: Claude Desktop, Claude Code, Gemini CLI, Cursor, and more
  - Can also test servers immediately via **Gordon** (Docker's built-in AI agent, currently in beta)
- **Servers Demoed**
  - YouTube Transcripts, Slack, GitHub, Obsidian — all connected in ~10 minutes
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
  - Demoed connecting this to **n8n** (no-code automation) and a **LiveKit voice agent** — both worked seamlessly with the same catalog tools
- **Key Takeaway**
  - Docker MCP Catalog is now a central command center for managing MCP servers — one-click installs, works with virtually any agent framework, efficient container-based execution
