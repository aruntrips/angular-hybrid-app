# Modernizing AngularJS Incrementally: A Dependency-Ordered Case Study

> A practical case study in using characterization, dependency ordering, and validation gates to modernize an AngularJS application incrementally.

## Executive Summary

This case study explores a common modernization question:

> **Can an AngularJS application be modernized incrementally without creating more risk than it removes?**

Rather than treating migration as a single large transformation, this project applies an incremental AngularJS → Angular migration to a small but realistic task-management application.

The application is migrated using `ngUpgrade`, with each meaningful transition preserved as a separate, revertable step.

The result is not simply a demonstration of `ngUpgrade`. It demonstrates a way of controlling incremental modernization:

1. Establish a behavioral baseline.
2. Isolate infrastructure changes from application changes.
3. Prove framework coexistence.
4. Migrate according to dependency order.
5. Validate behavior after each meaningful transition.
6. Remove the legacy framework only when its dependencies are gone.
7. Carry the proven dependency structure into the modern architecture.
8. Use the resulting dependency graph to drive CI and deployment boundaries.

The central lesson is:

> **Incremental modernization works best when migration order follows system dependencies and every meaningful transition has an explicit validation gate.**

---

## 1. The Modernization Question

When an AngularJS application needs modernization, an incremental migration is often attractive because the existing application can continue operating while individual pieces are replaced.

But incremental migration should not be treated as automatically safe.

A hybrid application introduces its own complexity:

- AngularJS and Angular running together
- AngularJS and Angular dependency injection
- downgraded and upgraded services and components
- different binding semantics
- interaction between Angular change detection and AngularJS digest cycles
- an extended period in which both frameworks must coexist

The question therefore becomes:

> **Can the application be divided into transitions that can be migrated and validated independently?**

This project uses a deliberately small application to make that question observable.

---

## 2. The Application

The example is a small task-management application containing:

- a `TaskService`
- a `TaskListController`
- a `taskItem` leaf component
- task filtering and mutation logic
- AngularJS templates and bindings

Although intentionally small, it contains enough structure to exercise several real migration concerns:

- service dependencies
- controller logic
- component bindings
- AngularJS → Angular interoperability
- behavioral validation

The objective is not to claim that this application represents every production AngularJS system.

Instead, it provides a controlled environment in which the migration sequence, dependency ordering, and validation strategy can be examined.

---

## 3. The Initial Hypothesis

The initial hypothesis was:

> **If the application's pieces can be migrated independently while preserving behavior, an incremental AngularJS → Angular migration can reduce the risk associated with a large, simultaneous rewrite.**

This hypothesis has an important condition:

> **Each meaningful migration transition must remain independently verifiable.**

If that condition cannot be maintained, the incremental approach may no longer provide the expected risk reduction.

---

## 4. Establishing a Safety Net

Before changing the framework, characterization tests were added to the existing AngularJS application.

The tests captured observable behavior around:

- `TaskService.add()`
- `TaskService.toggle()`
- `TaskService.filteredTasks()`

A manual checklist was also created for the `taskItem` component.

This establishes a behavioral baseline before modernization begins.

### Why this matters

A migration can be technically successful while changing application behavior.

A successful build does not establish behavioral equivalence with the original application.

The baseline therefore provides a reference against which subsequent structural changes can be evaluated.

### Validation gate

- Karma/Jasmine characterization suite passes.
- `taskItem` behavior checklist is documented.

---

## 5. Stage 1 — Introduce the New Build Pipeline

Angular CLI / webpack / TypeScript were introduced alongside the existing AngularJS application.

No application behavior was intentionally changed at this stage.

### Why this order?

Build tooling and framework migration are separate concerns.

Keeping them separate makes failures easier to attribute.

If the application fails after this stage, the framework migration has not yet become the likely explanation.

### Validation gate

The existing AngularJS application continues to boot and behave as before.

---

## 6. Stage 2 — Prove Hybrid Bootstrap

The AngularJS `ng-app` automatic bootstrap was replaced with `UpgradeModule`'s manual bootstrap.

