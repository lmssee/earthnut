import { pathJoin, readFileToJsonSync, getDirectoryBy, writeJsonFile } from 'a-node-tools';

let packageJson = readFileToJsonSync('./package.json');

['scripts', 'devDependencies', 'lint-staged', 'private'].forEach(key => delete packageJson[key]);

packageJson = {
  main: 'index.cjs',
  module: 'index.mjs',
  types: 'index.d.ts',
  author: {
    name: '🥜',
    email: 'earthnut.dev@outlook.com',
    url: 'https://earthnut.dev',
  },
  ...packageJson,
  files: [
    'BackgroundRipple',
    'components',
    'customHooks',
    'Layout',
    'styles',
    'useAnimationFrame',
    'useInputIsComposing',
    'useRipples',
    'useTimeId',
    'index.cjs',
    'index.cjs.map',
    'dog.d.ts',
    'index.d.ts',
    'index.js.LICENSE.txt',
    'index.mjs',
  ],
  exports: {
    '.': {
      types: './index.d.ts',
      require: './index.cjs',
      import: './index.mjs',
    },
    './BackgroundRipple': {
      types: './components/ripples/index.d.ts',
      require: './BackgroundRipple/index.cjs',
      import: './BackgroundRipple/index.mjs',
    },
    './useTimeId': {
      types: './customHooks/useTimeId.d.ts',
      require: './useTimeId/index.cjs',
      import: './useTimeId/index.mjs',
    },
    './useAnimationFrame': {
      types: './customHooks/useAnimationFrame.d.ts',
      require: './useAnimationFrame/index.cjs',
      import: './useAnimationFrame/index.mjs',
    },
    './useRipples': {
      types: './customHooks/useRipples/index.d.ts',
      require: './useRipples/index.cjs',
      import: './useRipples/index.mjs',
    },
    './useInputIsComposing': {
      types: './customHooks/useInputIsComposing.d.ts',
      require: './useInputIsComposing/index.cjs',
      import: './useInputIsComposing/index.mjs',
    },
    './layout': {
      types: './components/layout/index.d.ts',
      require: './Layout/index.cjs',
      import: './Layout/index.mjs',
    },
    './scss': './styles/common.scss',
    './css': './styles/common.css',
  },
  keywords: ['earthnut'],
  homepage: 'https://earthnut.dev/',
  bugs: {
    url: 'https://github.com/earthnutDev/earthnut/issues',
    email: 'earthnut.dev@outlook.com',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/earthnutDev/earthnut.git',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  license: 'MIT',
  peerDependencies: {
    react: '>= 17',
    'react-dom': '>= 17',
  },
};
{
  const distPath = getDirectoryBy('dist', 'directory');

  const distPackagePath = pathJoin(distPath, './dist/package.json');

  writeJsonFile(distPackagePath, packageJson);
}
