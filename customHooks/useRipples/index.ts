import { useEffect, useRef } from 'react';
import { BackgroundRipplesProps, RipplesOptions } from './types';
import { Ripples } from './ripplesClass';
import { isNull } from 'a-type-of-js';

/**
 *
 * ## 使用绘制 ripples 上一层
 *
 *
 * @param canvas `usrRef` 包裹的 `HTMLCanvasElement`，用于绘制图像
 * @param props  初始化的
 * @version 0.0.3
 * @see  https://earthnut.dev/use-ripples
 * @see  JQuery https://github.com/sirxemic/jquery.ripples
 * @example
 *
 * 下面是在 <BackgroundRipple> 中使用
 *
 * ```ts
 * import { useRipples } from 'earthnut/useRipples';
 * // 也可以使用包全量导入
 * // import { useRipples } from 'earthnut';
 *
 *  export function BackgroundRipple(props: BackgroundRipplesProps) {
 *
 *   // canvas 元素
 *  const canvas = useRef<HTMLCanvasElement>(null);
 *
 *  // 使用 ripples
 *  const ripplesRef = useRipples(canvas, props);
 *
 *  if (props.children) {
 *    return (
 *          <div style={props.style} className="earthnut-ripples">
 *          {props.children}
 *          <canvas ref={canvas}></canvas>
 *        </div>
 *      );
 *    } else {
 *      return <canvas ref={canvas}></canvas>;
 *    }
 *  }
 *
 * ```
 *
 */
export function useRipples(
  canvas: React.RefObject<HTMLCanvasElement | null>,
  props?: BackgroundRipplesProps,
): React.RefObject<Ripples | null> {
  /**  react dom  */
  const ripples = useRef<Ripples>(null);

  // 初始化数据
  useEffect(() => {
    /**  非空检验  */
    if (isNull(canvas.current)) return;

    ripples.current = new Ripples(canvas.current, props && props.option);

    return () => (ripples.current && ripples.current.destroy()) ?? undefined;
  }, []);

  return ripples;
}

export type { Ripples, BackgroundRipplesProps, RipplesOptions };
