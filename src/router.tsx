/****************************************************************************
 * @Author lmssee
 * @Email lmssee@outlook.com
 * @ProjectName reset-new-tav
 * @FileName router.tsx
 * @CreateDate  周二  10/15/2024
 * @Description 路由导航（需求不多，为了使用路由而使用路由）
 ****************************************************************************/

import { createHashRouter } from 'react-router';

import React from 'react';
import { ErrorPage } from 'page/error';
import { App } from 'page/app';
import RipplesPage from 'page/ripples/page';

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
          children: [{ index: true, element: <RipplesPage /> }],
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
