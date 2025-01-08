import { runOtherCode } from 'a-node-tools';

try {
  const deleteOldFile = await runOtherCode('npx ixxx rm dist *.tgz && npm run build');
  if (!deleteOldFile.success) throw new Error();
} catch (error) {
  throw error;
}

const pack = await runOtherCode('npm pack');
const pwd = await runOtherCode({ code: 'pwd', printLog: false });

if (pack.success && pwd.success) {
  const result = pwd.data.concat('/').concat(pack.data).replace(/\n/g, '');
  console.log('====================================');
  console.log(result);
  console.log('====================================');
}
