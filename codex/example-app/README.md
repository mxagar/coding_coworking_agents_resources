# Example App

This folder contains an example app built and used during the cours; I downloaded the starter code from [`codex-course-resources/code-snapshots/starting-project.zip`](https://github.com/academind/codex-course-resources/blob/main/code-snapshots/starting-project.zip) and renamed the `README.md` to be [`Instructions.md`](./Instructions.md).

[Bun](https://bun.com/) is needed; Bun is a combination of a runtime, package manager, and bundler for JavaScript and TypeScript. It is a great alternative to `Node.js + npm`.

Install Bun:

```bash
# Linux & MacOS
curl -fsSL https://bun.sh/install | bash

# Windows / Powershell
powershell -c "irm bun.sh/install.ps1 | iex"

# ...
npm install -g bun
```

Then, run:

```bash
# Install dependencies
cd .../example-app
bun install

# Start the development server
bun run dev

# To stop the server, press Ctrl + C in the terminal.
```

... and finally, continue to [`Instructions.md`](./Instructions.md) and the upper [`../README.md`](../README.md).
