import { isBoolean } from 'a-type-of-js';
import { defaultData } from '../defaultData';
import { Program, RipplesUseOptions, Textures } from '../types';
/**
 *
 * 原始数据类
 *
 * 记录了除参数数据外的运行数据
 *
 */
export class RipplesRenderData {
  /**  canvas 的显隐  */
  visible: boolean = false;
  /**  当前执行的状态  */
  running: boolean = false;
  /**  上一次执行渲染状态  */
  lastRunningState: boolean = false;

  /**  渲染 id  */
  animationFrameId: number = 0;
  /**  渲染数据流
   *
   * 该值在 init 中进行初始化
   */
  quad: WebGLBuffer = null as never;
  /**
   * 上一次雨滴滴落的时间
   *
   * 该时间更新触发时机：
   * - 2.2s 内没有事件触发
   * - 鼠标交互更新
   */
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

  /**  倍级触发光标事件（值）  */
  #accelerating: number = defaultData.accelerating;
  /**  倍级触发光标事件  */
  set accelerating(value: number) {
    if (value > 100 || value < 2) return;
    this.#accelerating = value;
  }
  get accelerating(): number {
    return this.#accelerating;
  }

  /**  是否与鼠标互动（值）  */
  #interactive: boolean = defaultData.interactive;
  /**  是否与鼠标互动  */
  set interactive(value: boolean) {
    if (!isBoolean(value)) return;
    this.#interactive = value;
  }
  get interactive(): boolean {
    return this.#interactive;
  }
  /**  分辨率（值）  */
  #resolution: number = defaultData.resolution;
  /**  分辨率
   *
   * 纹理的尺寸，该项目中该值为纹理的宽和高
   *
   */
  set resolution(value: number) {
    if (value < 100 || value > 550) return;
    this.#resolution = value;
  }
  get resolution(): number {
    return this.#resolution;
  }

  /**   扰动系数 （值） */
  #perturbance: number = defaultData.perturbance;
  /**
   * 扰动系数
   *
   * 缺省 `0.03`
   *
   * 取之范围 `0.01 - 1`
   */
  set perturbance(value: number) {
    if (value < 0.0001 || value > 1) return;
    this.#perturbance = value;
  }
  get perturbance(): number {
    return this.#perturbance;
  }

  /**  扩散半径（值）  */
  #dropRadius: number = defaultData.dropRadius;

  /**
   * 扩散半径
   *
   * 缺省为 `20`
   */
  set dropRadius(value: number) {
    if (!isFinite(value) || value < 10) return;
    this.#dropRadius = value;
  }
  get dropRadius(): number {
    return this.#dropRadius;
  }

  /**  传入的背景图片  */
  imageUrl: string | null = defaultData.imageUrl;

  /**  闲置波动 （值） */
  #idleFluctuations: boolean = defaultData.idleFluctuations;
  /**  闲置波动  */
  set idleFluctuations(value: boolean) {
    if (!isBoolean(value)) return;
    this.#idleFluctuations = value;
  }
  get idleFluctuations(): boolean {
    return this.#idleFluctuations;
  }
  /**  雨滴落下的时间间隔（值）  */
  #raindropsTimeInterval: number = defaultData.raindropsTimeInterval;

  /**  雨滴落下的时间间隔  */
  set raindropsTimeInterval(value: number) {
    if (value < 10 || value > 12000) return;
    this.#raindropsTimeInterval = value;
  }
  get raindropsTimeInterval(): number {
    return this.#raindropsTimeInterval;
  }

  /**  渲染程序  */
  renderProgram!: Program;

  /**  图像资源的配置  */
  imageSource: string = '';

  /**  该值于初始化着色器时初始化  */
  dropProgram!: Program;

  /**  更新流  */
  updateProgram!: Program;

  /**  纹理  */
  textures: Textures = [];
  /**  背景纹理  */
  backgroundTexture: WebGLTexture = [];
  /**  纹理数据  */
  textureDelta!: Float32Array<ArrayBuffer>;
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
  /**  原始 css  */
  crossOrigin: string = '';
  /** 事件  */
  events: {
    mousemove: (e: MouseEvent) => void;
    mousedown: (e: MouseEvent) => void;
    touchmove: (e: TouchEvent) => void;
    touchstart: (e: TouchEvent) => void;
  } = {} as never;

  constructor(options: RipplesUseOptions) {
    /**  @ts-ignore: 删除  */
    if (options) !isBoolean(options?.interactive) && delete options?.interactive;
    this.perturbance = options.perturbance;
    this.resolution = options.resolution;
    this.raindropsTimeInterval = options.raindropsTimeInterval;
    this.accelerating = options.accelerating;
    this.interactive = options.interactive;
    this.dropRadius = options.dropRadius;
    this.imageUrl = options.imageUrl;
    this.idleFluctuations = options.idleFluctuations;
  }
}
