import defaultModule, { pathJoin } from './webpack.config.cjs.js';

/**
 * 打包为 mjs 模式
 */
export default function () {
  const defaultConfig = defaultModule();

  return {
    ...defaultConfig,
    // 入口
    entry: {
      ...defaultConfig.entry,
      index: {
        import: ['./index.ts'],
        filename: `index.mjs`,
      },
    },
    // 输出
    output: {
      path: pathJoin('dist'),
      filename: `[name]/index.mjs`,
      // 库 模式
      library: {
        type: 'module',
      },
      // chunkFormat: 'module',
      // environment: {
      //   module: true,
      // },
      // libraryTarget: 'module',
    },
    // 打包配自
    // optimization: {
    //   ...defaultConfig.optimization,
    //   minimize: true, // 生产模式默认为 true
    //   usedExports: true, // 启用 tree shaking
    //   sideEffects: true, /// 告诉 webpack 这个库没有副作用，以便有效的 tree shaking
    // },
    //
    // externalsType: 'module',
    // 实验配置
    experiments: {
      outputModule: true,
    },
  };
}
