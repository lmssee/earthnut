import React from 'react';
import { xcn } from 'xcn';
import styles from './style/index.module.scss';
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
      <main
        ref={ref}
        className={xcn(styles['en-layout-main'], className)}
        {...props}
        data-earthnut-ui="layout-content"
      />
    );
  },
);

InternalValueC.displayName = 'LayoutContent';

export { InternalValueC };
