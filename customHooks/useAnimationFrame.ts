/****************************************************************************
 * @Author lmssee
 * @Email lmssee@outlook.com
 * @ProjectName oops-ui
 * @FileName useAnimationFrame.ts
 * @CreateDate  周二  01/07/2025
 * @Description 使用 animationFrame
 ****************************************************************************/

import { useEffect, useRef } from 'react';
/**************************************
 *
 * ### 导出一个使用 `useRef` 创建的 `number`
 *
 * 该数值在组件卸载时会自动调用 `window.cancelAnimationFrame` 清理
 *
 * 使用：
 *
 * ```ts
 *  import { useAnimationFrame } from 'oops-ui/useAnimationFrame';
 *  // 也可以全量导入
 *  // import { useAnimationFrame } from 'oops-ui';
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
 **************************************/
export function useAnimationFrameId() {
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
