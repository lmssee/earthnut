import { isWindows, pathJoin, runOtherCode } from 'a-node-tools';

try {
  const deleteOldFile = await runOtherCode('npx ixxx rm dist *.tgz && npm run build');
  if (!deleteOldFile.success) throw new Error();
} catch (error) {
  throw error;
}

const pack = await runOtherCode('npm pack');
const pwd = await runOtherCode({ code: isWindows ? 'echo %cd%' : 'pwd', printLog: false });
const noLineBreak = str => str.replace(/\r?\n/g, '');
if (pack.success && pwd.success) {
  const result = pathJoin(noLineBreak(pwd.data), noLineBreak(pack.data));
  console.log('====================================');
  console.log(result);
}
