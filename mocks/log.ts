/**  模拟类，用于打包用  */
export class Dog {
  /**  模拟类的构建  */
  constructor() {
    const _dev = () => {};

    Object.setPrototypeOf(_dev, this);

    Object.defineProperties(_dev, {
      info: { value: () => {}, configurable: false, writable: false },
      warn: { value: () => {}, configurable: false, writable: false },
      error: { value: () => {}, configurable: false, writable: false },
      type: {
        value: false,
        configurable: false,
        writable: false,
      },
    });

    return _dev as unknown as Dog;
  }
  clear() {}
}
