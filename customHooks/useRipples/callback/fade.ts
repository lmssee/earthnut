import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { bindImage } from '../buildBackground/utils/bindImage';
import { runSide } from '../buildBackground/runSide';

/**  两个图像间的淡入淡出  */
export function fade(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;
  // 25-06-30 由于WebGLRenderingContext.texImage2D  可直接接受 HTMLCanvasElement 元素
  // 无需创建 Image 元素且等待资源的 load ，下面的步骤先做移除
  // renderData.isTransitioning = false;
  // 进度完成则结束当前的进度
  if (renderData.drawProgress > 1000) {
    // 临时关闭当前的状体
    renderData.isTransitioning = false;
    renderData.lastDrawImage = renderData.currentDrawImage;
    renderData.currentDrawImage = null;
    // 渲染到背景图
    Reflect.apply(bindImage, this, [renderData.lastDrawImage]);
    // 启用下一轮的循环
    Reflect.apply(runSide, this, []);
    return;
  }
  renderData.drawProgress += 18;
  const { drawProgress, backgroundInfo, lastDrawImage, currentDrawImage } = renderData;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (isNull(ctx) || isNull(lastDrawImage) || isNull(currentDrawImage)) return;
  const { width, height } = backgroundInfo;
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  // ctx.globalCompositeOperation = 'destination-over';
  {
    // ctx.globalAlpha = 1 - drawProgress;
    ctx.drawImage(lastDrawImage, 0, 0, width, height);
    ctx.globalAlpha = drawProgress / 1000;
    ctx.drawImage(currentDrawImage, 0, 0, width, height);
  }

  ctx.globalAlpha = 1;

  Reflect.apply(bindImage, this, [canvas]);

  // 由于 WebGLRenderingContext.texImage2D  可直接接受 HTMLCanvasElement 元素，下面的冗余步骤注释
  // const src = canvas.toDataURL('images/png');

  // const image = createImageBySrc(src, width, height);

  // /// 等图像下载后才可以进行下一步，否则出现页面为空白
  // image.onload = () => {
  //   renderData.isTransitioning = true;
  //   Reflect.apply(bindImage, this, [image]);
  // };
}
