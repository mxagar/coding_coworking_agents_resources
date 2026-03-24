# Example App

This folder contains an example app built and used during the cours; I downloaded the starter code from [`codex-course-resources/code-snapshots/starting-project.zip`](https://github.com/academind/codex-course-resources/blob/main/code-snapshots/starting-project.zip) and renamed the `README.md` to be [`Instructions.md`](./Instructions.md).

[Bun](https://bun.com/) is needed; Bun is a combination of a runtime, package manager, and bundler for JavaScript and TypeScript. It is a great alternative to `Node.js + npm`.

The app is based on [Next.js](https://nextjs.org/), which is a framework on top of React for building web applications.  The app is a simple note taking app, where we can create, edit, delete, and share notes.

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
# Open http://localhost:3000 in the browser to see the app running.

# To stop the server, press Ctrl + C in the terminal.
```

Continue to 

- [`Instructions.md`](./Instructions.md) if you want to see the original `README.md` of the example app,
- and to the upper [`../README.md`](../README.md) if you want to know more about the usage of Codex.
