import { Program, RipplesDefaultData, Textures } from '../types';
/**************************************
 *
 * 原始数据类
 *
 **************************************/
export class RipplesRenderData {
  /**  canvas 的显隐  */
  visible: boolean = false;
  /**  当前执行的状态  */
  running: boolean = false;
  /**  扰动系数  */
  perturbance: number;
  /**    */
  resolution: number;
  /**  雨滴醉落的时间间隔  */
  raindropsTimeInterval: number;
  /**  渲染 id  */
  animationFrameId: number = 0;
  /**  渲染数据流
   *
   * 该值在 init 中进行初始化
   */
  quad: WebGLBuffer = null as never;
  /**************************
   * 上一次雨滴滴落的时间
   *
   * 该时间更新触发时机：
   * - 2.2s 内没有事件触发
   * - 鼠标交互更新
   **************************/
  lastRaindropsFallTime: number = 0; // 该值不为 0 将会导致
  /**  canvas 父级元素  */
  parentElement: HTMLElement = null as never;
  /**  背景页面的数据  */
  backgroundInfo: {
    width: number;
    height: number;
  } = {
    width: 0,
    height: 0,
  };
  /**************************
   *
   * 该值于初始化着色器时初始化
   **************************/
  dropProgram: Program = null as never;
  /**************************
   *
   **************************/
  updateProgram: Program = null as never;

  /**  纹理  */
  textures: Textures = [];
  /**  背景纹理  */
  backgroundTexture: WebGLTexture = [];
  /**  纹理数据  */
  textureDelta: Float32Array<ArrayBuffer> = null as never;
  /**    */
  framebuffers: WebGLFramebuffer[] = [];
  /**    */
  bufferWriteIndex: number = 0;
  /**    */
  bufferReadIndex: number = 1;
  /**  原始行内样式  */
  originalInlineCss: string = '';
  /**  原始 background-image 数据    */
  originalCssBackgroundImage: string = '';
  /**************************
   * 事件
   **************************/
  events: {
    mousemove: (e: MouseEvent) => void;
    mousedown: (e: MouseEvent) => void;
    touchmove: (e: TouchEvent) => void;
    touchstart: (e: TouchEvent) => void;
  } = {} as never;
  /**  触发倍效  */
  accelerating: number;
  constructor(defaultData: RipplesDefaultData) {
    this.perturbance = defaultData.perturbance;
    this.resolution = defaultData.resolution;
    this.raindropsTimeInterval = defaultData.raindropsTimeInterval;
    this.accelerating = defaultData.accelerating;
  }
}

/**************************************
 *
 * 渲染数仓
 *
 **************************************/
export const ripplesRenderDataWarehouse: { [x: symbol]: RipplesRenderData } = {};
