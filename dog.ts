import { DevLog, Dog } from '@qqi/log';
import { isFalse } from 'a-type-of-js';

/**  开发环境执行，该方法在 env === 'production' 时通过 babel 和 webpack 过滤移除  */
export const dog: DevLog = new Dog({
  name: 'earthnut',
  type: false,
});

/**  正式环境  */
export const dun = isFalse(dog.type);
