# Hybrid Migration Guide: AngularJS → Angular (via ngUpgrade)

This app is deliberately small but structured the way real AngularJS
apps are: a data service, a controller with real logic, and a leaf
component. Use it to practice the *hybrid* migration pattern, where
both frameworks run side-by-side in the same page during the
transition, rather than a big-bang rewrite.

Mapped to the general refactor framework: lowest-risk changes first,
one concern per step, tests at every stage, nothing removed until its
replacement has been running safely.

---

## Stage 0 — Safety net (before any Angular code exists)

- Add a few behavioral tests against the current app using
  [Karma + Jasmine](https://karma-runner.github.io/) (AngularJS's
  standard test stack): assert that `TaskService.add()` grows the
  list, `toggle()` flips `done`, `TaskListController.filteredTasks()`
  returns the right subset per filter.
- Manually note the current behavior of `taskItem` (checkbox toggle,
  remove button, done styling) — this becomes your acceptance
  checklist for the downgraded version later.
- **Test gate:** existing Karma suite green, manual checklist written.

## Stage 1 — Introduce the build tooling, change nothing else

- Add Angular CLI (or a manual webpack + TypeScript setup) alongside
  the existing plain-script AngularJS app. Do not touch `app.js` or
  any controller/service yet.
- Confirm the AngularJS app still boots and works exactly as before
  through the new build pipeline (even if Angular itself isn't wired
  in yet).
- **Test gate:** Karma suite still green; app manually smoke-tested
  end to end. If anything changed here, you've mixed concerns — back
  up and isolate the build change.

## Stage 2 — Bootstrap the hybrid app

- Install `@angular/upgrade` and switch bootstrapping from
  `ng-app="taskApp"` (auto-bootstrap) to `UpgradeModule`'s manual
  bootstrap, which starts both AngularJS and Angular in one app.
- At this point **no components are migrated yet** — this stage only
  proves the two frameworks can coexist and both change-detection
  loops run without errors.
- **Test gate:** app behaves identically to Stage 1; check the
  browser console for zone.js/digest conflicts (a common early
  failure mode in hybrid apps).

## Stage 3 — Migrate the data service first

- Port `TaskService` to a TypeScript Angular service (`@Injectable`).
  It has no DOM coupling, so this is a pure logic port — the ideal
  first migration target, same principle as "migrate leaf/low-risk
  units first" in the general framework.
- Register it for AngularJS consumption with
  `downgradeInjectable('TaskService')` so `TaskListController` (still
  AngularJS) can keep injecting `TaskService` unchanged.
- **Test gate:** re-run the Stage 0 service tests, now as
  Jasmine/Karma *or* Jest against the Angular class — same assertions,
  same results. `TaskListController` needs zero code changes.

## Stage 4 — Migrate the leaf component

- Rewrite `taskItem` as an Angular `@Component` with `@Input() task`
  and `@Output() toggle/remove` replacing the `<`/`&` bindings.
- Register it with `downgradeComponent()` so the AngularJS template in
  `index.html` can keep using `<task-item>` with no markup changes.
- **Test gate:** run your Stage 0 manual checklist against the
  downgraded component — checkbox toggle, remove, done-styling must
  behave identically. This is the step most likely to reveal binding
  mismatches (e.g. one-way vs two-way), so test it in isolation before
  moving on.

## Stage 5 — Migrate the controller/container

- Now that its two dependencies (`TaskService`, `taskItem`) are
  Angular-native, port `TaskListController` to an Angular component
  (e.g. `<task-list>`), moving `filteredTasks()`, `remainingCount()`,
  `addTask()` etc. as class methods.
- Downgrade *this* component and swap the AngularJS
  `ng-controller="TaskListController as vm"` root for `<task-list>` in
  `index.html`.
- **Test gate:** full re-run of the filter/add/remove behavior tests,
  now against the Angular component; manual smoke test of the whole
  page, since this is the widest-blast-radius change so far.

## Stage 6 — Remove ngUpgrade

- Once every controller/service/component is Angular-native and
  nothing references `angular.module('taskApp', ...)` anymore, remove
  `UpgradeModule`, the AngularJS script tag, and the old `.js` files.
- **Test gate:** full suite green with zero AngularJS on the page;
  check bundle size dropped (confirms AngularJS was actually removed,
  not just unused).

---

## Why this order

Same logic as any refactor: change the thing with the fewest
dependents first (`TaskService` has none), then the thing that depends
only on it (`taskItem`), then the thing that depends on both
(`TaskListController`), and only remove the old framework once nothing
points to it. Each stage is independently revertable — if Stage 4
breaks, Stages 1–3 are still a fully working, shippable hybrid app.
