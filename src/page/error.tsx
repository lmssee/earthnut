/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName reset new tab
 * @FileName error.tsx
 * @CreateDate  周二  10/15/2024
 * @Description new tab 404 页面
 ****************************************************************************/

import React from 'react';
import { useNavigate, useRouteError } from 'react-router';
import styles from 'page/index.module.scss';
/**
 * 错误页面
 */
export function ErrorPage() {
  const navigate = useNavigate();

  const style: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '36px',
    cursor: 'pointer',
    textShadow: '.5px .5px .5px #0f0,-.5px -.5px .5px #000',
    color: 'transparent',
  };

  const error = useRouteError() as { statusText?: string; message: string };

  return (
    <div className={`center ${styles.error}`}>
      <h1>出现了意外</h1>
      <p>{error.statusText || error.message}</p>
      <p style={style} onClick={() => navigate('/')}>
        回首页
      </p>
    </div>
  );
}
