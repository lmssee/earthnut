import { isNull } from 'a-type-of-js';
import { dropAtPointer } from '../render/dropAtPointer';
import { Ripples } from '../ripplesClass';

/**
 * 初始化事件
 */
export function setupPointerEvents(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;

  const { parentElement, events } = renderData;
  /// visible、running 的值应当取当前值而不是提前取到固定值
  /**  当前是否允许鼠标操作  */
  const pointerEventsEnabled = () =>
    renderData.visible && renderData.running && renderData.interactive;
  /**  触发滴落效果  */
  const _dropAtPointer = (pointer: MouseEvent | Touch, big: boolean = false) => {
    if (pointerEventsEnabled()) {
      renderData.lastRaindropsFallTime = Date.now(); /// 更新上一次触发时机，延迟主动触发的雨滴
      Reflect.apply(dropAtPointer, this, [
        pointer,
        renderData.dropRadius * (big ? 1.5 : 1),
        big ? 0.14 : 0.01,
      ]);
    }
  };
  events.mousemove = (e: MouseEvent) => {
    for (let i = renderData.accelerating; i--; ) {
      _dropAtPointer(e);
    }
  };
  events.touchmove = events.touchstart = (e: TouchEvent) => {
    const touches = e.touches;
    for (let i = 0; i < touches.length; i++) {
      _dropAtPointer(touches[i]);
    }
  };
  events.mousedown = e => {
    _dropAtPointer(e, true);
  };

  /**  注册鼠标或触摸事件  */
  (Object.keys(events) as []).forEach(e =>
    parentElement?.addEventListener(e, events[e], { passive: true }),
  );
}
