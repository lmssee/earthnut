import { _p, Color, isWindows, pathJoin, runOtherCode } from 'a-node-tools';
import { copyText } from '@qqi/copy-text';

await runOtherCode('npx jja clear');

try {
  const deleteOldFile = await runOtherCode('npx jja rm dist *.tgz && npm run build');
  if (!deleteOldFile.success) throw new Error();
} catch (error) {
  throw error;
}

const pack = await runOtherCode('npm pack');
const pwd = await runOtherCode({ code: isWindows ? 'echo %cd%' : 'pwd', printLog: false });
const noLineBreak = str => str.replace(/\r?\n/g, '');
if (pack.success && pwd.success) {
  const result = pathJoin(noLineBreak(pwd.data), noLineBreak(pack.data));
  console.log('\n\n');
  _p(Color.random('npm install '), false);
  _p(Color.random(result));
  copyText(`npm install ${result}`);
  console.log('\n\n');
  console.log(Color.random('已复制到剪切板'));
}
