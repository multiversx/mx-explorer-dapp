import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'E2E Report',
    inlineAssets: true,
    saveAllAttempts: true,
    mochaFile: 'results/my-test-output-[hash].xml',
    overwrite: false,
    html: false,
    json: true,
    embeddedScreenshots: true
  },
  e2e: {
    baseUrl: 'https://integration-explorer.multiversx.com/',

    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});
