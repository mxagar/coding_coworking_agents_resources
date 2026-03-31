"""
FastMCP quickstart example.

Original code from

    https://pypi.org/project/mcp/

Run:
    cd calculator_mcp
    uv run server.py
"""

from mcp.server.fastmcp import FastMCP


# Create an MCP server
# mcp = FastMCP("Calculator", json_response=True) # Default port is 8000, specify a different port if needed
mcp = FastMCP("Calculator", json_response=True, port=8001)


# Tool: function that can be called by the client (can modify state/write data)
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b


# Resource: read-only data that can be accessed by agents, tools, or users
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"


# Prompt: template for generating prompts
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
