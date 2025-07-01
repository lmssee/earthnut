import { isEmptyArray, isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { bindImage } from '../buildBackground/utils/bindImage';
import { runSide } from '../buildBackground/runSide';
import { dog } from 'dog';

/**  两个图像间的淡入淡出  */
export function fade(this: Ripples) {
  dog.type = false;
  const { renderData, fadeData } = this;
  const { toBeList, drawProgress, lastDrawImage, backgroundInfo } = fadeData;
  if (isNull(renderData)) return;
  if (isEmptyArray(toBeList)) {
    dog.error('由于缺少当前渲染的背景，退出');
    return;
  }

  // 进度完成则结束当前的进度
  if (fadeData.drawProgress > 1000) {
    // 临时关闭当前的状体
    fadeData.isTransitioning = false;
    // 最后使用的纹理
    fadeData.lastDrawImage = toBeList.shift()!;
    // 渲染到背景图
    Reflect.apply(bindImage, this, [fadeData.lastDrawImage]);
    if (!isEmptyArray(toBeList)) {
      // 启用下一轮的循环
      Reflect.apply(runSide, this, []);
    }
    return;
  }
  fadeData.drawProgress += 18;
  dog('当前的渲染进度', fadeData.drawProgress, fadeData.lastDrawImage);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (isNull(ctx) || isNull(lastDrawImage) || isEmptyArray(toBeList)) {
    dog.error('渲染出现意外，该有的值不存在导致 bug');
    return;
  }
  const { width, height } = backgroundInfo;
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  // ctx.globalCompositeOperation = 'destination-over';
  {
    // ctx.globalAlpha = 1 - drawProgress;
    ctx.drawImage(lastDrawImage, 0, 0, width, height);
    ctx.globalAlpha = drawProgress / 1000;
    ctx.drawImage(toBeList[0], 0, 0, width, height);
  }

  ctx.globalAlpha = 1;
  // 渲染渐变过程中的纹理
  Reflect.apply(bindImage, this, [canvas]);
  dog.type = true;
}
