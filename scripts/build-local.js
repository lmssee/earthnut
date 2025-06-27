import { _p, isWindows, pathJoin, runOtherCode } from 'a-node-tools';
import { copyTextToClipboard } from '@qqi/copy-text';
import { brightBlackPen, randomPen } from 'color-pen';

await runOtherCode('npx jja clear');

try {
  const deleteOldFile = await runOtherCode('npx jja rm dist *.tgz && npm run build');
  if (!deleteOldFile.success) throw new Error();
} catch (error) {
  throw error;
}

const pack = await runOtherCode('cd dist && npm pack');
const pwd = await runOtherCode({ code: isWindows ? 'echo %cd%' : 'pwd', printLog: false });
const noLineBreak = str => str.replace(/\r?\n/g, '');
if (pack.success && pwd.success) {
  const result = pathJoin(noLineBreak(pwd.data), 'dist', noLineBreak(pack.data));
  _p(randomPen('npm install '), false);
  _p(randomPen(result));
  copyTextToClipboard(`npm install ${result}`);
  console.log(brightBlackPen('已复制到剪切板'));
}
