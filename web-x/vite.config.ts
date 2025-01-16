import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react-swc";
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


import tsconfigPaths from "vite-tsconfig-paths";

import { ManifestV3Export, crx } from "@crxjs/vite-plugin";

import manifestJson from "./manifest.json";

const manifest = manifestJson as ManifestV3Export;

export default defineConfig({

  plugins: [
    tsconfigPaths(),
    react(),
    crx({ manifest }),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
      globals: {
        Buffer: true,
        global: true,
        process: true,
      }
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Add additional aliases for critical modules if needed
      // 'crypto-js': 'crypto-js/core',
      'crypto-js': path.resolve(__dirname, 'node_modules/crypto-js')

    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
        'globalThis.process': 'undefined',
      },
      // Enable esbuild polyfill plugins
      plugins: [
       
      ]
    }
  }

})