At this point, AngularJS and Angular run on the same page, but the application pieces have not yet been migrated.

This establishes the hybrid runtime before adding migrated services or components.

### Why this order?

It separates two different questions:

> **Can AngularJS and Angular coexist in the application?**

from:

> **Can this particular application component or service be migrated?**

Proving coexistence first makes later migration failures easier to isolate.

### Validation gate

- Application boots.
- AngularJS continues to operate.
- Angular operates alongside AngularJS.
- No zone.js / digest-related console errors are introduced.

---

## 7. Stage 3 — Migrate `TaskService`

`TaskService` was migrated to an Angular `@Injectable`.

The Angular service was exposed back to AngularJS using `downgradeInjectable()`.

### Why start here?

`TaskService` has no DOM coupling and represents a low-risk migration target.

It can therefore be migrated without first moving the controller that consumes it.

The existing behavioral assertions were retained against the new implementation.

### Validation gate

The existing service behavior continues to pass.

The controller does not need to be rewritten merely because the service has moved.

This provides evidence that an individual dependency can cross the framework boundary independently.

---

## 8. Stage 4 — Migrate the Leaf Component

`taskItem` was rewritten as an Angular component.

AngularJS bindings:

- `<`
- `&`

were replaced with Angular:

- `@Input`
- `@Output`

The Angular component was exposed to AngularJS using `downgradeComponent()`.

### Why this order?

`taskItem` is a leaf component in the dependency structure.

It can therefore be migrated without first moving the larger controller responsible for the surrounding application flow.

This also creates a contained opportunity to surface binding differences between AngularJS and Angular.

### Validation gate

The manual behavior checklist is re-run.

Binding mismatches are treated as migration findings rather than silently accepted.

---

## 9. Stage 5 — Migrate `TaskListController`

`TaskListController` was migrated to an Angular component, replacing `ng-controller`.

At this point, it depends on pieces that have already crossed the framework boundary.

This makes it a larger change than the previous migration stages.

The full task behavior is re-tested:

- adding tasks
- removing tasks
- filtering tasks
- changing task state

A manual smoke test is also performed.

### Why migrate it later?

The migration follows a simple dependency principle:

> **Migrate the thing with no dependents first, then the thing that depends only on already-migrated pieces, and finally the larger piece that depends on multiple migrated pieces.**

This keeps the early transitions small and limits their blast radius.

---

## 10. Stage 6 — Remove `ngUpgrade`

Once no application pieces depend on AngularJS:

- `UpgradeModule` is removed.
- The AngularJS script tag is removed.
- Obsolete AngularJS JavaScript files are deleted.

The hybrid phase ends.

### Validation gate

- Full test suite passes.
- Application runs without AngularJS.
- Bundle-size comparison confirms that the legacy runtime has actually been removed.

The important condition is:

> **The old framework is removed because its dependency graph is empty, not simply because the migration checklist says it is time to remove it.**

---

## 11. Stage 7 — Preserve the Dependency Structure

The application is then reorganized into an Nx monorepo:

```text
packages/
  task-core/
  task-ui/

apps/
  task-manager/
```

The boundaries reflect the dependency relationships established during migration:

```text
task-core
    ↓
task-ui
    ↓
task-manager
```

This is significant because migration order was not treated as merely a sequence of framework conversions.

The dependency structure made explicit during modernization informs the subsequent architecture.

### Validation gate

- Nx test targets pass.
- `nx graph` reflects the intended project boundaries.

---

## 12. Stage 8 — Independent Build, Test and Deployment

CI is changed to use `nx affected`.

The dependency graph now determines which projects need validation.

For example:

```text
task-core change
      ↓
   task-ui
      ↓
task-manager
```

A change to `task-core` therefore requires downstream projects to be considered for validation.

A change only to the application shell does not require unrelated downstream projects to run.

The result is not merely a faster CI configuration.

The CI system now reflects the dependency structure established during modernization.

### Validation gate

A representative CI change demonstrates the expected affected behavior:

