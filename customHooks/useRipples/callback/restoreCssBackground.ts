import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';

/**
 * 恢复背景样式
 */
export function restoreCssBackground(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;

  const { parentElement, originalInlineCss } = renderData;
  parentElement.style.backgroundImage = originalInlineCss || '';
}
