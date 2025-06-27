import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { loadImage } from '../init/loadImage';

/**  当页面的尺寸发生变化时  */
export function updateSize(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;
  const { parentElement } = renderData;
  const width = parentElement.offsetWidth,
    height = parentElement.offsetHeight;
  this.canvas.width = width;
  this.canvas.height = height;
  {
    // 绘制重置
    renderData.lastDrawImage = null;
    renderData.currentDrawImage = null;
    clearTimeout(renderData.transparentId);
    renderData.isTransitioning = false;
    renderData.drawProgress = 0;
  }
  Reflect.apply(loadImage, this, []);
}
