import defaultModule, { pathJoin } from './webpack.config.cjs.js';
/**************************
 * 打包为 mjs 模式
 **************************/
export default function () {
  const config = {
    ...defaultModule(),

    output: {
      path: pathJoin('dist'),
      filename: `[name]/index.mjs`,
      libraryTarget: 'module',
    },
    entry: {
      ...defaultModule.entry,
      index: {
        import: ['./index.ts'],
        filename: `index.mjs`,
      },
    },
  };

  /**************************
   * 打包为 module 时必须设定下面的值
   **************************/
  config.experiments = { outputModule: true };

  return config;
}
