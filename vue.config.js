const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin; // 打包分析
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const resolve = dir => path.join(__dirname, dir);

module.exports = {
  publicPath: "/vue/", // 基本路径
  outputDir: "dist", // 输出文件目录
  lintOnSave: true, // eslint-loader 是否在保存的时候检查
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // webpack配置
  chainWebpack: config => {
    // 别名配置
    config.resolve.alias.set("@img", resolve("./src/assets/images"));
  },
  configureWebpack: config => {
    const plugins = [];

    // Begin 生成 gzip 压缩文件
    plugins.push(
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: productionGzipExtensions,
        threshold: 10240,
        minRatio: 0.8,
        //删除原始文件只保留压缩后的文件
        deleteOriginalAssets: false
      })
    );
    // End 生成 gzip 压缩文件

    config.plugins = [...config.plugins, ...plugins];
  },
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  parallel: require("os").cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  // pwa: {}, // PWA 插件相关配置 see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  // webpack-dev-server 相关配置
  devServer: {
    open: true,
    host: "0.0.0.0", // 允许外部ip访问
    port: 8088, // 端口
    https: false, // 启用https
    overlay: {
      warnings: true,
      errors: true
    }, // 错误、警告在页面弹出
    proxy: {
      "/v1/": {
        target: "http://192.168.0.111:3000",
        changeOrigin: true, // 允许websockets跨域
        // ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    } // 代理转发配置，用于调试环境
  },
  // 第三方插件配置
  pluginOptions: {}
};
