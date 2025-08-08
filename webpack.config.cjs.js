import TerserPlugin from 'terser-webpack-plugin';
import defaultModule, { pathJoin } from './webpack.config.js';
import CopyPlugin from 'copy-webpack-plugin';
import AddUserClientPlugin from './scripts/add-use-client-webpack-plugin.js';
export { pathJoin };

/**
 * 打包为 mjs 模式
 */
export default function () {
  const config = {
    ...defaultModule(),
    entry: {
      index: {
        import: ['./index.ts'],
        filename: `index.cjs`,
      },
      BackgroundRipple: './components/ripples/index.ts',
      LazyBackgroundRipple: './components/ripples/LazyRippleEle.tsx',
      Layout: './components/layout/index.ts',
      useRipples: './customHooks/useRipples/index.ts',
      useLazyRipples: './customHooks/useRipples/use-lazy-ripple.ts',
      useTimeId: './customHooks/useTimeId.ts',
      useAnimationFrame: './customHooks/useAnimationFrame.ts',
      useInputIsComposing: './customHooks/useInputIsComposing.ts',
    },
    output: {
      path: pathJoin('dist'),
      library: 'earthnut',
      filename: `[name]/index.cjs`,
      libraryTarget: 'commonjs2',
    },
    // 排除 react 等依赖包
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      'a-element-inline-style': 'a-element-inline-style',
      xcn: 'xcn',
      'a-js-tools': 'a-js-tools',
      'a-type-of-js': 'a-type-of-js',
    },
    // 打包模式
    mode: 'production',
    // 配置 source-map 可用
    devtool: false,
    // 打包配置
    optimization: {
      // 代码压缩
      // 生产模式默认为 true
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              directives: false, // 禁止删除顶级指令
            },
            format: {
              comments: false,
            },
            mangle: true,
          },
          extractComments: false,
        }),
      ],
      usedExports: true, // 启用 tree shaking
      sideEffects: true, /// 告诉 webpack 这个库没有副作用，以便有效的 tree shaking
    },
  };

  delete config.devServer;
  config.plugins.splice(
    1,
    // 移除测试用的 html 插件
    1,
    // /// 文件复制
    new CopyPlugin({
      patterns: [
        {
          from: 'src/css/common.scss',
          to: 'styles/common.scss',
        },
        {
          from: 'README.md',
          to: 'README.md',
        },
        {
          from: 'LICENSE',
          to: '',
        },
      ],
    }),
    new AddUserClientPlugin(),
  );

  /**  在正式环境添加自定义的 dog 进行不执行打印  */
  config.resolve.alias['@qqi/log'] = pathJoin('./mocks/log.ts');

  return config;
}
