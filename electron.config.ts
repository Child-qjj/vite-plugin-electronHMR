export default {
  main: {
    build: {
      reportCompressedSize: true,
      lib: {
        entry: "src/electron/electron.ts",
        formats: ["cjs"], //It's must be commonJS packages in electron now
        fileName: () => "[name].js",
      },
    },
  },
  preload: {
    build: {
      reportCompressedSize: true,
      lib: {
        entry: "src/electron/preload.ts",
        formats: ["cjs"], //It's must be commonJS packages in electron now
        fileName: () => "[name].js",
      },
    },
  },
};
