---
name: prompt-optimizer
description: 'Analyze, refine, and optimize any user-provided prompt for an AI coding agent. Use when a user invokes /prompt-optimizer and wants the text after the command treated as the prompt to improve for debugging, refactors, UI overhauls, migrations, architecture edits, and other complex coding work.'
argument-hint: '[enter the prompt to optimize directly after /prompt-optimizer]'
user-invocable: true
disable-model-invocation: false
---

# Prompt Optimizer

This skill improves prompts **for AI coding agents**.

Its job is to make a prompt more effective, more precise, more complete, and more execution-ready **without performing the coding task itself**.

The skill must preserve the user's original intent while upgrading the prompt only where doing so materially improves execution quality.

## Slash Command Input Rule

When the user invokes `/prompt-optimizer`, treat **everything after the command** as the prompt to analyze and optimize.

- Do **not** require the user to say "improve this prompt" or similar framing.
- Do **not** ask the user to restate that they want prompt optimization when they already invoked `/prompt-optimizer`.
- Assume the slash command itself signals the user's intent to optimize the supplied prompt text.
- If the user includes extra context after the command, treat it as part of the source material unless they clearly separate instructions from the prompt.

## When to Use

Use this skill when a user wants to:
- improve a prompt before giving it to a coding agent,
- rewrite a vague or incomplete coding request,
- strengthen scope, constraints, or success criteria,
- organize a messy task into a clean implementation workflow,
- prepare a prompt for complex engineering work such as:
  - multi-file changes,
  - multi-page UI overhauls,
  - refactors,
  - debugging,
  - migrations,
  - architecture edits,
  - feature implementation with testing/validation expectations.

## Do Not Use

Do **not** use this skill to:
- perform the implementation,
- write production code for the requested task,
- independently invent a different project goal,
- rewrite a prompt just for style when no meaningful improvement is needed.

## Operating Principles

1. **Analyze before editing.** Understand the prompt's actual goal, deliverables, scope, constraints, dependencies, and likely execution path before changing anything.
2. **Preserve intent.** Keep what is already strong. Do not overwrite the user's real objective with your own preferences.
3. **Improve only when useful.** Rewrite only where the change materially improves clarity, reliability, structure, or execution readiness.
4. **Optimize for coding agents.** Favor precision, explicit scope, ordered steps, validation guidance, edge cases, and completion criteria.
5. **Avoid over-specifying without reason.** Add helpful structure and missing constraints, but do not inject unnecessary rules that could reduce flexibility.
6. **Ask before assuming.** If critical information is missing, ask concise clarifying questions before finalizing instead of silently inventing requirements.
7. **Keep the default output clean.** When enough context is available, return only the improved prompt unless the user explicitly asks for notes or analysis.

## Prompt Analysis Checklist

Before rewriting, examine the original prompt for:
- **Core objective** — what must be accomplished?
- **Deliverable shape** — code change, plan, bug fix, UI update, refactor, migration, review, docs, or investigation?
- **Scope boundaries** — which files, pages, systems, or layers are in/out of scope?
- **Constraints** — styling rules, platform limits, architecture constraints, tool constraints, backward compatibility, performance, accessibility, testing expectations, or "desktop unchanged / mobile only" style requirements.
- **Missing context** — files, dependencies, environment assumptions, data sources, existing patterns, or acceptance criteria that the coding agent would need.
- **Ambiguity or contradictions** — vague phrasing, conflicting requirements, unclear ownership, or missing success conditions.
- **Execution needs** — whether the task likely needs investigation, planning, incremental edits, testing, validation, or careful rollout.

## Optimization Workflow

Follow this sequence:

1. **Interpret the prompt**
   - Treat the text following `/prompt-optimizer` as the source prompt.
   - Identify the user's true goal.
   - Infer the likely engineering task type.
   - Detect whether the prompt is simple, moderate, or complex.

2. **Evaluate prompt quality**
   - Find ambiguity, omissions, contradictions, weak sequencing, or missing validation criteria.
   - Note what is already strong and should remain unchanged.

3. **Decide the minimum necessary improvements**
   - Do not rewrite everything by default.
   - Keep strong wording when it already serves the task well.
   - Expand only the parts that would help a coding agent execute more reliably.
   - If a missing detail is genuinely critical to correctness, stop and ask for it before producing the final prompt.

4. **Restructure for execution quality**
   - Organize the prompt into a clean, logical order.
   - Clarify scope, inputs, constraints, expected outputs, and validation steps.
   - Add explicit implementation guidance when it improves reliability.

5. **Strengthen coding-agent usability**
   - Make the task actionable.
   - Highlight relevant investigation steps.
   - Clarify whether the agent should inspect files first, plan before editing, make incremental changes, run tests, avoid regressions, and verify final behavior.
   - Include special handling for multi-file, multi-page, UI, refactor, migration, debugging, and architecture-sensitive tasks when relevant.

6. **Produce the final optimized prompt**
   - Output a polished prompt ready to hand directly to an AI coding agent.
   - The final prompt should be clear, well-structured, complete, and execution-ready.
   - Unless the user asks otherwise, return the improved prompt itself rather than a long explanation of what changed.

## Output Requirements

Default to returning:
- **A single improved prompt** that is ready to use with a coding agent.

If the original prompt lacks critical information needed to optimize it responsibly, ask concise clarifying questions first and wait for the answer before producing the final prompt.

Optionally, if the user explicitly asks, also provide:
- a brief list of key improvements,
- a shorter version,
- a more strict version,
- or variants optimized for different agent styles.

## Optimization Heuristics by Task Type

### Multi-file or refactor tasks
- Clarify affected systems, dependencies, sequencing, regression risks, and verification expectations.
- Encourage investigation before editing and incremental validation.

### UI overhaul or frontend tasks
- Clarify target pages/components, visual constraints, responsiveness expectations, style boundaries, and interaction behavior.
- Prevent cross-page leakage and unintended global changes.

### Debugging tasks
- Emphasize root-cause analysis, reproduction, targeted fixes, and validation against regressions.
- Avoid prompting the coding agent to patch symptoms blindly.

### Migration or architecture tasks
- Clarify current state, target state, compatibility expectations, rollout boundaries, and validation steps.
- Encourage planning and dependency awareness before edits.

### Small/simple tasks
- Keep the prompt lean.
- Do not inflate a small request into a heavyweight workflow unless the task genuinely requires it.

## Response Style Rules

When using this skill:
- Be precise and concise.
- Keep the optimized prompt balanced and adaptable by default.
- Preserve the user's voice where practical.
- Prefer clean sections and unambiguous instructions.
- Avoid filler, generic motivation, and unnecessary verbosity.
- Do not output code unless the user is asking for prompt text that itself contains code examples.

## Final Standard

The optimized prompt must:
- preserve the original intent,
- remove ambiguity where possible,
- improve structure and execution readiness,
- strengthen constraints and success criteria where useful,
- remain appropriately scoped,
- and be immediately usable by an AI coding agent.
