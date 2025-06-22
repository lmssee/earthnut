import { RipplesUseOptions } from './types';

/**
 * 默认值
 */
export const defaultData: RipplesUseOptions = {
  imageUrl: '',
  resolution: 256,
  dropRadius: 10,
  perturbance: 0.03,
  interactive: true,
  crossOrigin: '',
  playingState: true,
  accelerating: 1,
  raindropsTimeInterval: 3600,
  idleFluctuations: true,
} as const;

/**  冷冻执行  */
Object.freeze(defaultData);
