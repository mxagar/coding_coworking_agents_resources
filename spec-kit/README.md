# GitHub Spec Kit

Spec Kit is GitHub's toolkit for Spec-Driven Development: a workflow where the specification is the primary artifact and code is generated from a reviewed spec, implementation plan, and task list.

The core idea from the official docs and video walkthrough is simple: stop asking an AI agent to jump directly from a vague prompt to code. First give it durable project rules, then a clear feature specification, then a technical plan, then small implementation tasks.

By default, Spec Kit is git-branch oriented. When you create a feature with `/speckit.specify`, it typically creates or uses a numbered feature branch such as `001-modern-podcast-website` and stores that feature's artifacts under the matching `specs/001-modern-podcast-website/` directory. Later commands infer the active feature from the current branch unless you override it with `SPECIFY_FEATURE`.

## Sources

- [The ONLY guide you'll need for GitHub Spec Kit](https://www.youtube.com/watch?v=a9eR1xsfvHg)
- [GitHub Spec Kit Repository](https://github.com/github/spec-kit)
- [Spec Kit Documentation](https://github.github.io/spec-kit/)
- [Supported AI Coding Agent Integrations](https://github.github.io/spec-kit/reference/integrations.html)
- [Specification-Driven Development Methodology](https://github.com/github/spec-kit/blob/main/spec-driven.md)

## What Spec Kit Changes

Traditional AI coding often relies on a single large prompt and a long chat thread. That works for small experiments, but it becomes fragile when requirements, architecture, and review criteria matter.

Spec Kit makes the AI agent work through persistent Markdown artifacts:

- `.specify/memory/constitution.md`: non-negotiable project principles.
- `specs/<feature>/spec.md`: what to build and why.
- `specs/<feature>/plan.md`: how to build it.
- `specs/<feature>/tasks.md`: ordered implementation work.
- Optional artifacts such as `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`.

This gives the agent stable context and gives humans review points before code is written.

## When To Use It

Use Spec Kit when:

- Requirements are ambiguous enough that clarification matters.
- A team needs reviewable specs and plans before implementation.
- You want repeatable agent work instead of one-off prompting.
- You are building a feature that should survive beyond a prototype.
- You want to compare implementations across stacks or agents.

It can be overhead for very small personal experiments where a short prompt and quick manual cleanup is enough.

## Prerequisites

Spec Kit is installed from the official GitHub repository. The official docs warn that similarly named PyPI packages are not maintained by the Spec Kit team.

You need:

- Python 3.11+
- Git
- `uv` recommended, or `pipx`
- An AI coding agent integration such as Copilot, Claude Code, Codex CLI, Gemini CLI, Cursor, opencode, or another supported tool

As of May 25, 2026, the latest GitHub release is `v0.8.13`. Check the [latest release](https://github.com/github/spec-kit/releases/latest) before installing in a new project.

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.8.13
specify version
```

For one-off usage without a persistent install, use `uvx`:

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init my-project --integration copilot
```

## Initialize A Project

For a new project:

```bash
specify init my-project --integration copilot
cd my-project
```

For an existing project:

```bash
cd my-existing-project
specify init --here --integration codex
```

On Windows, Spec Kit supports PowerShell scripts. You can force the script type when needed:

```bash
specify init my-project --integration copilot --script ps
```

Useful integration checks:

```bash
specify integration list
specify integration install codex
specify integration switch claude
specify integration use codex
specify integration upgrade
specify integration uninstall claude
```

Most integrations expose slash commands such as `/speckit.specify`. Codex skills mode uses `$speckit-<command>` instead.

## Available Integrations

Spec Kit integrations install the command files, skill files, context rules, and supporting directories needed by a specific AI coding agent. As of May 25, 2026, the official integrations reference lists these agents:

| Agent | Key | Setup Notes |
| --- | --- | --- |
| Amp | `amp` | CLI agent integration. |
| Antigravity (agy) | `agy` | Skills-based integration; skills install automatically. |
| Auggie CLI | `auggie` | Multi-install safe; isolated under `.augment/commands` and `.augment/rules/specify-rules.md`. |
| Claude Code | `claude` | Skills-based integration; installs skills in `.claude/skills` and context in `CLAUDE.md`. |
| CodeBuddy CLI | `codebuddy` | Multi-install safe; isolated under `.codebuddy/commands` and `CODEBUDDY.md`. |
| Codex CLI | `codex` | Skills-based integration; installs skills in `.agents/skills` and invokes them as `$speckit-<command>`. |
| Cursor | `cursor-agent` | Multi-install safe; isolated under `.cursor/skills` and `.cursor/rules/specify-rules.mdc`. |
| Devin for Terminal | `devin` | Skills-based integration; installs skills in `.devin/skills/` and invokes them as `/speckit-<command>`. |
| Forge | `forge` | CLI agent integration. |
| Gemini CLI | `gemini` | Multi-install safe; isolated under `.gemini/commands` and `GEMINI.md`. |
| GitHub Copilot | `copilot` | Common default; IDE/agent integration that installs prompt files and Copilot instructions. |
| Goose | `goose` | Uses YAML recipes under `.goose/recipes/`. |
| IBM Bob | `bob` | IDE-based agent integration. |
| iFlow CLI | `iflow` | Multi-install safe; isolated under `.iflow/commands` and `IFLOW.md`. |
| Junie | `junie` | Multi-install safe; isolated under `.junie/commands` and `.junie/AGENTS.md`. |
| Kilo Code | `kilocode` | Multi-install safe; isolated under `.kilocode/workflows` and `.kilocode/rules/specify-rules.md`. |
| Kimi Code | `kimi` | Skills-based integration; supports `--migrate-legacy` for old dotted skill directories. |
| Kiro CLI | `kiro-cli` | Also accepts `--integration kiro`; ships a fallback for file-based prompts. |
| Lingma | `lingma` | Skills-based integration; skills install automatically. |
| Mistral Vibe | `vibe` | CLI agent integration. |
| opencode | `opencode` | CLI agent integration. |
| Pi Coding Agent | `pi` | `taskstoissues` needs MCP support added separately through extensions. |
| Qoder CLI | `qodercli` | Multi-install safe; isolated under `.qoder/commands` and `QODER.md`. |
| Qwen Code | `qwen` | Multi-install safe; isolated under `.qwen/commands` and `QWEN.md`. |
| Roo Code | `roo` | Multi-install safe; isolated under `.roo/commands` and `.roo/rules/specify-rules.md`. |
| SHAI (OVHcloud) | `shai` | Multi-install safe; isolated under `.shai/commands` and `SHAI.md`. |
| Tabnine CLI | `tabnine` | Multi-install safe; isolated under `.tabnine/agent/commands` and `TABNINE.md`. |
| Trae | `trae` | Skills-based integration; isolated under `.trae/skills` and `.trae/rules/project_rules.md`. |
| Windsurf | `windsurf` | Multi-install safe; isolated under `.windsurf/workflows` and `.windsurf/rules/specify-rules.md`. |
| Generic | `generic` | Bring your own agent with `--integration-options="--commands-dir <path>"`. |

### Install Or Set Up An Integration

Choose the integration during project initialization:

```bash
specify init my-project --integration codex
specify init my-project --integration claude
specify init my-project --integration copilot
specify init my-project --integration cursor-agent
```

Initialize an existing project with a chosen integration:

```bash
specify init --here --integration codex
```

If the agent CLI is not installed yet and you still want the Spec Kit templates:

```bash
specify init my-project --integration claude --ignore-agent-tools
```

Install another integration after initialization:

```bash
specify integration install gemini
```

Installing an additional integration does not make it the default. Set the default explicitly:

```bash
specify integration use gemini
```

Switch to another integration, installing it if needed:

```bash
specify integration switch claude
```

Refresh managed integration files after upgrading Spec Kit:

```bash
specify integration upgrade
```

Use `--script ps` on Windows when you want PowerShell helper scripts, or `--script sh` when you want Bash helpers:

```bash
specify init my-project --integration copilot --script ps
specify integration install codex --script ps
```

Use `generic` for an unlisted agent:

```bash
specify init my-project --integration generic --integration-options="--commands-dir .myagent/commands"
```

Spec Kit tracks the default and installed integrations in `.specify/integration.json`. It allows multiple integrations automatically only when the integrations are declared multi-install safe; otherwise, use `--force` only when you understand that multiple agents may see unrelated agent-specific instructions.

## The Recommended Workflow

### 1. Establish The Constitution

Start by defining the rules the agent must obey throughout the project. The video emphasizes doing this before `/specify`, not after.

```text
/speckit.constitution Fill the constitution with the bare minimum requirements for a static web app.
Require responsive design, accessibility-conscious markup, simple dependencies, and clear build/test commands.
```

This creates or updates:

```text
.specify/memory/constitution.md
```

Good constitution rules are specific and enforceable:

- Preferred language, framework, or architecture constraints.
- Testing expectations.
- Accessibility, security, or performance requirements.
- Dependency limits.
- Review and governance expectations.

Avoid filling the constitution with vague preferences. The agent should be able to use it as a decision filter.

### 2. Write The Specification

Use `/speckit.specify` to describe the product behavior. Stay focused on the what and why. Do not choose the stack here.

Example based on the video walkthrough:

```text
/speckit.specify I am building a modern podcast website.
It should look sleek and stand out visually.
It needs a landing page with one featured episode, an episodes page, an about page, and a FAQ page.
Include 20 mock episodes.
The site should work well on mobile and desktop.
```

The agent should create a **feature branch and a feature directory** such as:

```text
specs/001-modern-podcast-website/spec.md
```

`001-modern-podcast-website` is a feature directory, not the whole project. Spec Kit creates one numbered directory under `specs/` for each feature you specify. The number preserves creation order and usually matches the generated feature branch prefix; the slug describes the feature in readable words. A small project may have only one feature directory, while a larger project might later have `002-user-authentication`, `003-billing-flow`, and so on.

Follow-up commands usually know which feature to use from the current git branch. When `/speckit.specify` creates a branch such as `001-modern-podcast-website`, later commands like `/speckit.clarify`, `/speckit.checklist`, `/speckit.plan`, `/speckit.tasks`, and `/speckit.implement` resolve the matching directory under `specs/`. If you switch branches, you switch the active feature context.

If you are not using git branches, or the agent cannot infer the feature, set the feature explicitly before running follow-up commands:

```bash
export SPECIFY_FEATURE=001-modern-podcast-website
```

In PowerShell:

```powershell
$env:SPECIFY_FEATURE = "001-modern-podcast-website"
```

Review the generated spec before moving forward. Look for:

- User stories that match the intent.
- Clear functional requirements.
- Acceptance criteria that can be tested.
- Missing edge cases.
- Accidental technical decisions that belong in the plan instead.

### 3. Clarify Ambiguity

Use `/speckit.clarify` when requirements are underspecified. This is especially useful before planning because it reduces rework.

```text
/speckit.clarify
```

If you want the agent to make reasonable assumptions instead of stopping for every open question, say so explicitly:

```text
For things that need clarification, use the best reasonable guess.
Update the acceptance checklist after.
```

You can also generate targeted quality checklists:

```text
/speckit.checklist accessibility
/speckit.checklist performance
/speckit.checklist security
```

The word after `/speckit.checklist` is the checklist topic. A bare command such as `/speckit.checklist accessibility` asks the agent to infer a reasonable accessibility checklist from the current spec, plan, and constitution.

Add more text when you want specific coverage:

```text
/speckit.checklist accessibility Check WCAG 2.2 AA concerns, keyboard navigation, visible focus, color contrast, semantic HTML, screen reader labels, form labels, and reduced motion.
```

Treat these like tests for the English requirements. They help catch gaps before implementation.

### 4. Create The Technical Plan

Use `/speckit.plan` only after the feature spec is stable enough. This is where you specify the stack, architecture, libraries, storage, deployment assumptions, and non-functional constraints.

Example from the video notes:

```text
/speckit.plan I am going to use Next.js with static site configuration.
No database is needed; episode data is embedded as mocked content.
The site is responsive and ready for mobile.
```

The agent may generate artifacts such as:

```text
specs/001-modern-podcast-website/plan.md
specs/001-modern-podcast-website/research.md
specs/001-modern-podcast-website/data-model.md
specs/001-modern-podcast-website/quickstart.md
```

Review the plan for:

- Whether it follows the constitution.
- Whether it picked the stack you asked for.
- Whether it introduced unnecessary services or dependencies.
- Whether research is specific enough to help implementation.
- Whether each major requirement traces back to the spec.

If a framework or library is changing quickly, ask the agent to research version-specific details before task generation.

### 5. Audit The Plan

Before creating tasks, ask the agent to inspect the plan and supporting files for missing or over-engineered pieces.

```text
Audit the implementation plan and detail files.
Check whether the task sequence is obvious, whether requirements trace back to the spec, and whether anything is over-engineered.
Update the plan if needed.
```

This is a good human checkpoint. The video calls out that agents can be over-eager, so challenge surprising additions before implementation.

### 6. Break The Work Into Tasks

Use `/speckit.tasks` to create small, ordered tasks.

```text
/speckit.tasks
```

or:

```text
/speckit.tasks Break this down into tasks.
```

This creates:

```text
specs/001-modern-podcast-website/tasks.md
```

A good task file should include:

- Setup and foundation tasks first.
- User-story-oriented phases.
- Exact file paths where work should happen.
- Test tasks before implementation tasks when tests are requested.
- Parallel markers for independent tasks.
- Checkpoints after independently testable slices.

Review this file like you would review an implementation plan. If tasks are too large, ask the agent to split them.

### 7. Implement From The Task List

Once the artifacts are reviewed, run implementation.

```text
/speckit.implement
```

The video walkthrough uses this style of instruction:

```text
Implement the tasks for this project, and update the task list as you go.
```

The agent should execute tasks in order, respect dependencies, update `tasks.md`, and run local verification commands where appropriate.

Expect the agent to run project commands such as:

```bash
npm run build
npm run test
npm run dev
```

Only trust the result after you run or review the actual verification output. Browser issues, runtime errors, missing assets, and styling problems may not be visible from a build alone.

## Generated Files And Directories

The exact agent-specific paths vary by integration, but a typical initialized project looks like this after `specify init` and one feature workflow:

```text
my-project/
|-- .specify/                              # Generated by: specify init
|   |-- integration.json                   # Generated by: specify init; tracks default and installed integrations
|   |-- memory/
|   |   |-- constitution.md                # Generated by: specify init; updated by /speckit.constitution
|   |   `-- constitution_update_checklist.md # Generated/updated by /speckit.constitution when governance changes are reviewed
|   |-- scripts/
|   |   |-- bash/                          # Generated by: specify init --script sh or on Linux/macOS
|   |   |   |-- check-prerequisites.sh      # Used by: /speckit.plan, /speckit.tasks, /speckit.implement
|   |   |   |-- common.sh                   # Used by: helper scripts for shared path/feature logic
|   |   |   |-- create-new-feature.sh       # Used by: /speckit.specify to create the feature branch/directory/spec file
|   |   |   |-- setup-plan.sh               # Used by: /speckit.plan to prepare plan artifacts
|   |   |   `-- update-agent-context.sh     # Used by: /speckit.plan to update agent context from the plan
|   |   `-- powershell/                    # Generated by: specify init --script ps or on Windows
|   |       |-- check-prerequisites.ps1     # PowerShell equivalent of the prerequisite checker
|   |       |-- common.ps1                  # PowerShell shared helper functions
|   |       |-- create-new-feature.ps1      # PowerShell feature creation helper
|   |       |-- setup-plan.ps1              # PowerShell plan setup helper
|   |       `-- update-agent-context.ps1    # PowerShell agent-context updater
|   `-- templates/
|       |-- checklist-template.md          # Generated by: specify init; copied/used by /speckit.checklist
|       |-- constitution-template.md       # Generated by: specify init; used by /speckit.constitution
|       |-- plan-template.md               # Generated by: specify init; copied/used by /speckit.plan
|       |-- spec-template.md               # Generated by: specify init; copied/used by /speckit.specify
|       |-- tasks-template.md              # Generated by: specify init; copied/used by /speckit.tasks
|       `-- vscode-settings.json           # Generated by: specify init when applicable to editor setup
|-- .github/prompts/                       # Generated by: specify init --integration copilot
|   |-- analyze.prompt.md                  # Copilot command file for /speckit.analyze
|   |-- checklist.prompt.md                # Copilot command file for /speckit.checklist
|   |-- clarify.prompt.md                  # Copilot command file for /speckit.clarify
|   |-- constitution.prompt.md             # Copilot command file for /speckit.constitution
|   |-- implement.prompt.md                # Copilot command file for /speckit.implement
|   |-- plan.prompt.md                     # Copilot command file for /speckit.plan
|   |-- specify.prompt.md                  # Copilot command file for /speckit.specify
|   |-- tasks.prompt.md                    # Copilot command file for /speckit.tasks
|   `-- taskstoissues.prompt.md            # Copilot command file for /speckit.taskstoissues
|-- .agents/skills/                        # Generated by: specify init --integration codex
|   `-- speckit-*/                         # Codex skills; invoked as $speckit-<command>
|-- .claude/skills/                        # Generated by: specify init --integration claude
|   `-- speckit-*/                         # Claude skills for the Spec Kit workflow
|-- AGENTS.md                              # Generated/updated by: codex integration; project instructions for Codex
|-- CLAUDE.md                              # Generated/updated by: claude integration; project instructions for Claude Code
`-- specs/                                 # Created when the first feature is specified
    `-- 001-feature-name/                  # Generated by: /speckit.specify
        |-- spec.md                        # Generated by: /speckit.specify
        |-- checklists/                    # Generated by: /speckit.checklist or /speckit.clarify
        |   `-- requirements.md            # Generated when requirement quality is checked
        |-- plan.md                        # Generated by: /speckit.plan
        |-- research.md                    # Generated by: /speckit.plan when decisions need research
        |-- data-model.md                  # Generated by: /speckit.plan when data entities are needed
        |-- contracts/                     # Generated by: /speckit.plan when APIs/contracts are needed
        |-- quickstart.md                  # Generated by: /speckit.plan for manual validation/setup steps
        `-- tasks.md                       # Generated by: /speckit.tasks; updated during /speckit.implement
```

Agent-specific command directories differ. For example, 

- Copilot commonly uses `.github/prompts/`
- Codex uses `.agents/skills/`
- Claude uses `.claude/skills/`
- Gemini uses `.gemini/commands/`
- Goose uses `.goose/recipes/`
- Windsurf uses `.windsurf/workflows/`

## Generated File Reference

| File Or Directory | Generated By | Purpose |
| --- | --- | --- |
| `.specify/` | `specify init` | Root folder for Spec Kit project state, templates, scripts, and memory. |
| `.specify/integration.json` | `specify init`, `specify integration install/use/switch/upgrade` | Tracks the default integration, installed integrations, settings, and state schema. |
| `.specify/memory/constitution.md` | `specify init`; updated by `/speckit.constitution` | Stores project principles and non-negotiable rules. |
| `.specify/memory/constitution_update_checklist.md` | `/speckit.constitution` | Records governance updates and review checks when constitution changes are made. |
| `.specify/scripts/bash/` | `specify init --script sh` or non-Windows default | Bash helper scripts used by command prompts. |
| `.specify/scripts/powershell/` | `specify init --script ps` or Windows default | PowerShell helper scripts used by command prompts. |
| `.specify/scripts/*/create-new-feature.*` | `specify init` | Creates a numbered feature directory and initial `spec.md`. |
| `.specify/scripts/*/setup-plan.*` | `specify init` | Prepares plan-related paths and artifacts. |
| `.specify/scripts/*/check-prerequisites.*` | `specify init` | Checks that required artifacts exist before later workflow phases. |
| `.specify/scripts/*/update-agent-context.*` | `specify init` | Updates agent context files from plan information. |
| `.specify/scripts/*/common.*` | `specify init` | Shared helper functions for path detection, feature lookup, and template resolution. |
| `.specify/templates/spec-template.md` | `specify init` | Template used to create `specs/<feature>/spec.md`. |
| `.specify/templates/plan-template.md` | `specify init` | Template used to create `specs/<feature>/plan.md`. |
| `.specify/templates/tasks-template.md` | `specify init` | Template used to create `specs/<feature>/tasks.md`. |
| `.specify/templates/checklist-template.md` | `specify init` | Template used by checklist generation. |
| `.specify/templates/constitution-template.md` | `specify init` | Template used for constitution creation or updates. |
| `.specify/templates/vscode-settings.json` | `specify init` | Editor settings template used when the integration/editor setup needs it. |
| Agent command files | `specify init --integration <key>` or `specify integration install <key>` | Register `/speckit.*` commands, skills, recipes, or workflows with the selected agent. |
| Agent context file such as `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, or `.github/copilot-instructions.md` | Integration install or switch | Gives the selected agent project instructions and Spec Kit workflow context. |
| `specs/` | First `/speckit.specify` run | Holds all feature-specific generated artifacts. |
| `specs/<number>-<feature>/` | `/speckit.specify` | One directory per feature, usually matching the generated feature branch name. |
| `specs/<feature>/spec.md` | `/speckit.specify` | Product specification: user stories, functional requirements, assumptions, and acceptance criteria. |
| `specs/<feature>/checklists/` | `/speckit.checklist` or `/speckit.clarify` | Requirement-quality, accessibility, performance, security, or other validation checklists. |
| `specs/<feature>/plan.md` | `/speckit.plan` | Technical implementation plan, stack choices, constraints, and phase outputs. |
| `specs/<feature>/research.md` | `/speckit.plan` when needed | Captures research and decisions that justify implementation choices. |
| `specs/<feature>/data-model.md` | `/speckit.plan` when data modeling is needed | Defines entities, relationships, validation rules, and state transitions. |
| `specs/<feature>/contracts/` | `/speckit.plan` when APIs or interfaces are needed | Stores API contracts, schemas, or interface definitions. |
| `specs/<feature>/quickstart.md` | `/speckit.plan` | Documents setup or manual verification steps for the planned implementation. |
| `specs/<feature>/tasks.md` | `/speckit.tasks`; updated by `/speckit.implement` | Ordered, dependency-aware task list used to drive implementation. |
| Source code and tests | `/speckit.implement` | Actual product implementation created from the reviewed spec, plan, and tasks. |

## Command Reference

| Command | Purpose | When To Use |
| --- | --- | --- |
| `/speckit.constitution` | Create or update project principles | Before specs or after major governance changes |
| `/speckit.specify` | Define requirements and user stories | For each new feature |
| `/speckit.clarify` | Resolve underspecified requirements | After spec, before plan |
| `/speckit.checklist` | Generate quality checklists | When you need focused validation |
| `/speckit.plan` | Create the technical implementation plan | After spec clarification |
| `/speckit.tasks` | Generate actionable implementation tasks | After plan review |
| `/speckit.analyze` | Check cross-artifact consistency | After tasks, before implementation |
| `/speckit.implement` | Execute tasks | After spec, plan, and tasks are approved |
| `/speckit.taskstoissues` | Convert tasks into GitHub issues | When tracking work through GitHub |

For Codex skills mode, use the equivalent `$speckit-<command>` skill names.

## Practical Review Checklist

Before implementation:

- Constitution exists and contains real constraints.
- Spec describes behavior, users, requirements, and acceptance criteria.
- Clarifications are recorded instead of left in chat history.
- Plan explains the stack and architecture without adding surprise scope.
- Tasks are small, ordered, and independently verifiable.
- Tests or validation commands are listed.

After implementation:

- `tasks.md` reflects completed work.
- Build/test commands pass or failures are documented.
- The app is run manually when UI behavior matters.
- Runtime/browser console errors are checked.
- Generated docs still match the implemented behavior.

## Suggested Prompt Pattern

Use this pattern for a new feature:

```text
/speckit.constitution Define the project rules: <non-negotiable standards>.
```

```text
/speckit.specify Build <feature>. The user should be able to <goals>. Success means <observable outcomes>. Avoid implementation details for now.
```

```text
/speckit.clarify
```

```text
/speckit.plan Use <stack>. Store data in <storage>. Follow <architecture>. Include <testing/deployment constraints>.
```

```text
/speckit.analyze
```

```text
/speckit.tasks
```

```text
/speckit.implement Implement the tasks for this project, and update the task list as you go.
```

## Key Takeaways From The Video

- Use Spec Kit to structure agent work, not to remove human judgment.
- Start with the constitution so the agent has guardrails.
- Keep `/specify` about product behavior, not technology.
- Use clarification and checklists to improve the spec before planning.
- Put stack decisions and architecture in `/plan`.
- Review generated Markdown artifacts before letting the agent code.
- Ask the agent to update the task list as it works.
- Validate the finished application yourself, especially UI and runtime behavior.
- Model choice can matter: one model may be better for specification and task scaffolding, another for creative implementation.

## Common Pitfalls

- Skipping the constitution and then wondering why generated code is inconsistent.
- Mixing tech-stack choices into the first specification prompt.
- Accepting the first spec without clarification.
- Letting the agent add databases, services, or dependencies that were not requested.
- Running `/speckit.implement` before reviewing `plan.md` and `tasks.md`.
- Treating passing CLI output as proof that the product works.
- Leaving important decisions only in chat instead of updating the artifacts.

## Minimal Example

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.8.13
specify init podcast-site --integration copilot
cd podcast-site
```

Then, in your coding agent:

```text
/speckit.constitution Static-first website. Keep dependencies minimal. Require responsive layout and accessible semantic HTML.
```

```text
/speckit.specify Build a modern podcast website with a landing page, one featured episode, an episodes page, an about page, a FAQ page, and 20 mocked episodes.
```

```text
/speckit.clarify
```

```text
/speckit.plan Use Next.js static site generation. Store episode data as local mocked content. No database. Optimize for mobile.
```

```text
/speckit.tasks
```

```text
/speckit.implement Implement the tasks for this project, and update the task list as you go.
```
