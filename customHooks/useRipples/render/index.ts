import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { computeTextureBoundaries } from './computeTextureBoundaries';
import { draw } from './draw';
import { update } from './update';

/**
 * 开启绘制
 *
 */
export function render(this: Ripples) {
  const { renderData } = this;

  if (isNull(renderData)) return;
  const { raindropsTimeInterval, running, lastRaindropsFallTime } = renderData;
  // if (!visible)
  //   return (renderData.animationFrameId = requestAnimationFrame(() =>
  //     Reflect.apply(render, this, []),
  //   ));
  // dog('当前的执行状态', running);
  /**  计算  */
  Reflect.apply(computeTextureBoundaries, this, []);
  if (running) {
    if (!renderData.lastRunningState) {
      renderData.lastRunningState = true;
      this.show();
    }
    if (renderData.idleFluctuations) {
      const now = Date.now();
      /**  模拟雨滴坠落  */
      if (now - lastRaindropsFallTime > raindropsTimeInterval) {
        renderData.lastRaindropsFallTime = now;
        this.raindropsFall();
      }
    }
    /**  数据更新  */
    Reflect.apply(update, this, []);
    /**  渲染  */
    Reflect.apply(draw, this, []);
  } else if (renderData.lastRunningState) {
    renderData.lastRunningState = false;
    this.hide();
  }

  // 渲染
  renderData.animationFrameId = requestAnimationFrame(() => Reflect.apply(render, this, []));
}
