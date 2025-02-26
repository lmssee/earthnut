import React from 'react';
import { mcn } from 'mix-cn';
import './layout.oops.scss';
/**************************************
 *
 * layout content
 *
 *
 * @param {string} className  布局的类名
 *
 **************************************/
const InternalValueC = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={mcn('oops-layout-main', className)}
      {...props}
      data-oops-ui="layout-content"
    />
  );
});

InternalValueC.displayName = 'LayoutContent';

export { InternalValueC };
