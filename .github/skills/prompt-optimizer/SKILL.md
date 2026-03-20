---
name: prompt-optimizer
description: 'Analyze, refine, and optimize any user-provided prompt for an AI coding agent. Use when the user invokes /prompt-optimizer with a draft prompt that should be transformed into a clearer, more precise, better-structured, execution-ready prompt for coding, refactors, UI overhauls, migrations, debugging, architecture edits, or other complex implementation work. This skill improves the prompt only and does not perform the coding task itself.'
argument-hint: 'Paste the draft prompt to optimize after /prompt-optimizer'
disable-model-invocation: true
---

# Prompt Optimizer

This skill exists for one job only: improve the user's prompt so it is maximally effective for an AI coding agent.

It must **not** perform the coding task, produce implementation output, edit files, debug code, or act as if it were executing the prompt. Its only responsibility is to turn the user's draft prompt into a stronger prompt.

## Invocation Contract

When this skill is invoked as `/prompt-optimizer ...`, treat **everything after `/prompt-optimizer`** as the draft prompt to analyze and improve.

Do not require the user to separately say that they want prompt help. The slash command itself is the request.

## What This Skill Should Do

The skill should:
- analyze the draft prompt before rewriting anything
- understand the user's real goal, scope, and intended outcome
- preserve the user's original intent
- improve the prompt only where the changes materially increase clarity, precision, structure, completeness, or execution reliability
- keep strong existing instructions when they already work well
- organize the final result into a polished, execution-ready prompt for an AI coding agent

The skill should especially strengthen prompts for:
- multi-step tasks
- multi-file changes
- multi-page frontend work
- refactors
- UI overhauls
- migrations
- debugging and root-cause analysis
- architecture or integration changes

## What This Skill Must Not Do

The skill must not:
- solve the coding task itself
- produce code unless the draft prompt itself is the thing being optimized
- rewrite aggressively when the original wording is already effective
- change the user's intent, scope, or priorities unless the draft prompt is internally contradictory
- pad the result with unnecessary prose
- turn a short prompt into a bloated one without real benefit

## Analysis Process

Before generating the improved prompt, inspect the draft prompt for:
- **goal clarity** — what outcome is actually being requested?
- **scope boundaries** — what is in scope, out of scope, or ambiguous?
- **constraints** — technical, design, repo, workflow, safety, time, compatibility, or platform limits
- **context completeness** — what background, files, systems, pages, or dependencies are missing?
- **execution needs** — does the task require investigation, planning, sequencing, testing, validation, or rollback awareness?
- **output expectations** — what exactly should the AI coding agent deliver?
- **quality criteria** — what would make the result successful, safe, and reviewable?
- **ambiguities or conflicts** — what instructions are vague, conflicting, underspecified, or easy to misread?

## Improvement Strategy

Apply only changes that materially improve the prompt.

### If the draft prompt is weak or underspecified
- clarify the objective
- define the desired deliverable
- add missing constraints when they are clearly implied by the request
- add useful execution guidance for reliability
- structure the prompt so the agent can follow it step by step

### If the draft prompt is already strong
- preserve its strengths
- tighten wording only where it removes ambiguity or improves follow-through
- avoid cosmetic rewrites with no functional benefit

### If the draft prompt is contradictory or risky
- resolve contradictions by making priorities explicit
- add guardrails such as preserving behavior, limiting scope, avoiding regressions, or validating changes
- make tradeoffs visible inside the optimized prompt

### If critical information is missing
- produce the best improved prompt possible
- add a short **Open Questions** section only when the missing information would materially affect execution quality
- keep that section concise and high-value

## Recommended Prompt Structure

When helpful, transform the draft into a prompt with sections such as:
- objective
- context
- scope
- constraints
- execution guidance
- deliverables
- validation or testing expectations
- output format
- open questions

Use only the sections that improve the prompt. Do not force a template when a simpler structure is better.

## Coding-Agent Optimization Rules

Optimize the final prompt for AI coding agents by improving:
- clarity of the requested task
- ordering of steps and decision points
- file or component awareness
- explicit constraints and non-goals
- expectations for investigation before editing
- expectations for testing, validation, and verification
- follow-through on multi-step work
- resistance to scope drift or shallow execution

When useful, strengthen prompts with instructions like:
- inspect relevant files before editing
- identify dependencies and side effects
- make small, verifiable changes
- preserve existing behavior unless explicitly changing it
- test after changes
- summarize what changed and how it was validated

Do this only when it genuinely improves the prompt for the task at hand.

## Output Requirements

Return a polished, high-performance prompt that is ready to give directly to an AI coding agent.

By default, the response should contain:
1. **Optimized Prompt** — the improved prompt itself
2. **Open Questions** — only if essential

Do not include a long explanation of what was changed unless the user explicitly asks for one.

## Quality Bar

Before finalizing the optimized prompt, ensure it:
- preserves the user's original intent
- is clearer and more actionable than the draft
- removes avoidable ambiguity
- includes meaningful scope and constraint guidance
- improves execution reliability for a coding agent
- avoids unnecessary rewriting
- is structured well enough to support complex implementation work

## Example Behavior

### Example Input
`/prompt-optimizer Update the roster page so the filters look better on mobile without messing up desktop.`

### Example Output Shape
- an improved prompt that clarifies the target page
- explicit mobile-only scope
- instruction to inspect the relevant HTML, CSS, and JS first
- instruction to avoid desktop regressions
- validation expectations for mobile and desktop behavior

The final answer should still be the optimized prompt, not the actual implementation.
