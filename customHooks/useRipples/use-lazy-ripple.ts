import { useEffect, useRef, useState } from 'react';
import { Ripples } from './ripplesClass';
import { RipplesOptions } from './types';
import { isNull } from 'a-type-of-js';
/**  动态加载包含的自定义的钩子  */
export function useLazyRipples(
  canvas: React.RefObject<HTMLCanvasElement | null>,
  option?: RipplesOptions,
): { ripples: React.RefObject<Ripples | null>; isLoading: boolean; error: unknown } {
  /**  react dom  */
  const ripples = useRef<Ripples>(null);
  // 储存加载后的钩子

  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  // 错误状态
  const [error, setError] = useState(null);

  useEffect(() => {
    /**  非空检验（这里一般都是有值的，除非故障）  */
    if (isNull(canvas.current)) return;
    // 设置加载状态
    setIsLoading(true);
    import('./ripplesClass')
      .then(module => {
        if (isNull(canvas.current)) return;
        ripples.current = new module.Ripples(canvas.current, option);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => ripples.current?.destroy();
  }, []);

  return { ripples, isLoading, error };
}
