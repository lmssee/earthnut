/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName reset-new-tav
 * @FileName router.tsx
 * @CreateDate  周二  10/15/2024
 * @Description 路由导航（需求不多，为了使用路由而使用路由）
 ****************************************************************************/

import React from 'react';
import { ErrorPage } from 'page/error';
import { App } from 'page/app';
import RipplesPage from 'page/ripples';
import UseInputIsComposing from 'page/use_input_is_composing/page';
import { createHashRouter } from 'react-router';
import { MarqueePage } from 'page/marquee';

/** 路由 */
const router = createHashRouter(
  [
    {
      path: '/',
      element: <App></App>,
      errorElement: <ErrorPage></ErrorPage>,
      children: [
        {
          errorElement: <ErrorPage></ErrorPage>,
          children: [
            { index: true, element: <RipplesPage /> },
            {
              path: '/useInputIsComposing',
              element: <UseInputIsComposing />,
            },
            {
              path: '/marquee',
              element: <MarqueePage />,
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      // v7_
    },
  },
);

export { router };
