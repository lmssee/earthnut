import { LazyBackgroundRipple } from 'components/ripples/LazyRippleEle';
import React from 'react';

/**  延迟加载  */
export function LazyRipplePage() {
  return (
    <div>
      <div>
        <LazyBackgroundRipple>123</LazyBackgroundRipple>
      </div>
    </div>
  );
}
