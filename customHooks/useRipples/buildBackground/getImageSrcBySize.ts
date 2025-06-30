import { isNull } from 'a-type-of-js';
import { createDefault } from './default-background/createDefault';

/**  通过尺寸创建一个默认图  */
export function getImageSrcBySize(width: number, height: number) {
  /**  构建空的 canvas  */
  const canvas = document.createElement('canvas');
  const canvasR = document.createElement('canvas');
  /**  执行上下文  */
  const ctx = canvas.getContext('2d');
  const ctxR = canvasR.getContext('2d');
  if (isNull(ctx) || isNull(ctxR)) return '';
  canvas.width = canvasR.width = width;
  canvas.height = canvasR.height = height;

  ctx.clearRect(0, 0, width, height); // 清理画布
  ctxR.clearRect(0, 0, width, height);
  ctx.globalAlpha = 1;
  ctx.putImageData(createDefault(width, height), 0, 0);
  ctxR.fillStyle = '#ffffff';
  ctxR.fillRect(0, 0, width, height);
  // ctxR.globalCompositeOperation = 'copy';
  ctxR.drawImage(canvas, 0, 0, width, height);
  ctxR.globalCompositeOperation = 'source-over';
  const url = canvasR.toDataURL('images/png');
  return url;
}
