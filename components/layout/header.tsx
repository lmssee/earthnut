import React from 'react';
import { LayoutHeaderProps } from './types';
import { xcn } from 'xcn';
import styles from './style/index.module.scss';

/**
 *
 * layout header
 *
 * 布局头部
 *
 * @param className 自定义类名
 * @param height 高度
 *    缺省值为 2.8rem，当未在 `Layout` 中使用，该值不起作用
 * @param noSticky 是否取消悬挂粘连
 *    缺省值为 false
 * @param props 其他属性
 * @returns React.ReactElement
 */

const InternalValueH = React.forwardRef<
  HTMLDivElement,
  LayoutHeaderProps
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ className, children, height, noSticky, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={xcn(styles['en-layout-header'], className)}
      {...props}
      data-earthnut-ui="layout-header"
    >
      {children}
    </div>
  );
});

InternalValueH.displayName = 'LayoutHeader';

export { InternalValueH };
