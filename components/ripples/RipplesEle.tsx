/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName website
 * @FileName index.tsx
 * @CreateDate  周四  12/12/2024
 * @Description 涟漪
 ****************************************************************************/
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import React from 'react';
import { BackgroundRipplesProps, RipplesOptions } from 'customHooks/useRipples/types';
import { Ripples, useRipples } from 'customHooks/useRipples';
import { useOptionUpdate } from './useOptionUpdate';
import { isNull } from 'a-type-of-js';

/**
 *
 * ### 一个 ripple 背景组件
 *
 *
 * *需要为该组件或父组件设置背景，否则即便的渲染了，效果不明显*
 *
 *  参数 props 属性：
 * - children 内嵌的 ReactNode
 * - style    更改显示的样式
 * - option   初始化 ripples 的原始数据
 * @param props  使用参数
 * @version 0.0.1
 * @see https://earthnut.dev/earthnut/background-ripple
 * @example
 * 使用：
 *
 * ```ts
 *  import { BackgroundRipple } from 'earthnut/BackgroundRipple';
 *  // 也可以全量导入
 *  // import { BackgroundRipple } from 'earthnut';
 *  ...
 *  const animationFrameId = useAnimationFrame();
 *
 *  return <BackgroundRipple>
 *            ...
 *         </BackgroundRipple>
 * ```
 *
 */

export const BackgroundRipple = forwardRef<
  HTMLCanvasElement,
  React.HTMLAttributes<HTMLCanvasElement> & BackgroundRipplesProps
>((props: BackgroundRipplesProps, ref) => {
  /**  盒子  */
  const containerRef = useRef<HTMLDivElement>(null);
  /**  canvas 元素  */
  const canvas = useRef<HTMLCanvasElement>(null);
  /**  使用 ripples  */
  const ripplesRef = useRipples(canvas, props);
  // /// 背景图
  // const [parentBackgroundColor, setParentBackgroundColor] = useState('');
  // /// 背景图
  // const [parentBackgroundImage, setParentBackgroundImage] = useState('');

  ///  使用 配置更新
  useOptionUpdate(ripplesRef, props);

  // 抛出事件
  // useImperativeHandle(ref, () => ({
  //   triggerRipple: (x: number, y: number) => {
  //     triggerRippleEffect(x, y);
  //   },
  // }));

  // useEffect(() => {
  //   const updateParentStyles = () => {
  //     if (isNull(containerRef.current) || isNull(containerRef.current.parentElement)) {
  //       return;
  //     }
  //     /**  计算样式  */
  //     const computedStyle = window.getComputedStyle(containerRef.current.parentElement);
  //     setParentBackgroundColor(computedStyle.backgroundColor);
  //     setParentBackgroundImage(computedStyle.backgroundImage);
  //   };
  // });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvas} />
      {props.children}
    </div>
  );
});
