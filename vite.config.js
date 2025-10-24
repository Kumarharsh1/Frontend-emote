import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      input: resolve(__dirname, "index.html")
    }
  }
})
