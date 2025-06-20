import { ripplesRenderDataWarehouse } from '../rippersData/renderData';
import { Ripples } from '../ripplesClass';

/**
 *
 * 触发的点
 *
 */
export function dropAtPointer(
  this: Ripples,
  pointer: MouseEvent | Touch,
  radius: number,
  strength: number,
) {
  const { parentElement } = ripplesRenderDataWarehouse[this.sole];
  const style = window.getComputedStyle(parentElement);
  const borderLeft = parseInt(style.borderLeftWidth) || 0,
    borderTop = parseInt(style.borderTopWidth) || 0;
  /**
   *
   * pointer.pageX 点击事件触发的位置相对于页面来说的，包含滚动的距离
   * this.#parentElement.offsetLeft 父元素左上角相对于定位元素的左边界偏移像素值
   * borderLeft 边框的宽度
   */
  const parentPosition = parentElement.getBoundingClientRect();
  const dropX = pointer.clientX - parentPosition.left - borderLeft;
  const dropY = pointer.clientY - parentPosition.top - borderTop;
  this.drop(dropX, dropY, radius, strength);
}
