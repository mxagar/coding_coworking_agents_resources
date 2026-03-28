# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This directory contains personal notes and reference material about Claude Code — covering installation, configuration, permissions, key features, and prompt engineering best practices. It is a documentation-only repository with no build system, test framework, or runnable code.

## Structure

All content lives in `README.md`, organized into three main sections:

1. **Getting Started** — installation, slash commands, internal tools, configuration (`settings.json` hierarchy: global → project → local), permissions management, sandbox mode, and version control workflows.
2. **Key Features and Efficient Usage** — SPEC file methodology, prompt and context engineering guidelines, and project initialization with `/init`.
3. **Beyond Local CLI Usage** — placeholder for future content on non-CLI usage.

Supporting assets are in `assets/` (cheatsheet image) and `anatomy_claude_folder.jpg` at the root.

## Settings

`.claude/settings.json` is the project-level settings file (tracked in git). `.claude/settings.local.json` is the personal override (not committed). The global settings live at `~/.claude/settings.json`.

## Editing Notes

When updating `README.md`, preserve the existing section structure and table of contents. No trailing spaces on lines.
