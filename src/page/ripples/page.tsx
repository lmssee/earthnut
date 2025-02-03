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
      ripples
      <BackgroundRipple option={{ resolution: 500, playingState }} />
    </div>
  );
}
