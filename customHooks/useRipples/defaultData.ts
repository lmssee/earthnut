import { RipplesOptions } from './interface';

/**************************
 * 默认值
 **************************/
export const defaultData: RipplesOptions = {
  imageUrl: '',
  resolution: 360,
  dropRadius: 10,
  perturbance: 0.03,
  interactive: true,
  crossOrigin: '',
  playingState: true,
  accelerating: 3,
  raindropsTimeInterval: 660,
  idleFluctuations: true,
};

/**  冷冻执行  */
Object.freeze(defaultData);
