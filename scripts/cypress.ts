/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const cypress = require('cypress');
const fse = require('fs-extra');
const { merge } = require('mochawesome-merge');
const generator = require('mochawesome-report-generator');

const FAILED_SPECS_FILE = 'failed-specs.txt';

async function runTests() {
  await fse.remove('mochawesome-report');
  await fse.remove(FAILED_SPECS_FILE);

  const specFilter = process.env.E2E_SPEC;
  if (specFilter) {
    console.log(`Running only previously failed specs: ${specFilter}`);
  }

  const results = await cypress.run(specFilter ? { spec: specFilter } : {});

  if (results.status === 'failed') {
    console.error(results.message);
    process.exit(1);
  }

  const failedSpecs = results.runs
    .filter((run) => run.stats.failures > 0 || Boolean(run.error))
    .map((run) => run.spec.relative);

  if (failedSpecs.length > 0) {
    await fse.outputFile(FAILED_SPECS_FILE, `${failedSpecs.join('\n')}\n`);
  }

  const jsonReport = await merge();
  await generator.create(jsonReport);

  process.exit(failedSpecs.length > 0 ? 1 : 0);
}

runTests();
