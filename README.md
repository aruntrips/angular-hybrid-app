# angular-hybrid-app

A small AngularJS app, migrated to Angular one stage at a time using
the `ngUpgrade` hybrid pattern — built as a documented case study
rather than a finished result.

Each stage is a real, working checkpoint: the app runs and its test
suite passes after every single one. Nothing is migrated in one leap;
each commit is small enough to revert on its own.

## Status

- [x] Stage 0 — characterization tests in place before any migration code
- [x] Stage 1 — webpack + TypeScript build added alongside the existing app, unwired
- [x] Stage 2 — hybrid bootstrap via UpgradeModule, replacing ng-app
- [x] Stage 3 — TaskService ported to Angular, downgraded for AngularJS to keep consuming
- [x] Stage 4 — taskItem component ported and downgraded
- [x] Stage 5 — TaskListController ported to an Angular component
- [x] Stage 6 — AngularJS removed entirely

Full write-up of the reasoning behind the ordering, and the test gate
for each stage, is in [`MIGRATION_GUIDE.md`](./MIGRATION_GUIDE.md).

## Running it

```bash
npm install
npm run build
```

Then open `index.html` for the app, or `SpecRunner.html` for the test
suite (both run directly in a browser, no dev server required).

## Why this exists

Most migration guides describe the technique in the abstract. This
repo is the same technique applied to a real (if small) codebase, with
each stage's actual diff, its test gate, and — where things broke —
the actual error and the actual fix, kept in the commit history rather
than smoothed over.
