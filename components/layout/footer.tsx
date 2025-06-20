import React from 'react';
import { LayoutFooterProps } from './types';
import { xcn } from 'xcn';
import styles from './style/index.module.scss';

/**
 *
 * layout footer
 *
 * 布局底部
 *
 * @param className 自定义类名
 * @param height 自定义高度
 * @param props 其他属性
 * @returns React.ReactElement
 *
 */
const InternalValueF = React.forwardRef<
  HTMLDivElement,
  LayoutFooterProps
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ className, height, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={xcn(styles['en-layout-footer'], className)}
      data-earthnut-ui="layout-footer"
    />
  );
});

InternalValueF.displayName = 'LayoutFooter';

export { InternalValueF };
