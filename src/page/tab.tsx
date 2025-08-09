import React from 'react';
import styles from './index.module.scss';
import { NavLink } from 'react-router';

/**
 * 左侧导航栏
 */
export default function MainTab() {
  // const path = useNavigation();

  const urlList: {
    text: string;
    url: string;
  }[] = [
    {
      text: '首页',
      url: '',
    },
    {
      text: '延迟 ripple',
      url: '/lazy-ripplePage',
    },
    {
      text: '检测输入框输入状态',
      url: '/useInputIsComposing',
    },
    {
      text: '图片',
      url: '/image',
    },
    {
      text: '跑马灯',
      url: '/marquee',
    },
  ];

  return (
    <nav>
      <ul>
        {urlList.map(e => (
          <li key={e.text}>
            <NavLink
              to={e.url}
              className={({ isActive, isPending }) =>
                isPending ? 'pending' : isActive ? styles.active : ''
              }
            >
              {e.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
