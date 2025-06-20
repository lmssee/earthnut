export default {
  env: {
    browser: true,
    es2021: true,
    // jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // react 推荐规则
    'plugin:react-hooks/recommended', // react hooks 规则
    'plugin:@typescript-eslint/recommended', // Typescript 支持
    'prettier', // 禁用其他格式化工具的冲突规则
  ],
  parser: '@typescript-eslint/parser', // ts 解析
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest'.at,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // 自定义规则
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要引入 React
    'react/prop-types': 'off', // 使用 TypeScript 时不需要 propTypes
    'no-console': ['warn'], // 控制台输出警告
    'no-debugger': 'error', // 不允许 debugger
    '@typescript-eslint/no-explicit-any': 'warn', //
    'prefer-const': 'error',
  },
  settings: {
    react: {
      version: 'detect', // 自动检测 react 的版本
    },
  },
};
