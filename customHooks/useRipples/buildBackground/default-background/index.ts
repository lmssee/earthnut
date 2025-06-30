import { isNull } from 'a-type-of-js';
import { Ripples } from '../../ripplesClass';
import { runSide } from '../runSide';
import { bindImage } from '../utils/bindImage';
import { createCanvasElementBySize } from './createCanvasElementBySize';
/**
 *
 * 设置透明的纹理
 *
 *
 * 透明的纹理*默认会自动切换*
 *
 */
export function setTransparentTexture(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;
  // Reflect.apply(createImageData, this, [bindImage]);
  const { width, height } = renderData.backgroundInfo;
  const canvas = (renderData.lastDrawImage = createCanvasElementBySize(width, height));
  Reflect.apply(bindImage, this, [canvas]);

  Reflect.apply(runSide, this, []);
}
