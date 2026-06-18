# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation context defined. Project not yet scaffolded.
- Next phase target: **Level 1 — Public Marketplace, Authentication, and Reviews**.

## Current Goal

- The user will set up the initial project (Next.js + Tailwind + shadcn/ui + Prisma/Supabase). After scaffolding, begin Level 1, starting with the public marketplace interface and reusable UI foundations.

## Completed

- Analyzed the COMPFEST 18 SEAPEDIA challenge brief.
- Authored the foundation context: `project-overview.md`, `PRD.md`, `architecture-context.md`, `code-standards.md`, `ai-workflow-rules.md`, `ui-context.md`, `knowledge.md`.

## In Progress

- None (awaiting initial project setup by the user).

## Next Up

- Scaffold the Next.js app, Tailwind, shadcn/ui, Prisma, and Supabase connection.
- Define the initial Prisma schema for Level 1 (User, Role/UserRole, ApplicationReview).
- Implement custom auth (register, login, logout, bcrypt, JWT/session) and active-role selection.
- Build public pages (landing, product listing with dummy data, product detail, login, register) and reusable UI foundations.

## Open Questions

- None outstanding. Chosen rules and defaults that the brief left open are recorded in `knowledge.md` and may be revisited there.

## Architecture Decisions (locked)

- Full-stack Next.js (App Router); backend implemented as Route Handlers in `app/api`. No separate backend service.
- Database: Supabase PostgreSQL accessed via Prisma ORM.
- Auth: custom JWT/session with bcrypt; users stored in our own DB. Multi-role ownership with an active-role chosen per session; authorization keyed off the active role and enforced server-side.
- UI: Tailwind + shadcn/ui, mandatory dark + light mode, responsive desktop/mobile.
- Money handled with exact precision (integer minor units or Decimal), never floating point.
- Time simulation via a controllable system clock plus an Admin-triggered "simulate next day" action for overdue handling.
- Architect for all 7 levels; build incrementally starting at Level 1.

## Session Notes

- Context files previously contained an unrelated "Ghost AI" project; all have been replaced with SEAPEDIA content.
- The user owns initial project scaffolding; the AI should only resume feature work after setup.
