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
  files: ['components', 'customHooks', 'index.cjs', 'index.mjs', 'index.d.ts', 'styles'],
  exports: {
    '.': {
      types: './index.d.ts',
      require: './index.cjs',
      import: './index.mjs',
    },
    './scss': './styles/common.scss',
    './css': './styles/common.css',
  },
  keywords: ['earthnut'],
  homepage: 'https://earthnut.dev/quickUse',
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
  const distPath = getDirectoryBy('src', 'directory');

  const distPackagePath = pathJoin(distPath, './dist/package.json');

  writeJsonFile(distPackagePath, packageJson);
}
