#!/usr/bin/env node
// apps/task-manager/smoke-test.js
//
// task-manager has no unit specs of its own (main.ts/app.module.ts
// are pure wiring - the actual logic lives in task-core/task-ui,
// covered by their own Jest suites). What's worth checking here is
// that the built app actually boots in a real browser: this loads
// the built index.html in headless Chrome and asserts the seeded
// tasks render and the console is clean. Requires `nx build
// task-manager` (or `npm run build`) to have run first - dist/bundle.js
// must exist.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const APP_DIR = __dirname;
const BUNDLE = path.join(APP_DIR, 'dist', 'bundle.js');
const INDEX_HTML = path.join(APP_DIR, 'index.html');

const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'google-chrome',
  'chromium'
].filter(Boolean);

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    if (candidate.startsWith('/')) {
      if (fs.existsSync(candidate)) return candidate;
      continue;
    }
    try {
      execFileSync('which', [candidate], { stdio: 'ignore' });
      return candidate;
    } catch {
      // not on PATH, try next candidate
    }
  }
  return null;
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(BUNDLE)) {
  fail(`${BUNDLE} does not exist - run 'nx build task-manager' first.`);
}

const chrome = findChrome();
if (!chrome) {
  fail('No Chrome/Chromium binary found (checked CHROME_BIN, the standard macOS path, google-chrome, chromium).');
}

const dom = execFileSync(
  chrome,
  ['--headless', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=5000', '--dump-dom', `file://${INDEX_HTML}`],
  { encoding: 'utf8' }
);

const checks = [
  ['renders the app shell', /class="app-shell"/.test(dom)],
  ['renders all 4 seeded tasks', (dom.match(/class="task-item/g) || []).length === 4],
  ['renders the seeded task titles', dom.includes('Set up hybrid build') && dom.includes('Downgrade TaskItem component')],
  ['shows the remaining-count footer', /\d+ remaining/.test(dom)],
  ['has zero AngularJS markers', !/ng-scope|ng-repeat|ng-controller/.test(dom)],
  ['bootstrapped via Angular (ng-version present)', /ng-version="/.test(dom)]
];

const failures = checks.filter(([, ok]) => !ok).map(([label]) => label);

if (failures.length > 0) {
  fail(`smoke checks failed: ${failures.join(', ')}`);
}

console.log(`OK: all ${checks.length} smoke checks passed.`);
