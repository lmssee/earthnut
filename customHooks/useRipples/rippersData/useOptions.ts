import { isBoolean } from 'a-type-of-js';
import { defaultData } from './defaultData';
import { ImageCrossOrigin, RipplesUseOptions } from '../types';

/** 用户使用参数  */
export class UseOptions {
  /**  倍级触发光标事件（值）  */
  #accelerating: number = defaultData.accelerating;
  /**  倍级触发光标事件  */
  set accelerating(value: number) {
    if (value > 100 || value < 2) return;
    this.#accelerating = value;
  }
  /**
   * 倍级触发光标事件
   */
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
  /**
   * 是否与鼠标互动
   */
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
  /**
   * 纹理的尺寸，该项目中该值为纹理的宽和高
   */
  get resolution(): number {
    return this.#resolution;
  }

  /**   扰动系数 （值） */
  #perturbance: number = defaultData.perturbance;
  /**
   * 扰动系数
   *
   * 缺省 `0.01`
   *
   * 取之范围 `0.01 - 1`
   */
  set perturbance(value: number) {
    if (value < 0.0001 || value > 1) return;
    this.#perturbance = value;
  }
  /**
   * 扰动系数
   */
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
  /**
   * 扩散半径
   */
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
  /**
   * 闲置波动
   */
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
  /**
   * 雨滴落下的时间间隔
   */
  get raindropsTimeInterval(): number {
    return this.#raindropsTimeInterval;
  }

  /**  crossOrigin  （是否跨域） */
  crossOrigin: ImageCrossOrigin = 'no-cors';
  /**  canvas 的显隐  */
  visible: boolean = false;
  /**  当前执行的状态  */
  running: boolean = false;

  /**  当前执行的状态  */
  set playingState(value: boolean) {
    this.running = Boolean(value ?? true);
  }
  /**
   * 当前执行的状态
   */
  get playingState(): boolean {
    return this.running;
  }
  /**  上一次执行渲染状态  */
  lastRunningState: boolean = false;

  /**
   * 构建使用参数的数据
   */
  constructor(options: RipplesUseOptions) {
    this.perturbance = options.perturbance;
    this.resolution = options.resolution;
    this.raindropsTimeInterval = options.raindropsTimeInterval;
    this.accelerating = options.accelerating;
    this.interactive = options.interactive;
    this.dropRadius = options.dropRadius;
    this.imageUrl = options.imageUrl;
    this.idleFluctuations = options.idleFluctuations;
    this.running = Boolean(options.playingState ?? true);
    this.crossOrigin = options.crossOrigin;
  }
}
