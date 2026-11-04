import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  test: {
    setupFiles: ['./src/tests/vitest.setup.ts'],
    environment: 'jsdom',
    alias: {
          "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
  },
})