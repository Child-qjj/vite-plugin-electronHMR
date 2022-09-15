export default {
  main: {
    build: {
      reportCompressedSize: true,
      rollupOptions: {
        input: "src/electron/electron.ts",
        output: [
          {
            dir: "dist/electron",
            entryFileNames: "[name].js",
          },
        ],
      },
    },
  },
  preload: {
    build: {
      reportCompressedSize: true,
      rollupOptions: {
        input: "src/electron/preload.ts",
        output: [
          {
            dir: "dist/electron",
            entryFileNames: "[name].js",
          },
        ],
      },
    },
  },
};
