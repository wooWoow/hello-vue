const path = require("path");
const MonacoEditorWebpackPlugin = require("monaco-editor-webpack-plugin");
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const resolve = dir => path.join(__dirname, dir);

module.exports = {
  publicPath: "/vue/", // 基本路径
  outputDir: "dist", // 输出文件目录
  lintOnSave: false, // 临时禁用eslint-loader在保存时检查
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // webpack配置
  chainWebpack: config => {
    // 别名配置
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("@img", resolve("./src/assets/images"));
    
    // 生产环境gzip压缩
    if (IS_PROD) {
      config.plugin('compression-webpack-plugin')
        .use(new CompressionWebpackPlugin({
          test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
          threshold: 10240,
          minRatio: 0.8
        }));
    }
  },
  configureWebpack: config => {
    const plugins = [];

    // monacoEditor配置
    plugins.push(new MonacoEditorWebpackPlugin());

    config.plugins = [...config.plugins, ...plugins];
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass-embedded')
      }
    }
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
    client: {
      overlay: {
        warnings: true,
        errors: true
      }
    }, // 错误、警告在页面弹出
    proxy: {
      "/v1/": {
        // target: "http://192.168.50.181:3000",
        target: "http://localhost:3000",
        changeOrigin: true, // 允许websockets跨域
        // ws: true
      },
      "/upload/": {
        // target: "http://192.168.50.181:3000",
        target: "http://localhost:3000",
        changeOrigin: true, // 允许websockets跨域
        // ws: true
      }
    } // 代理转发配置，用于调试环境
  },
  // 第三方插件配置
  pluginOptions: {}
};
