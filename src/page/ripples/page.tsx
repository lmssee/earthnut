import { BackgroundRipple } from 'components';
import React from 'react';
import styles from './index.module.scss';

export default function RipplesPage() {
  return (
    <div className={styles.page}>
      <div
        style={{
          width: '100%',
          height: '200%',
        }}
      >
        ripples
        <BackgroundRipple option={{ resolution: 500 }} />
      </div>
    </div>
  );
}
