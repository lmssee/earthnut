import React from 'react';
import { Outlet } from 'react-router';
import MainTab from 'page/tab';
import 'css/common.scss';
import 'css/product.scss';
import styles from 'page/index.module.scss';
import { BackgroundRipple } from 'components';

export function App() {
  return (
    <div className={styles.page}>
      <div className={styles.tab}>
        <MainTab />
      </div>
      <div className={styles.main}>
        <Outlet></Outlet>
      </div>
    </div>
  );
}
