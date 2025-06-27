import React from 'react';
import styles from './index.module.scss';
import { NavLink } from 'react-router';

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
      text: 'useInputIsComposing',
      url: '/useInputIsComposing',
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
