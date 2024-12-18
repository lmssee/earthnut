import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = import.meta.dirname;

const pathJoin = str => path.join(__dirname, str);

export default function ({ dev, t }) {
  console.log(dev, t);

  /** 入口 */
  const entry = (dev && {
    index: {
      import: ['./src/root.tsx'],
      filename: 'index.js',
    },
  }) || {
    index: {
      import: ['./components/index.ts'],
      filename: `index.${t}.js`,
    },
  };

  /** 出口 */
  const output = (dev && {
    path: pathJoin('.static'),
    charset: true,
    compareBeforeEmit: true,
    clean: true,
  }) ||
    (t === 'ems' && {
      path: pathJoin('dist'),
      libraryTarget: 'module',
    }) || {
      path: pathJoin('dist'),
      library: 'reactRipples',
      libraryTarget: 'commonjs2',
    };

  /** 模块解析方式 */
  const resolve = {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: {
      src: pathJoin('src/'), /// src  主要代码
      components: pathJoin('components/'), /// 公共组件
      page: pathJoin('src/page/'), /// 页面相关
      css: pathJoin('src/css/'), /// 公共 css 相关
      // 'a-react-ripples': path.join(__dirname, 'node_modules/a-react-ripples/'),
    },
  };

  const externals = (dev && {}) || {
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
    // /// 文件复制
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: 'manifest.json',
    //       to: 'manifest.json',
    //     }, ///
    //     { from: 'src/icons', to: 'icons' }, /// 图标
    //     { from: 'src/_locales', to: '_locales' }, /// 多语言配置文件
    //   ],
    // }),
  ];

  /** 优化配置 */
  const optimization = {
    // mangleExports: 'size',
    // mangleWasmImports: false,
    // runtimeChunk: 'single',
    splitChunks: {
      chunks: chunk => {
        if (chunk.name === 'background') {
          return false;
        }
        return true;
      }, /// 对所有类型的 chunk 进行拆分（包括同步和异步）
      minSize: 50000, /// 拆分前模块的最小储存占用，大于该值才会拆分
      minChunks: 2, /// 模块被引用的最小次数
      maxAsyncRequests: 4, /// 最多同时发起 4 个异步请求来加载拆分后的 chunk
      cacheGroups: {
        popup: {
          test: /[\\/]src[\\/]popup[\\/]/,
          filename: 'popup/[contenthash].js',
          // name: 'main-common',
          chunks: 'all',
          // minSize: 0,
          // priority: 10,
          enforce: true, // 强制应用这个规则
        },
        /// npm 下所有模块
        defaultVendors: {
          test: /[\\/]node_modules[\\/](?!a-js-tools|pako|a-element-inline-style)/,
          name: 'commons',
          chunks: 'initial',
          priority: -10,
          // enforce: true,
        },
        //
        // background: {
        //   test: /[\\/]src[\\/]background[\\/]/,
        //   name: 'background',
        //   chunks: 'async',
        //   enforce: true,
        //   minSize: 0, /// 设置为 0 就不会出现分包 （腾讯元宝说的）
        //   priority: 1000,
        // },
        // aJsTools: {
        //   test: /[\\/]node_modules[\\/]a-js-tools[\\/]/,
        //   name: 'a-js-tools',
        //   chunks: 'async',
        //   enforce: true, // 不强制应用这个规则，允许其他规则覆盖
        //   minSize: 0, // 设置 minSize 为 0，以确保 a-js-tools 包不会被拆分
        //   maxSize: 0, // 设置 maxSize 为 0，以确保 a-js-tools 包不会因为超过最大大小而被拆分
        // },
        // default: {
        //   minChunks: 2,
        //   priority: -20,
        //   reuseExistingChunk: true,
        // },
      },
    },
  };

  /**************************
   * 开发服务
   **************************/
  const devServer = {
    static: './dist',
    hot: true,
    host: '0.0.0.0',
    port: 8863,
    open: true,
  };
  /**************************
   * 打包模式
   **************************/
  const mode = (dev && 'development') || 'production';

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
    delete config.optimization;
    config.plugins.splice(1, 1);
    delete config.devtool;
  }
  /**************************
   * 打包为 module 时必须设定下面的值
   **************************/
  if (t === 'ems') config.experiments = { outputModule: true };
  return config;
}
