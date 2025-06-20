import { isUndefined } from 'a-type-of-js';
import { BackgroundRipplesProps, Ripples, RipplesOptions } from 'customHooks';
import { useEffect } from 'react';

/**
 * 更新参数数据
 */
export function useOptionUpdate(
  ripplesRef: React.RefObject<Ripples | null>,
  props: BackgroundRipplesProps,
) {
  /**  监听数据变化并给值  */
  useEffect(() => {
    if (props.option && ripplesRef.current) {
      const options = props.option;
      (Object.keys(ripplesRef.current.defaults) as unknown as (keyof RipplesOptions)[]).forEach(
        e => {
          if (!isUndefined(options[e])) {
            ripplesRef.current && ripplesRef.current.set(e as keyof RipplesOptions, options[e]);
          }
        },
      );
    }
  }, [props.option]);
}
