/** @type {import('@remix-run/dev').AppConfig} */
export default {
  
    cacheDirectory: "./node_modules/.cache/remix",
    ignoredRouteFiles: [".*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],

  browserNodeBuiltinsPolyfill:{
    modules:{
      crypto: true,
      buffer: true,
      stream: true,
      util: true
    }
  },
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildPath: "build/index.js",
};
