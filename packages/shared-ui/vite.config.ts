import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "SharedUI",
      formats: ["es", "cjs"],
      fileName: (format) => `${format}/index.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    dts({
      tsconfigPath: path.resolve(__dirname, "tsconfig.build.json"),
      insertTypesEntry: true,
      outDir: path.resolve(__dirname, "dist"),
    }),
  ],
});
