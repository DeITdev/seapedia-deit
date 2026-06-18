# Development Workflow

## Approach

Build SEAPEDIA incrementally using a spec-driven workflow. The context files define what to build (`PRD.md`, `project-overview.md`), how to build it (`architecture-context.md`, `code-standards.md`, `ui-context.md`), the concrete rules and formulas (`knowledge.md`), and the current state (`progress-tracker.md`). Always implement against these specs — do not infer or invent behavior from scratch.

## Level-by-Level Order

The challenge is scored per level, and each level assumes the previous ones are implemented and integrated. Build in order: Level 1 → Level 7. A submission claiming Level N is judged on Levels 1–N only, so each level must work end to end before moving on.

Within a level, implement one feature unit at a time (e.g. Level 1: public marketplace → auth + roles → reviews → reusable UI foundations).

## Scoping Rules

- Work on one feature unit or subsystem at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step.
- Higher-level concepts mentioned early may use a placeholder, seed data, or documented setup until their level is reached (e.g. wallet balance placeholder in Level 1).

## When To Split Work

Split an implementation step if it combines:

- Public UI changes and protected backend/authorization changes.
- Multiple unrelated API routes.
- Schema/migration changes and unrelated feature UI.
- Behavior that is not clearly defined in the context files.

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior that is not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file (usually `PRD.md` or `knowledge.md`) before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.
- Where the brief allows a choice (e.g. discount combination rule, driver earning rule, tax base, SLA), record the chosen rule in `knowledge.md` and keep it consistent across UI, backend, and README.

## Protected Foundation Components

Do not modify generated third-party foundation components unless explicitly instructed. This includes:

- `components/ui/*` (shadcn/ui components)
- third-party library internals

These should remain default and reusable. Project-specific styling, layout, and feature logic go in app-level components, not in foundation components. Only modify these files when a task explicitly requires it.

## Security Is Continuous

Level 7 grades security, but the baseline (Prisma-safe queries, escaping user content, server-side RBAC and ownership checks, input validation) must be applied from the moment each feature is built — not retrofitted at the end. Level 7 is hardening and verification, not the first time security is considered.

## Keeping Docs In Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries → `architecture-context.md`
- Storage/data-model decisions → `architecture-context.md`
- Code conventions or standards → `code-standards.md`
- UI tokens or component conventions → `ui-context.md`
- Business rules, formulas, or chosen defaults → `knowledge.md`
- Feature scope → `project-overview.md` / `PRD.md`

`progress-tracker.md` must reflect the actual state of the implementation, not the intended state.

## Commit Discipline

Commit step by step as the project progresses. Do not squash everything into a single commit — the evaluator wants to see the development process through commit history.

## Before Moving To The Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant defined in `architecture-context.md` was violated.
3. The relevant business rules in `PRD.md` / `knowledge.md` are satisfied.
4. `progress-tracker.md` reflects the completed work.
