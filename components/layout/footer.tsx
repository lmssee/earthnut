import React from 'react';
import { LayoutFooterProps } from './types';
import { xcn } from 'xcn';
import styled from 'styled-components';

/**  带样式的组件  */
const Content = styled.div`
  grid-area: footer;
  height: var(--layout-footer-height);
  box-shadow: 0 -1px 13px 0px #0000001a;
  overflow: hidden;
`;

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
    <Content
      ref={ref}
      {...props}
      className={xcn('en-layout-footer', className)}
      data-earthnut-ui="layout-footer"
    />
  );
});

InternalValueF.displayName = 'LayoutFooter';

export { InternalValueF };
