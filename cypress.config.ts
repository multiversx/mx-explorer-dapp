import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://testnet-explorer.multiversx.com/',

    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});
