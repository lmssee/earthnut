import { isNull } from 'a-type-of-js';
import { Ripples } from '../../ripplesClass';
import { createImageData } from '../createImageData';
import { runSide } from '../runSide';
import { bindImage } from '../bindImage';
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
  Reflect.apply(createImageData, this, [bindImage]);

  Reflect.apply(runSide, this, []);
}
