import { getRandomString } from 'a-js-tools';

/**  获取随机构建的样式类  */
export function generateClass(value: string) {
  return (
    'en-' +
    value +
    '-' +
    getRandomString({
      length: 12,
      includeNumbers: true,
      includeUppercaseLetters: true,
    })
  );
}
