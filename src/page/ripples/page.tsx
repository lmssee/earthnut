import { BackgroundRipple } from 'components';
import React from 'react';
import styles from './index.module.scss';

export default function RipplesPage() {
  return (
    <div className={styles.page}>
      ripples
      <BackgroundRipple></BackgroundRipple>
    </div>
  );
}
