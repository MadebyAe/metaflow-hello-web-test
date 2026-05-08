import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import type { Plugin } from 'vite'

function healthEndpoint(): Plugin {
  return {
    name: 'health-endpoint',
    configureServer(server) {
      server.middlewares.use('/health', (_req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('OK')
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin({
      include: [/\.css\.ts$/, /\.style\.ts$/],
    }),
    healthEndpoint(),
  ],
  base: '/metaflow-hello-web-test/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})