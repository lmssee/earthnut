import { readFileToJsonSync } from 'a-node-tools';

export default function (api) {
  api.cache(true);
  /**  读取本地的数据配置  */
  const env = readFileToJsonSync('./.env.config')?.env ?? 'production';
  /**  是否为生产环境  */
  const isProduction = env === 'production';

  return {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      isProduction && '@qqi/babel-plugin-remove-dog-calls',
      isProduction && ['transform-remove-console', { exclude: ['error', 'warn'] }],
    ].filter(Boolean),
  };
}
