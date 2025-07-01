import { isNull } from 'a-type-of-js';
import { createCanvasElementBySize } from '../buildBackground/default-background/createCanvasElementBySize';
import { Ripples } from '../ripplesClass';

/**  背景渐变的数据  */
export class FadeData {
  /**  背景页面的数据  */
  backgroundInfo: {
    width: number;
    height: number;
  } = {
    width: 0,
    height: 0,
  };
  /**  缺省背景图时的 id  */
  transparentId: NodeJS.Timeout = setTimeout(Boolean);
  /**  最后使用
   *
   * 如果没有 toBeList 为空值，则当前渲染的为此纹理）绘制的图像
   */
  lastDrawImage: HTMLCanvasElement | HTMLImageElement;
  /**  当前绘制的图像
   *
   * 该值仅出现在需要渐变过程中，一旦渐变完成，实际渲染的值就成了最后渲染的值
   */
  toBeList: (HTMLCanvasElement | HTMLImageElement)[] = [];
  /**  绘制进度  */
  drawProgress: number = 0;
  /**  是否处于绘制过渡状态  */
  isTransitioning: boolean = false;

  /**  执行渐变  */
  run() {
    //如果当前正处于渐变过程，直接退出，让渐变自己处理当前的状态
    if (this.isTransitioning) return;
    this.drawProgress = 0;
    this.isTransitioning = true;
  }
  /**  创建背景渐变的数据  */
  constructor(_Ripples: Ripples) {
    const { renderData } = _Ripples;
    let width: number, height: number;
    if (isNull(renderData)) {
      width = 10;
      height = 10;
    } else {
      // 获取边界尺寸并保存，防止后续步骤多次重复获取该数据并解析
      const styles = getComputedStyle(renderData.parentElement);
      width = parseInt(styles.width);
      height = parseInt(styles.height);
    }
    this.backgroundInfo = {
      width,
      height,
    };
    this.lastDrawImage = createCanvasElementBySize(width, height);
  }
}
