import dns from 'dns';
import path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';
// https://vitejs.dev/config/
(dns as any).setDefaultResultOrder('verbatim');

export default () => {
  const shouldUseTSL =
    process.env.VITE_APP_USE_HTTPS?.toLowerCase() !== 'false';

  return defineConfig({
    plugins: [
      react(),
      nodePolyfills({
        globals: { Buffer: true, global: true, process: true }
      }),
      svgr({
        include: '**/*.svg',
        svgrOptions: {
          exportType: 'default'
        }
      }),
      ...(shouldUseTSL ? [basicSsl()] : [])
    ],
    resolve: {
      tsconfigPaths: true,
      dedupe: ['react', 'react-dom'],
      alias: {
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: [
            'legacy-js-api',
            'import',
            'global-builtin',
            'abs-percent',
            'color-functions',
            'if-function'
          ]
        }
      }
    },
    build: {
      outDir: 'build',
      cssMinify: true,
      minify: true,
      chunkSizeWarningLimit: 1000
    },
    server: {
      port: 3002,
      strictPort: true,
      https: shouldUseTSL,
      host: true,
      hmr: {
        overlay: false
      },
      watch: {
        usePolling: false,
        useFsEvents: false
      }
    },
    preview: {
      port: 3002,
      strictPort: true,
      https: shouldUseTSL,
      host: 'localhost'
    }
  });
};
