// src/main.ts
//
// Stage 1 placeholder only. This file exists purely to prove the
// webpack + TypeScript pipeline compiles and runs — it is NOT wired
// into index.html yet, and it does not import or touch any AngularJS
// code. That wiring (UpgradeModule bootstrap) happens in Stage 2.

function announce(message: string): void {
  // eslint-disable-next-line no-console
  console.log(`[build-pipeline-check] ${message}`);
}

announce('Webpack + TypeScript pipeline is compiling and running correctly.');