- A PR touching only the shell causes unrelated project jobs to be skipped rather than merely cached.
- A PR touching `task-core` causes the downstream projects to participate in validation.

---

## 13. The Ordering Logic

The migration sequence follows a classic dependency-order refactoring principle:

> **Migrate the thing with zero dependents first, then the thing that depends only on that, then the thing that depends on both.**

Applied to this application:

```text
TaskService
     ↓
 taskItem
     ↓
TaskListController
```

The same principle is then applied to the application's structural organization.

The resulting Nx package boundaries mirror the dependency relationships that were already proven during migration.

This creates an important connection between modernization and architecture:

> **The migration sequence can expose dependency boundaries that later become architectural boundaries.**

---

## 14. What the Migration Demonstrated

### 14.1 Incremental migration can be made evidence-driven

The migration did not require committing to a complete transformation in a single step.

Each major transition created an observable checkpoint.

### 14.2 Dependency order matters

The migration sequence was determined by dependencies rather than arbitrary file or folder ordering.

This reduced the blast radius of early changes.

### 14.3 Characterization tests are a modernization tool

The tests were not introduced primarily to increase coverage.

They established a behavioral reference against which structural changes could be evaluated.

### 14.4 Hybrid operation is a means, not the objective

`ngUpgrade` makes incremental migration possible.

It does not, by itself, prove that incremental migration is the best modernization strategy for every application.

The technique still needs to be evaluated against the application's characteristics and constraints.

### 14.5 Architecture can follow validated migration boundaries

The final Nx structure follows dependency relationships made explicit during migration.

The migration therefore informed architectural restructuring rather than treating architecture as an entirely separate exercise.

### 14.6 Validation gates make migration progress explicit

Each stage has a defined condition for moving forward.

This changes migration from:

> “Convert code until the application eventually works.”

to:

> **“Make a bounded change, validate it, and use the result to justify the next change.”**

---

## 15. What This Does Not Prove

This is deliberately a bounded case study.

It does **not** prove that:

- every AngularJS application should use `ngUpgrade`
- incremental migration is always safer than rewriting
- a small application behaves like a large production system
- hybrid migration eliminates modernization risk
- the same migration sequence will work unchanged elsewhere
- the resulting Nx structure is appropriate for every Angular application

The value of the experiment is narrower:

> **It demonstrates how an incremental modernization strategy can be evaluated through controlled transitions, dependency ordering, and explicit validation gates.**

For a production application, the modernization strategy would still require evidence about the actual system, including:

- architectural coupling
- business-rule concentration
- behavioral confidence
- testability
- framework boundaries
- dependency constraints
- deployment requirements
- team capability
- modernization horizon

---

## 16. The Broader Lesson

The important modernization question is not simply:

> **“Can we migrate this application incrementally?”**

It is:

> **“Can we make each step of the incremental migration independently understandable and verifiable?”**

In this case, that meant two things:

1. **Migration order followed the dependency structure of the application.**
2. **Each meaningful transition had an explicit validation gate.**

This kept individual changes bounded, made failures easier to attribute, and provided evidence before moving to the next stage.

The same principle extended beyond framework migration. The dependency relationships established during the migration later informed the Nx package boundaries and affected CI behavior.

The broader lesson is therefore not that dependency-ordered migration is always the right strategy.

It is that:

> **Modernization decisions become safer when the strategy is translated into controlled transitions, with each transition producing evidence that justifies the next one.**

---

## Repository

This case study is implemented in the accompanying repository:

**[`angular-hybrid-app`](https://github.com/aruntrips/angular-hybrid-app)**

The repository preserves the modernization process as real, revertable commits, including intermediate failures and the progression from AngularJS through hybrid operation to a fully Angular/Nx-based structure.

---

## Technical Stack

- AngularJS
- Angular 17.3
- Nx 19
- webpack 5
- zone.js 0.14
- Jest
- `jest-preset-angular`
- Angular `UpgradeModule`
- `downgradeInjectable()`
- `downgradeComponent()`
- TypeScript

The application is served locally at `localhost:4300`.