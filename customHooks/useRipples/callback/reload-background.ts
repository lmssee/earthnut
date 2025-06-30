import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { loadImage } from '../buildBackground/loadImage';

/**
 * 重新加载背景图片
 *
 */
export function reloadBackground(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;
  const { parentElement, backgroundInfo } = renderData;
  const width = parentElement.offsetWidth,
    height = parentElement.offsetHeight;
  this.canvas.width = backgroundInfo.width = width;
  this.canvas.height = backgroundInfo.height = height;
  {
    // 这个步骤进行的是无设置背景图或者是父元素无背景样式时产生的切换效果
    // 绘制重置
    renderData.lastDrawImage = null;
    renderData.currentDrawImage = null;
    clearTimeout(renderData.transparentId);
    renderData.isTransitioning = false;
    renderData.drawProgress = 0;
  }
  Reflect.apply(loadImage, this, []);
}
