import { Dog } from '@qqi/log';
import { isFalse } from 'a-type-of-js';

/**  执行栈  */
export const dog = new Dog({
  name: 'earthnut',
  type: false,
});

/**  正式环境  */
export const dun = isFalse(dog.type);
