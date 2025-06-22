import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';

/**  当页面的尺寸发生变化时  */
export function updateSize(this: Ripples) {
  if (isNull(this.renderData)) return;

  const { parentElement } = this.renderData;
  const newWidth = parentElement.offsetWidth,
    newHeight = parentElement.offsetHeight;
  if (newWidth !== this.canvas.width || newHeight !== this.canvas.height) {
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
  }
}
