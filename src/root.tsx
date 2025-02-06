/****************************************************************************
 * @Author lmssee
 * @Email lmssee@outlook.com
 * @ProjectName reset-new-tab
 * @FileName index.ts
 * @CreateDate  周二  09/03/2024
 * @Description 新页的逻辑代码，为了与刷新页面的逻辑分开（这是嵌入逻辑）
 *
 *
 ****************************************************************************/
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './router';
import './global.scss';

createRoot(document.body).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
