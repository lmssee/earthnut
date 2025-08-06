import { Marquee } from 'components/marquee';
import React from 'react';
import styled from 'styled-components';

const Example = styled.div`
  width: 200px;
  height: 200px;
`;

/**  跑马灯的页面展示  */
export function MarqueePage() {
  return (
    <Example>
      <Marquee>
        <div>12</div>
        查看效果
      </Marquee>
    </Example>
  );
}
