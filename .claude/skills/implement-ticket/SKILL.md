---
name: implement-ticket
description: 'Implement one ticket from .scratch/<feature-slug>/issues/, given its path as the argument.'
argument-hint: '<path to .scratch/<feature-slug>/issues/NN-*.md>'
disable-model-invocation: true
---

Ticket path: $ARGUMENTS

If the ticket path above is empty, stop and ask the user which ticket to implement. Do not guess from the IDE's opened file.

Before writing any code:

1. Read the ticket file at that path in full.
2. Read the parent spec at `.scratch/<feature-slug>/spec.md` (the directory two levels above the ticket).
3. Read any files, tickets, or ADRs the ticket links to, and check that tickets it is blocked by are marked done.
4. Read `CONTEXT.md` and relevant `docs/adr/` entries for domain terms.

Then implement the work the ticket describes:

- Use /tdd where possible, at pre-agreed seams.
- Run typechecking regularly, single test files regularly, and the full test suite once at the end.
- Once done, use /code-review to review the work.
- Mark the ticket done following `docs/agents/issue-tracker.md`.
- Remove the ticket's row from `.scratch/not-implemented.md`. If that leaves a feature with no open tickets, add it to the "Fully done" list.
- Commit your work to the current branch, following the commit convention in `CLAUDE.md`.
