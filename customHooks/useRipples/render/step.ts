import { ripplesRenderDataWarehouse } from '../rippersData/renderData';
import { Ripples } from '../ripplesClass';
import { computeTextureBoundaries } from './computeTextureBoundaries';
import { render } from './render';
import { update } from './update';

/**
 * 开启绘制
 *
 */
export function step(this: Ripples) {
  const renderData = ripplesRenderDataWarehouse[this.sole];
  const { visible, raindropsTimeInterval, running, lastRaindropsFallTime } = renderData;
  if (!visible) return;
  /**  计算  */
  Reflect.apply(computeTextureBoundaries, this, []);
  /**  雨滴更新  */
  if (this.idleFluctuations && running) {
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
  Reflect.apply(render, this, []);
  // 渲染
  renderData.animationFrameId = requestAnimationFrame(() => {
    return Reflect.apply(step, this, []);
  });
}
