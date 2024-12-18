/****************************************************************************
 * @Author lmssee
 * @Email lmssee@outlook.com
 * @ProjectName website
 * @FileName dataStore.ts
 * @CreateDate  周六  12/07/2024
 * @Description 数据库
 ****************************************************************************/

import { createImageData } from './createImageData';
import { loadConfig } from './loadConfig';

const id = 'lmssee_ripper_element_style';

export class RipplesData {
  /**************************
   * style 元素的 id
   **************************/
  styleElement = document.createElement('style');
  /**************************
   * canvas 元素
   **************************/
  canvas: HTMLCanvasElement;
  /**************************
   * WebGL 绘图上下文
   **************************/
  gl!: WebGLRenderingContext;
  /**************************
   * 配置
   **************************/
  config: {
    type: number;
    linearSupport: boolean;
    extensions: string[];
    arrayType: Float32ArrayConstructor | null;
  } | null;

  /**************************
   * 像素
   **************************/
  transparentPixels = createImageData(32, 32);

  /**************************
   * 初始化情况
   **************************/
  initState = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl: WebGLRenderingContext | null = canvas.getContext('webgl');
    /**  浏览器不支持 WebGL  */
    if (gl === null) {
      this.initState = false; /// 初始化失败
      this.config = null; /// 配置为 0
      return;
    }
    this.gl = gl;
    if (document.querySelector(`style#${id}`) === null) {
      const style = this.styleElement;
      style.id = id;
      style.innerHTML = `
      .lmssee-ripples { 
        position: relative; 
        z-index: 0; 
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translate(0,0);
      }
      `;
      const head = document.head;
      if (head.prepend) head.prepend(style);
      else head.insertBefore(style, head.firstChild);
    }
    this.config = Reflect.apply(loadConfig, this, []);
  }
}
