import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = import.meta.dirname;

const pathJoin = str => path.join(__dirname, str);
/**************************************
 *
 * 生产包打包为 cjs 、mjs
 *
 **************************************/
export default function ({ dev, t }) {
  /** 入口 */
  /**************************
   * 开发时
   * 不考虑按需导入分包
   **************************/
  const entry =
    dev || t === 'js'
      ? {
          index: {
            import: ['./src/root.tsx'],
            filename: 'index.js',
          },
        }
      : {
          index: {
            import: ['./index.ts'],
            filename: `index.${t}`,
          },
          BackgroundRipple: './components/ripples/index.ts',
          useRipples: './customHooks/useRipples/index.ts',
          useTimeId: './customHooks/useTimeId.ts',
          useAnimationFrame: './customHooks/useAnimationFrame.ts',
          useInputIsComposing: './customHooks/useInputIsComposing.ts',
        };

  /**************************
   * 出口
   **************************/
  const output = dev /** 测试打包 */
    ? {
        path: pathJoin('.static'),
        charset: true,
        compareBeforeEmit: true,
        clean: true,
        publicPath: '/',
      }
    : /** esm 打包 */
      t === 'mjs'
      ? {
          path: pathJoin('dist'),
          filename: `[name]/index.${t}`,
          libraryTarget: 'module',
        } /** commonJs 打包 */
      : t === 'cjs'
        ? {
            path: pathJoin('dist'),
            library: 'oops-ui',
            filename: `[name]/index.${t}`,
            libraryTarget: 'commonjs2',
          }
        : {
            path: pathJoin('dist'),
            filename: 'index.js',
            library: 'oops-ui',
            libraryTarget: 'umd',
            globalThis: 'this',
          };

  /** 模块解析方式 */
  const resolve = {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: {
      src: pathJoin('src/'), /// src  主要代码
      components: pathJoin('components/'), /// 公共组件
      customHooks: pathJoin('customHooks/'), // 公共自定义 hooks
      page: pathJoin('src/page/'), /// 页面相关
      css: pathJoin('src/css/'), /// 公共 css 相关
      // 'a-react-ripples': path.join(__dirname, 'node_modules/a-react-ripples/'),
    },
  };

  const externals = dev
    ? {}
    : {
        react: 'react',
        'react-dom': 'react-dom',
        'a-element-inline-style': 'a-element-inline-style',
      };

  /** 模块配置 */
  const module = {
    rules: [
      // 配置 ts loader
      {
        test: /\.(tsx?)|(jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      // 配置 scss
      {
        test: /\.s?css$/,
        // 加载是至下而上，也就是说 webpack 使用数组是 pop
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            // options: {
            //   modules: true,
            // },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      // 配置 文件
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name].[hash:8][ext]',
          outputPath: 'asset/images',
          publicPath: '../asset/images/',
        },
      },
    ],
  };

  /** 插件 */
  const plugins = [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    /** 调试面板页面 */
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      chunks: ['index'],
      inject: 'body',
      templateParameters: {
        title: '测试',
      },
    }),
  ];

  /** 优化配置 */
  const optimization = {
    splitChunks: {
      minSize: 50000, /// 拆分前模块的最小储存占用，大于该值才会拆分
      minChunks: 2, /// 模块被引用的最小次数
      maxAsyncRequests: 4, /// 最多同时发起 4 个异步请求来加载拆分后的 chunk
      cacheGroups: {
        /// npm 下所有模块
        defaultVendors: {
          test: /[\\/]node_modules[\\/](?!a-js-tools|pako|a-element-inline-style)/,
          name: 'commons',
          chunks: 'initial',
          priority: -10,
          // enforce: true,
        },
      },
    },
  };

  /**************************
   * 开发服务
   **************************/
  const devServer = {
    historyApiFallback: {
      enabled: true,
      // disableDotRule: true,
      // cleanUrls: false,
      rewrites: [
        { from: /.*/, to: 'index.html' },
        // {
        //   from: /^\/[^\.]+$/,
        //   to: './index.html',
        // },
      ],
      trailingSlash: false, // 禁止尾随 /
    },
    static: {
      directory: pathJoin(__dirname, 'dist'),
    },
    compress: true, // gzip 压缩
    hot: true,
    host: '0.0.0.0',
    port: 6674,
    open: true,
  };
  /**************************
   * 打包模式
   **************************/
  const mode = dev ? 'development' : 'production';

  /**************************
   *
   **************************/
  const config = {
    entry,
    output,
    resolve,
    module,
    plugins,
    optimization,
    mode,
    externals,
    devtool: 'source-map',
    devServer,
  };
  //// 生产环境
  if (!dev) {
    delete config.devServer;
    delete config.devtool;
    config.optimization = {
      usedExports: true, // 启用 tree shaking
      sideEffects: false, /// 告诉 webpack 这个库没有副作用，以便有效的 tree shaking
    };
    config.plugins.splice(
      1,
      1,
      // /// 文件复制
      new CopyPlugin({
        patterns: [
          {
            from: 'src/css/common.scss',
            to: 'styles/common.scss',
          },
        ],
      }),
    );
  }
  /**************************
   * 打包为 module 时必须设定下面的值
   **************************/
  if (t === 'mjs') config.experiments = { outputModule: true };
  return config;
}
