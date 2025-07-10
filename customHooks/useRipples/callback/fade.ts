import { isEmptyArray, isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { bindImage } from '../buildBackground/utils/bindImage';
import { runSide } from '../buildBackground/runSide';
import { dog } from 'dog';
import { isNoneBackGroundColor, isNoneBackgroundImage } from '../tools';
import { setTransparentTexture } from '../buildBackground/default-background';
import { DrawImage } from '../rippersData/fadeData';

/**  两个图像间的淡入淡出  */
export function fade(this: Ripples) {
  dog.type = true;
  const { renderData, fadeData, options } = this;
  const { toBeList } = fadeData;

  if (isNull(renderData)) {
    fadeData.isTransitioning = false;
    dog.warn('还没有准备好，即将退出');
    Reflect.apply(runSide, this, []);
    return;
  }
  if (isEmptyArray(toBeList)) {
    fadeData.isTransitioning = false;
    dog.error('由于缺少当前渲染的背景，退出');
    Reflect.apply(runSide, this, []);
    return;
  }
  if (fadeData.drawProgress === 0) {
    dog('开始执行渐变，当前尚有可执行', toBeList.length);
    toBeList.forEach(e => dog(e));
  }
  // 进度完成则结束当前的进度
  if (fadeData.drawProgress > 1000) {
    // 临时关闭当前的状体
    fadeData.isTransitioning = false;
    // 最后使用的纹理
    fadeData.lastDrawImage = toBeList.shift()!;
    dog('执行渐变背景完毕，剩余可执行', toBeList);
    // 渲染到背景图
    // error 此处在原来使用了 laseDrawImage 忽略了
    Reflect.apply(bindImage, this, [fadeData.lastDrawImage]);
    // 尚有未执行完毕的
    if (isEmptyArray(toBeList)) {
      const { lastUseStyle } = renderData;
      // 没有设置背景色或是背景图
      if (
        isNull(options.imgUrl) &&
        isNoneBackGroundColor(lastUseStyle.backgroundColor) &&
        isNoneBackgroundImage(lastUseStyle.backgroundImage)
      ) {
        // 因为此时渲染为空，需要手动添加一个默认渲染
        Reflect.apply(setTransparentTexture, this, [false]);
        Reflect.apply(runSide, this, []);
      }
    } else
      // 启用下一轮的循环
      Reflect.apply(runSide, this, []);
    return;
  }
  const { lastDrawImage, backgroundInfo } = fadeData;

  fadeData.drawProgress += 18;
  // dog('当前的渲染进度', fadeData.drawProgress, fadeData.lastDrawImage);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (isNull(ctx) || isNull(lastDrawImage.resource) || isEmptyArray(toBeList)) {
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
    ctx.drawImage(lastDrawImage.resource, 0, 0, width, height);
    ctx.globalAlpha = fadeData.drawProgress / 1000;
    ctx.drawImage(toBeList[0].resource, 0, 0, width, height);
  }

  ctx.globalAlpha = 1;
  /**  当前渲染项  */
  const currentDrawImage: DrawImage = {
    resource: canvas,
    width,
    height,
    kind: 'mix',
    tag: `${lastDrawImage.tag} >> ${toBeList[0].tag}`,
  };
  // 渲染渐变过程中的纹理
  Reflect.apply(bindImage, this, [currentDrawImage]);
  // 当前执行的列表中有两个（两个以上的可能性比较小）
  if (toBeList.length > 1) {
    fadeData.lastDrawImage = currentDrawImage;
    toBeList.shift();
    fadeData.drawProgress = 0;
  }
  dog.type = true;
}
