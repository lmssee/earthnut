import React from 'react';
import { xcn } from 'xcn';
import styled from 'styled-components';

/**  创建带样式的组件  */
const Content = styled.main`
  grid-area: content;
`;

/**
 *
 * layout content
 *
 *
 * @param {string} className  布局的类名
 *
 */
const InternalValueC = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <Content
        ref={ref}
        className={xcn('en-layout-main', className)}
        {...props}
        data-earthnut-ui="layout-content"
      />
    );
  },
);

InternalValueC.displayName = 'LayoutContent';

export { InternalValueC };
