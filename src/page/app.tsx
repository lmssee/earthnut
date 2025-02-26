import React from 'react';
import { Outlet } from 'react-router';
import MainTab from 'page/tab';
import 'css/common.scss';
import styles from 'page/index.module.scss';
import { BackgroundRipple } from 'components';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSideBar,
} from 'components/layout';
import { mcn } from 'mix-cn';

export function App() {
  return (
    <Layout>
      <LayoutHeader className={mcn('dark')}>
        头部
        <BackgroundRipple />
      </LayoutHeader>
      <LayoutSideBar>侧边栏</LayoutSideBar>
      <LayoutContent>内容区</LayoutContent>
      <LayoutFooter>页脚</LayoutFooter>
      <div className={styles.page}>
        <div className={styles.tab}>
          <MainTab />
        </div>
        <div className={styles.main}>
          <Outlet></Outlet>
        </div>
      </div>
    </Layout>
  );
}
