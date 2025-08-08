import { useEffect, useState } from 'react';
import { useRipples } from '.';

/**  动态加载包含的自定义的钩子  */
export function useLazyRipples() {
  // 储存加载后的钩子
  const [hook, setHook] = useState<typeof useRipples>();
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  // 错误状态
  const [error, setError] = useState(null);

  useEffect(() => {
    // 设置加载状态
    setIsLoading(true);
    import('./index')
      .then(module => {
        setHook(module.useRipples);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { hook, isLoading, error };
}
