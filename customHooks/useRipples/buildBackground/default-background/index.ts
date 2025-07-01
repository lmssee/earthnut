import { Ripples } from '../../ripplesClass';
import { createCanvasElementBySize } from './createCanvasElementBySize';
import { circleDataList } from './circleDataList';
/**
 *
 * 设置透明的纹理
 *
 *
 * 透明的纹理*默认会自动切换*
 *
 */
export function setTransparentTexture(this: Ripples) {
  const { fadeData } = this;

  const { width, height } = fadeData.backgroundInfo;
  circleDataList.build(); // 构建新的执行图（很重要）
  //   当前渲染的纹理（下一个）
  fadeData.toBeList.push(createCanvasElementBySize(width, height));
  fadeData.run(); // 开启渐变
}
