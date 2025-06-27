import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { bindImage } from '../render/bindImage';
import { createImageBySrc } from '../buildBackground/createImageBySrc';
import { runSide } from '../buildBackground/runSide';

/**  两个图像间的淡入淡出  */
export function fade(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;
  renderData.isTransitioning = false;
  // 进度完成则结束当前的进度
  if (renderData.drawProgress > 1000) {
    renderData.isTransitioning = false;
    renderData.lastDrawImage = renderData.currentDrawImage;
    Reflect.apply(bindImage, this, [renderData.lastDrawImage]);
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
  /**  缩放效果  */
  // if (drawProgress < 0.5) {
  //   // ctx.globalAlpha = drawProgress; // 设置渐有
  //   const halfProgress = drawProgress / 2;
  //   ctx.drawImage(
  //     currentDrawImage,
  //     width * halfProgress,
  //     height * halfProgress,
  //     width * drawProgress,
  //     height * drawProgress,
  //   );
  // } else {
  //   const halfProgress = 0.5 - drawProgress / 2;
  //   ctx.drawImage(
  //     currentDrawImage,
  //     width * halfProgress,
  //     height * halfProgress,
  //     width * drawProgress,
  //     height * drawProgress,
  //   );
  // }
  // ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  const image = createImageBySrc(canvas.toDataURL('images/png'), width, height);
  image.onload = () => {
    renderData.isTransitioning = true;
    Reflect.apply(bindImage, this, [image]);
  };
}
