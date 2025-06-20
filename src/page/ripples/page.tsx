import { BackgroundRipple } from 'components';
import React, { useState } from 'react';
import styles from './index.module.scss';
import { xcn } from 'xcn';

export default function RipplesPage() {
  const [playingState, setPlayingState] = useState(true);

  function togglePlayingState(e: React.MouseEvent) {
    setPlayingState(!playingState);
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className={styles.page} onContextMenu={togglePlayingState}>
      <BackgroundRipple
        option={{
          dropRadius: 10,
          resolution: 366,
          perturbance: 0.02,
          playingState,
          raindropsTimeInterval: 4800,
        }}
      >
        <div className={xcn('en-center')}>
          <h1>侠客行</h1>
          <div className={xcn('en-text-right', 'en-text-small')}>(唐)李白</div>
          {[
            '赵客缦胡缨，吴钩霜月明。',
            '银鞍照白马，飒沓如流星。',
            '十步杀一人，千里不留行。',
            '事了拂衣去，深藏功与名。',
            '闲过信陵饮，脱剑膝前横。',
            '将炙啖朱亥，持觞劝侯嬴。',
            '三杯吐然诺，五岳倒为轻。',
            '眼花耳热后，意气素霓生。',
            '救赵挥金槌，邯郸先震惊。',
            '千秋二壮士，烜赫大梁城。',
            '纵死侠骨香，不惭世上英。',
            '谁能书阁下，白首太玄经。',
          ].map(e => (
            <div key={e} className={xcn(styles.p, 'en-color-text')}>
              {e}
            </div>
          ))}
        </div>
      </BackgroundRipple>
    </div>
  );
}
