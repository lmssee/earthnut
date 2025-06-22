import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { dog } from 'dog';
import { restoreCssBackground } from './restoreCssBackground';

/**  注销  */
export function destroy(this: Ripples) {
  const { renderData } = this;

  if (isNull(renderData)) return;

  /// 如果 animationFrameId 存在则清理该渲染
  if (renderData?.animationFrameId) window.cancelAnimationFrame(renderData.animationFrameId);
  if (renderData?.parentElement && renderData?.events) {
    const { parentElement, events } = renderData;
    dog('parentElement', parentElement);
    /// 移除监听的事件
    (Object.keys(events) as []).forEach(
      e => parentElement.removeEventListener && parentElement.removeEventListener(e, events[e]),
    );
    /// 移除属性
    if (parentElement.removeAttribute) parentElement.removeAttribute('data-ripples');
  }
  /// 移除 style 元素
  if (this.styleElement) this.styleElement.remove();
  /// 销毁当前对  WebGLRenderingContext 的引用
  this.gl = null as never;
  /// 恢复父级节点的背景样式
  Reflect.apply(restoreCssBackground, this, []);
  {
    /// 销毁执行上下文本身
    Object.keys(renderData).forEach(e => (renderData[e as never] = null as never));
    this.renderData = null as never;
  }
  {
    /// 销毁当前对  WebGLRenderingContext 的引用
    if (this.gl) this.gl = null as unknown as never;
  }
  /// 移除注册在 window 上的尺寸变化的事件
  window.removeEventListener('resize', this.updateSize);
  {
    // this.canvas.remove(); /// react 会自己管理移除元素
  }
}
