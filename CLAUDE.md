## Agent skills

### Issue tracker

Issues are tracked as local markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Git Commit Convention

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#commit-message-with-scope) with a **scope** naming the workspace touched:

```text
<type>(<scope>): <description>
```

- Types: `feat`, `fix`, `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test` (matches the global git-workflow convention)
- Scopes: `shared-types`, `backend`, `frontend`, `repo` (root-level/tooling changes not scoped to one workspace)

Examples: `feat(backend): implement GameGateway`, `test(shared-types): add reproducer for game state machine`, `docs(repo): update CLAUDE.md`.
