import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { dog } from 'dog';
import { bindImage } from '../render/bindImage';
import { circleDataList } from './circleDataList';
import { createImageBySrc } from './createImageBySrc';
import { createCanvasElement } from './createCanvasElement';
import { getImageSrcBySize } from './getImageSrcBySize';

/**  设置缓变  */
export function runSide(this: Ripples) {
  const { renderData, options } = this;
  if (isNull(renderData)) return;
  renderData.transparentId = setTimeout(
    () => {
      Reflect.apply(buildFade, this, [bindImage]);
      dog('开始渐变');
    }, // 触发渐变
    options.raindropsTimeInterval,
  );
}

/**  构建缓入缓出  */
function buildFade(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;
  clearTimeout(renderData.transparentId); // 清理栈中未执行的同类型调用，防止多次触发
  // 当前上一次为执行完毕放弃本次子执行，创建下一次执行
  if (renderData.isTransitioning) return Reflect.apply(runSide, this, []);
  circleDataList.build(); // 构建新的执行图
  const { width, height } = renderData.backgroundInfo;

  const img = createImageBySrc(getImageSrcBySize(width, height), width, height);
  img.onload = () => {
    // 新构建的数据
    renderData.currentDrawImage = Reflect.apply(createCanvasElement, this, [img]);
    // 设置进度
    renderData.drawProgress = 0;
    // 开始执行变化
    renderData.isTransitioning = true;
  };
}
