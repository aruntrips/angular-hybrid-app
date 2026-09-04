# angular-hybrid-app

A small AngularJS app, migrated to Angular one stage at a time using
the `ngUpgrade` hybrid pattern — built as a documented case study
rather than a finished result.

Each stage is a real, working checkpoint: the app runs and its test
suite passes after every single one. Nothing is migrated in one leap;
each commit is small enough to revert on its own.

## Status

- ✅ **Stage 0** — characterization tests in place before any migration code
- ✅ **Stage 1** — webpack + TypeScript build added alongside the existing app, unwired
- ✅ **Stage 2** — hybrid bootstrap via `UpgradeModule`, replacing `ng-app`
- ✅ **Stage 3** — `TaskService` ported to Angular, downgraded for AngularJS to keep consuming
- ✅ **Stage 4** — `taskItem` component ported and downgraded
- ✅ **Stage 5** — `TaskListController` ported to an Angular component
- ✅ **Stage 6** — AngularJS removed entirely
- ✅ **Stage 7** — split into a monorepo (`apps/`/`packages/`, Nx)
- ✅ **Stage 8** — independent build/test/deploy per package

Full write-up of the reasoning behind the ordering, and the test gate
for each stage, is in [`MIGRATION_GUIDE.md`](./MIGRATION_GUIDE.md).

## Running it

```bash
npm install
npm run build   # nx build task-manager
npm test        # nx run-many --target=test --all
npm run serve   # nx serve task-manager, http://localhost:4300
```

As of Stage 7 this is an Nx monorepo (`apps/task-manager`,
`packages/task-core`, `packages/task-ui`) rather than a single flat
project - `npm run build` only builds the app, but `npm test` runs
every package's own test target (`nx run-many --target=test --all`).
Run `npx nx graph` to see the dependency boundaries between them.

## Why this exists

Most migration guides describe the technique in the abstract. This
repo is the same technique applied to a real (if small) codebase, with
each stage's actual diff, its test gate, and — where things broke —
the actual error and the actual fix, kept in the commit history rather
than smoothed over.