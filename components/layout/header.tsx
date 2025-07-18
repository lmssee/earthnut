import React from 'react';
import { LayoutHeaderProps } from './types';
import { xcn } from 'xcn';
import styled from 'styled-components';

/**  带样式的头部  */
const EnLayoutHeader = styled.div`
  grid-area: header;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 10;
  height: var(--layout-header-height);
  box-shadow: 0 4px 13px -3px #0000001a;
  overflow: hidden;
`;
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
    <EnLayoutHeader
      ref={ref}
      className={xcn(['en-layout-header'], className)}
      {...props}
      data-earthnut-ui="layout-header"
    >
      {children}
    </EnLayoutHeader>
  );
});

InternalValueH.displayName = 'LayoutHeader';

export { InternalValueH };
