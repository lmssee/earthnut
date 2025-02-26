import React from 'react';
import { LayoutFooterProps } from './types';
import { mcn } from 'mix-cn';
import './layout.oops.scss';

/**************************************
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
 **************************************/
const InternalValueF = React.forwardRef<
  HTMLDivElement,
  LayoutFooterProps
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ className, height, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={mcn('oops-layout-footer', className)}
      data-oops-ui="layout-footer"
    />
  );
});

InternalValueF.displayName = 'LayoutFooter';

export { InternalValueF };
