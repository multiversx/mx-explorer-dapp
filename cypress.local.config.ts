import { defineConfig } from 'cypress';

// runs the e2e suite against a locally built bundle
//
//   pnpm run build-devnet
//   pnpm run preview-http
//   pnpm run cy:local
//

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3002',
    setupNodeEvents() {}
  }
});
