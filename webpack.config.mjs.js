import defaultModule, { pathJoin } from './webpack.config.cjs.js';
import webpack from 'webpack';

class AddUserClientPlugin {
  apply(compiler) {
    // 在 compilation 阶段添加插件
    compiler.hooks.thisCompilation.tap('AddUserClientPlugin', compilation => {
      // 在 processAssets 阶段添加插件
      compilation.hooks.processAssets.tap(
        {
          name: 'AddUserClientPlugin',
          // 指定插件的执行阶段
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        assets => {
          // 遍历所有资源
          for (const filename in assets) {
            console.log('====================================');
            console.log(filename);
            console.log('====================================');
            // 如果文件名以 .mjs 结尾
            if (filename.endsWith('.mjs')) {
              // 获取原始资源
              const source = assets[filename].source();
              // 在原始资源的开头添加 'use client;'
              const newSource = '"use client";\n'.concat(source);
              console.log('====================================');
              console.log(123456);
              console.log('====================================');
              // 替换原始资源
              compilation.updateAsset(filename, new webpack.sources.RawSource(newSource));
            }
          }
        },
      );
    });
  }
}
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
    optimization: {
      ...defaultConfig.optimization,
      minimize: true, // 生产模式默认为 true
      usedExports: true, // 启用 tree shaking
      sideEffects: true, /// 告诉 webpack 这个库没有副作用，以便有效的 tree shaking
    },
    //
    // externalsType: 'module',
    // 实验配置
    experiments: {
      outputModule: true,
    },
    plugins: [new AddUserClientPlugin(), ...defaultConfig.plugins],
  };
}
