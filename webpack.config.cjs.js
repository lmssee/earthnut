import defaultModule, { pathJoin } from './webpack.config.js';
import CopyPlugin from 'copy-webpack-plugin';

export { pathJoin };

/**************************
 * 打包为 mjs 模式
 **************************/
export default function () {
  const config = {
    ...defaultModule(),
    entry: {
      index: {
        import: ['./index.ts'],
        filename: `index.cjs`,
      },
      BackgroundRipple: './components/ripples/index.ts',
      useRipples: './customHooks/useRipples/index.ts',
      useTimeId: './customHooks/useTimeId.ts',
      useAnimationFrame: './customHooks/useAnimationFrame.ts',
      useInputIsComposing: './customHooks/useInputIsComposing.ts',
    },
    output: {
      path: pathJoin('dist'),
      library: 'oops-ui',
      filename: `[name]/index.cjs`,
      libraryTarget: 'commonjs2',
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      'a-element-inline-style': 'a-element-inline-style',
    },
    mode: 'production',
    optimization: {
      usedExports: true, // 启用 tree shaking
      sideEffects: false, /// 告诉 webpack 这个库没有副作用，以便有效的 tree shaking
    },
  };

  delete config.devServer;
  delete config.devtool;
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

  return config;
}
