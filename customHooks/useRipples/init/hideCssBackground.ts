import { Ripples } from '../ripplesClass';
import { isNull } from 'a-type-of-js';

/**
 * 隐藏背景
 */
export function hideCssBackground(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;

  const { parentElement } = renderData;
  if (!parentElement) return;

  // 检测是否更改了行内样式或是重写了该样式
  const inlineCss = parentElement.style.backgroundImage;
  if (inlineCss === 'none') return;

  renderData.originalInlineCss = inlineCss;
  renderData.originalCssBackgroundImage = window.getComputedStyle(parentElement).backgroundImage;
  parentElement.style.backgroundImage = 'none';
}
