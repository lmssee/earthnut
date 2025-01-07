/**************************
 * 创建一个隐含像素数据的区域
 **************************/
export function createImageData(width: number, height: number) {
  try {
    return new ImageData(width, height);
  } catch (e) {
    console.log(e && '');
    // Fallback for IE
    return document
      .createElement('canvas')
      .getContext('2d')!
      .createImageData(width, height);
  }
}
