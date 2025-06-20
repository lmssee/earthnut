import React from 'react';
import { Outlet } from 'react-router';
import MainTab from 'page/tab';
import 'css/common.scss';
import 'css/product.scss';
import styles from 'page/index.module.scss';
import { BackgroundRipple } from 'components';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSideBar,
} from 'components/layout/layout';
import { xcn } from 'xcn';

export function App() {
  return (
    <Layout classes={xcn(styles.page)}>
      <LayoutHeader className={xcn('dark')}>
        头部区域
        <BackgroundRipple />
      </LayoutHeader>
      <LayoutSideBar className={xcn(styles.tab)}>
        <MainTab />
      </LayoutSideBar>
      <LayoutContent className={xcn(styles.main)}>
        <Outlet></Outlet>
      </LayoutContent>
      <LayoutFooter>
        <div className={xcn('en-text-center')}>我是页脚，有点啥才好</div>
      </LayoutFooter>
    </Layout>
  );
}
