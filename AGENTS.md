# AGENTS.md

## Project Overview

This is [EthUX Design](https://ethux.design) — a data-driven site documenting Ethereum UX pain points paired with implementation guidance for builders. It has two halves:

1. **Web content** (`data.js`, `app.js`, `style.css`, `index.html`) — the public site showing 38+ UX problems, solutions, adoption data, and builder checklists
2. **Skills** (`skills/`) — SKILL.md files that AI coding agents consume to build Ethereum dApps with correct UX patterns

The skills are derived from the web content but go deeper — they contain implementation patterns, code examples, decision trees, and error states that the web checklists summarize.

## Entry Point

`SKILL.md` at the project root is the top-level router. It is accessible both locally and at `https://ethux.design/SKILL.md`. It routes agents to the right domain skill by user action, by EIP/standard, and lists all shared reference files. When adding a new skill or reference, update this file's routing tables.

## Content Architecture

```
SKILL.md (root)              ──→  Routes to all skills below
data.js                          skills/
├── categories[].problems[]  ──→  Context for skill patterns
├── checklists[]             ──→  1:1 map to skill directories
│   ├── approvals            ──→  skills/approvals/SKILL.md
│   ├── signing              ──→  skills/signing/SKILL.md
│   ├── gas                  ──→  skills/gas/SKILL.md
│   ├── multichain           ──→  skills/multichain/SKILL.md
│   ├── onboarding           ──→  skills/onboarding/SKILL.md
│   ├── wallets              ──→  skills/wallets/SKILL.md
│   └── safety (implicit)    ──→  skills/safety/SKILL.md
└── CRITICAL_DETAILS{}       ──→  Informs severity/framing in skills

SKILL.md (root)              ──→  Also contains universal patterns (loading labels, errors, confirmations, addresses)

skills/shared/
└── references/              ──→  Specialized patterns loaded on demand
    ├── eip5792.md           ──→  Referenced by approvals, gas
    ├── stuck-transactions.md──→  Referenced by gas, signing
    └── irreversibility.md   ──→  Referenced by approvals, signing
```

## When Editing Web Content, Update Skills

**Any change to `data.js` or `app.js` that adds, removes, or modifies UX problems, solutions, EIPs, or checklists must be reflected in the corresponding SKILL.md files.**

After editing web content, check:

1. **New checklist item added?** The matching SKILL.md should already cover the pattern. If it doesn't, add a new pattern section to the skill following the existing format (When/How/Fallback/Error state).
2. **New EIP or standard referenced?** Add it to the relevant skill's patterns and cross-references. If it introduces a new capability (like EIP-5792 did for batching), determine whether it belongs in a skill's main body or as a shared reference file.
3. **New problem or category added?** Determine which existing skill covers it, or whether a new skill directory is needed. Every checklist ID in `data.js` should map to a `skills/<id>/SKILL.md`.
4. **Solution status changed?** (e.g., "Draft" to "Live") Update the corresponding skill pattern — a live solution may need concrete implementation guidance that a draft did not.
5. **Problem removed or merged?** Check if the corresponding skill pattern is now orphaned and should be removed or consolidated.

## When Editing Skills, Check Web Consistency

If you add a new pattern to a SKILL.md that doesn't correspond to any checklist item in `data.js`, consider whether it should be surfaced on the web side too.

## Progressive Disclosure Rules for Skills

Skills use a three-tier loading system. As content grows, actively manage what goes where:

### Tier 1: SKILL.md body (always loaded when skill triggers)
- ALWAYS/NEVER rules for the domain
- Implementation patterns with code examples
- Decision trees and fallback flows
- **Target: under 300 lines per skill. Hard limit: 500 lines.**

### Tier 2: `references/` files (loaded on demand by the skill or by other skills that cross-reference)
- Specialized patterns only needed by 1-2 skills
- Detailed code examples or data structures that support a pattern but aren't the pattern itself
- Standards explanations that multiple skills share

### Tier 3: External skills (ethskills, etc.)
- Implementation-level details (contract addresses, framework setup, deployment)
- Pointed to in the "Implementation Resources" section at the bottom of each skill

### When to move content to a reference file

Apply these checks whenever a skill is edited:

1. **Is this section referenced by only 1-2 other skills?** If yes and it's more than ~15 lines, it's a candidate for `shared/references/`.
2. **Is a skill approaching 300 lines?** Identify sections that are detailed elaborations of a pattern (e.g., typed data structures, full API schemas) and extract them to `<skill>/references/`.
3. **Is a code example longer than 20 lines?** Consider moving it to a reference file and leaving a summary + pointer in the main skill.
4. **Is a section only relevant in advanced/edge-case scenarios?** Reference file. The main skill body should cover the common path.

### When NOT to extract to a reference file

- The content is under 15 lines
- The content is a core ALWAYS/NEVER rule
- Extracting it would break the flow of a pattern's When/How/Fallback/Error structure
- Every skill that exists needs this content (it belongs in the root `SKILL.md` Shared UX Patterns section)

### Cross-reference format

When a skill points to a reference file, use a relative markdown link with a brief note on when to load it:

```markdown
See [EIP-5792 capability detection](../shared/references/eip5792.md) for the full detection pattern and decision tree.
```

When a skill points to content in the shared core (root SKILL.md), reference the section name:

```markdown
See [shared](../../SKILL.md) Loading Labels.
```

## Skill File Format

Every SKILL.md follows this structure:

```markdown
---
name: <skill-id>
description: "<what it covers, when to trigger — be specific and slightly pushy>"
---

# <Title>

**Scope:** What this skill covers.
**Does NOT cover:** Adjacent topics (with links to the right skill).
**Cross-references:** Links to shared, reference files, and related skills.

## ALWAYS
- Bullet list of mandatory behaviors

## NEVER
- Bullet list of prohibited behaviors

## Patterns

### N. Pattern Name

**When:** Trigger condition.

**How:**
1. Step-by-step implementation with code examples

**Fallback:** What to do when the ideal path isn't available.

**Error state:** User-facing messages for each failure mode.

---

## Implementation Resources
- Pointers to ethskills.com and external references
```

## Shared Patterns Location

The root `SKILL.md` contains the "Shared UX Patterns" section with patterns needed by ALL or MOST skills:
- Loading Labels
- Post-Action Confirmation
- Error Message Formatting (including jargon translation table)
- Address Display Standards

Specialized patterns live in `skills/shared/references/`. The root SKILL.md includes a routing table pointing to each reference file.

If a new cross-cutting pattern is added, ask: "Do at least 4 of the 7 domain skills need this?" If yes, it goes in the root SKILL.md shared patterns section. If no, it goes in `skills/shared/references/`.
