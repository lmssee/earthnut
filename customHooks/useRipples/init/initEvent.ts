import { dropAtPointer } from '../render/dropAtPointer';
import { ripplesRenderDataWarehouse } from '../rippersData/renderData';
import { Ripples } from '../ripplesClass';

/**
 * 初始化事件
 */
export function setupPointerEvents(this: Ripples) {
  const renderData = ripplesRenderDataWarehouse[this.sole];
  const { visible, running, accelerating, parentElement, events } = renderData;
  /**  当前是否允许鼠标操作  */
  const pointerEventsEnabled = () => visible && running && this.interactive;
  /**  触发滴落效果  */
  const _dropAtPointer = (pointer: MouseEvent | Touch, big: boolean = false) => {
    if (pointerEventsEnabled()) {
      renderData.lastRaindropsFallTime = Date.now(); /// 更新上一次触发时机，延迟主动触发的雨滴
      Reflect.apply(dropAtPointer, this, [
        pointer,
        this.dropRadius * (big ? 1.5 : 1),
        big ? 0.14 : 0.01,
      ]);
    }
  };
  events.mousemove = (e: MouseEvent) => {
    for (let i = accelerating; i--; ) _dropAtPointer(e);
  };
  events.touchmove = events.touchstart = (e: TouchEvent) => {
    const touches = e.touches;
    for (let i = 0; i < touches.length; i++) _dropAtPointer(touches[i]);
  };
  events.mousedown = e => _dropAtPointer(e, true);

  /**  注册鼠标或触摸事件  */
  (Object.keys(events) as []).forEach(
    e => parentElement && parentElement.addEventListener(e, events[e], { passive: true }),
  );
}
