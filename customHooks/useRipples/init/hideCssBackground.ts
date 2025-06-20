import { ripplesRenderDataWarehouse } from '../rippersData/renderData';
import { Ripples } from '../ripplesClass';

/**
 * 隐藏背景
 */
export function hideCssBackground(this: Ripples) {
  const { parentElement } = ripplesRenderDataWarehouse[this.sole] || {};
  if (!parentElement) return;
  // 检测是否更改了行内样式或是重写了该样式
  const inlineCss = parentElement.style.backgroundImage;
  if (inlineCss == 'none') return;
  const renderData = ripplesRenderDataWarehouse[this.sole];
  renderData.originalInlineCss = inlineCss;
  renderData.originalCssBackgroundImage = window.getComputedStyle(parentElement).backgroundImage;
  parentElement.style.backgroundImage = 'none';
}

/**
 * 恢复背景样式
 */
export function restoreCssBackground(this: Ripples) {
  const { parentElement, originalInlineCss } = ripplesRenderDataWarehouse[this.sole];
  parentElement.style.backgroundImage = originalInlineCss || '';
}
