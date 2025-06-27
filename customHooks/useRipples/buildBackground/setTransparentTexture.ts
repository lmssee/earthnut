import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { createImageData } from '.';
import { runSide } from './runSide';
import { bindImage } from '../render/bindImage';
/**
 *
 * 设置透明的纹理
 *
 */


export function setTransparentTexture(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;
  Reflect.apply(createImageData, this, [bindImage]);

  Reflect.apply(runSide, this, []);
}
