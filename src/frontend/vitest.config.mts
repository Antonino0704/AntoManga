import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    setupFiles: ['./src/tests/vitest.setup.ts'],
    environment: 'jsdom'
  },
   resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})