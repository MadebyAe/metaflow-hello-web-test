import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { transform, normalizePath } from '@vanilla-extract/integration'

const styleFileFilter = /\.style\.ts(\?.*)?$/

function vanillaStylePlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'vanilla-extract-style-files',
    enforce: 'pre',
    configResolved(c) {
      config = c
    },
    async transform(code, id) {
      const [validId] = id.split('?')
      if (!styleFileFilter.test(validId)) return null

      return transform({
        source: code,
        filePath: normalizePath(validId),
        rootPath: config.root,
        packageName: 'app',
        identOption: config.mode === 'production' ? 'short' : 'debug',
      })
    },
  }
}

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
  plugins: [react(), vanillaStylePlugin(), healthEndpoint()],
  base: '/metaflow-hello-web-test/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
