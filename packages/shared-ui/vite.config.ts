import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "SharedUI",
      formats: ["es"],
      fileName: (format) => `${format}/index.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@intelli-meeting/store", "@intelli-meeting/design-system"],
    },

  },
  plugins: [
    eslintPlugin(),
    tailwindcss(),
    react(),
    dts({
      tsconfigPath: path.resolve(__dirname, "tsconfig.build.json"),
      insertTypesEntry: true,
      outDir: path.resolve(__dirname, "dist"),
    }),
  ],
});
