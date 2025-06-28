/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName earthnut
 * @FilePath /src/customHooks/useAnimationFrame.ts
 * @FileName useAnimationFrame.ts
 * @CreateDate  周二  01/07/2025
 * @Description 使用 animationFrame
 ****************************************************************************/

import { useEffect, useRef } from 'react';
/**
 *
 * ### 导出一个使用 `useRef` 创建的 `number`
 *
 *    该数值在组件卸载时会自动调用 `window.cancelAnimationFrame` 清理
 * @description 一个接收 `window.requestAnimationFrame` 的返回值的 `ref`
 * @returns  <React.RefObject: number>
 * @version 0.0.3
 * @see   https://earthnut.dev/use-animation-frame
 * @example
 * 使用：
 *
 * ```ts
 *  import { useAnimationFrame } from 'earthnut/useAnimationFrame';
 *  // 也可以全量导入
 *  // import { useAnimationFrame } from 'earthnut';
 *  ...
 *  const animationFrameId = useAnimationFrame();
 *
 *  function performAction(time?: number){
 *    useAnimationFrame.current = window.requestAnimationFrame(performAction);
 *    ...
 *  }
 *
 *  useEffect(()=>{
 *      animationFrameId.current = window.requestAnimationFrame(performAction);
 *  });
 *  ...
 *
 * ```
 *
 */
export function useAnimationFrameId(): React.RefObject<number> {
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  return animationFrameId;
}
