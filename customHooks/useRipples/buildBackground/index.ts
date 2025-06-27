import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { dog } from 'dog';
import { createCanvasElement } from './createCanvasElement';
import { getImageSrcBySize } from './getImageSrcBySize';

/**
 * 创建一个隐含像素数据的区域
 */
export function createImageData(this: Ripples, bindImage: () => void) {
  const { renderData } = this;

  if (isNull(renderData)) {
    dog.warn('执行时未获取到尺寸');
    return new ImageData(10, 10);
  }

  const { backgroundInfo } = renderData;
  const { width, height } = backgroundInfo;
  // /**  是透明的背景  */
  // const isTransparent = [
  //   '#0000',
  //   'rgba(0,0,0,0)',
  //   'transparent',
  //   'none',
  //   '',
  //   'unset',
  //   'inherit',
  //   'initial',
  // ].some(e => lastUseStyle.backgroundColor.replace(/\s*/g, '') === e);
  // /** 是否没有背景图   */
  // const isNotBackgroundImage =
  //   isBusinessEmptyString(lastUseStyle.backgroundImage) || lastUseStyle.backgroundImage === 'none';

  const image = new Image(width, height);
  image.width = width;
  image.height = height;

  image.src = getImageSrcBySize(width, height);
  image.onload = () => {
    renderData.lastDrawImage = Reflect.apply(createCanvasElement, this, [image]);

    Reflect.apply(bindImage, this, [image]);
  };
}
