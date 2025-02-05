import { Ripples } from './ripplesClass';
import { RipplesOptions } from './types';

export function useRipples(element: HTMLElement, options: RipplesOptions) {
  const canvas = document.createElement('canvas');
  element.appendChild(canvas);
  const ripple = new Ripples(canvas, options);

  return ripple;
}
