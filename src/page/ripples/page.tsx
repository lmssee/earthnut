import { BackgroundRipple } from 'components';
import React, { useState } from 'react';
import styles from './index.module.scss';

export default function RipplesPage() {
  const [playingState, setPlayingState] = useState(true);

  function togglePlayingState(e: React.MouseEvent) {
    setPlayingState(!playingState);
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className={styles.page} onContextMenu={togglePlayingState}>
      <div>12454</div>
      <BackgroundRipple
        option={{
          dropRadius: 10,
          resolution: 366,
          perturbance: 0.02,
          playingState,
          raindropsTimeInterval: 4800,
        }}
      ></BackgroundRipple>
    </div>
  );
}
