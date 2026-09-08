# AngularJS → Angular: Incremental Migration Case Study

A small AngularJS application migrated to modern Angular one stage at a time using the `ngUpgrade` hybrid pattern — built as a **documented case study rather than a finished-result showcase**.

Each stage is a real, working checkpoint: the application runs and its test suite passes after every step. Nothing is migrated in one leap, and each commit is small enough to understand and revert independently.

## Status

* ✅ **Stage 0** — characterization tests in place before any migration code
* ✅ **Stage 1** — webpack + TypeScript build added alongside the existing application, unwired
* ✅ **Stage 2** — hybrid bootstrap via `UpgradeModule`, replacing `ng-app`
* ✅ **Stage 3** — `TaskService` ported to Angular and downgraded for AngularJS consumption
* ✅ **Stage 4** — `taskItem` component ported and downgraded
* ✅ **Stage 5** — `TaskListController` ported to an Angular component
* ✅ **Stage 6** — AngularJS removed entirely
* ✅ **Stage 7** — application split into an Nx monorepo (`apps/` / `packages/`)
* ✅ **Stage 8** — independent build/test/deploy per package

The reasoning behind the ordering, migration decisions, and test gate for each stage is documented in [`MIGRATION_GUIDE.md`](https://github.com/aruntrips/angular-hybrid-app/blob/main/MIGRATION_GUIDE.md).

## Migration approach

The application enters a **hybrid AngularJS + Angular state** while migration happens incrementally.

```text
AngularJS application
        │
        ▼
Hybrid AngularJS + Angular
        │
        ├── Port services
        ├── Port components
        ├── Migrate application boundaries
        └── Keep tests passing at each stage
        │
        ▼
Angular application
        │
        ▼
Nx monorepo with independent packages
```

The hybrid period is not a separate phase that happens before incremental migration. It is the mechanism that allows AngularJS and Angular code to coexist while individual parts of the application are migrated.

This approach makes it possible to:

* migrate functionality incrementally
* keep the existing application operational during the transition
* introduce Angular code without requiring a big-bang rewrite
* manage shared services and clear boundaries between legacy and modern code
* validate each migration step through the existing test suite
* keep every meaningful migration step independently reviewable

## Repository structure

The repository is organized as a progression of migration stages.

**Stages 0–6** document the application moving from its original AngularJS implementation through the hybrid architecture to a fully Angular application.

**Stages 7–8** then show the next architectural step: restructuring the application as an Nx monorepo with separate application and package boundaries.

The current structure includes:

```text
apps/
  task-manager/

packages/
  task-core/
  task-ui/
```

The commit history preserves the progression between these stages, including the implementation changes, test gates, failures, and fixes.

## Running it

```bash
npm install

npm run build   # nx build task-manager
npm test        # nx run-many --target=test --all
npm run serve   # nx serve task-manager
```

The application is served at `http://localhost:4300`.

As of Stage 7 this is an Nx monorepo rather than a single flat project. `npm run build` builds the application, while `npm test` runs the test target for every package.

You can inspect the dependency boundaries with:

```bash
npx nx graph
```

## Why this exists

Most migration guides describe the technique in the abstract.

This repository applies the technique to a working application and preserves the migration as a sequence of observable steps.

Each stage has:

* an actual implementation change
* a test gate
* a working checkpoint
* a corresponding commit
* documented reasoning

And when something broke, the actual error and the actual fix were kept in the history rather than smoothed over for presentation.

The goal is not to demonstrate that AngularJS can be replaced.

It is to show **how an existing application can be modernized incrementally while keeping the migration understandable, testable, and reversible.**
