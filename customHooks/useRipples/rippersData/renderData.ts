import { OriginStyle } from '../buildBackground/type';
import { Ripples } from '../ripplesClass';
import { Program, Textures } from '../types';
import { dog } from 'dog';
import { getBackgroundStyles } from '../buildBackground/getBackgroundStyle';
import { enArr } from 'a-js-tools';
import { isEmptyArray } from 'a-type-of-js';
/**
 *
 * 原始数据类
 *
 * 记录了除参数数据外的运行数据
 *
 */
export class RipplesRenderData {
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
  /**  canvas 父级元素 该值在主 class 中初始化 */
  parentElement: HTMLElement;
  /**  父级元素的属性变化监听者  */
  mutationObserver: null | MutationObserver;
  /**  父级尺寸变化监听者  */
  resizeObserver: null | ResizeObserver;
  /**  背景页面的数据  */
  backgroundInfo: {
    width: number;
    height: number;
  } = {
    width: 0,
    height: 0,
  };

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
  /**  最原始的样式  */
  originStyle: OriginStyle;
  /**  上一次使用的样式  */
  lastUseStyle: OriginStyle;

  /** 事件  */
  events: {
    mousemove: (e: MouseEvent) => void;
    mousedown: (e: MouseEvent) => void;
    touchmove: (e: TouchEvent) => void;
    touchstart: (e: TouchEvent) => void;
  } = {} as never;

  /**  渲染 id  */
  animationFrameId: number = 0;
  /**  缺省背景图时的 id  */
  transparentId: NodeJS.Timeout = setTimeout(Boolean);
  /**  上一个绘制的图像  */
  lastDrawImage: HTMLCanvasElement | null = null;
  /**  当前绘制的图像  */
  currentDrawImage: HTMLCanvasElement | null = null;
  /**  绘制进度  */
  drawProgress: number = 0;
  /**  是否处于绘制过渡状态  */
  isTransitioning: boolean = false;

  /**
   * 构建 Ripple 的渲染数据
   *
   * @param canvas 使用初始化的 Canvas 元素
   * @param callback 执行的回调，这里要对页面背景进行更新
   * @param callbackThis  上一个回调在使用中的 this
   */
  constructor(canvas: HTMLCanvasElement, callback: () => void, callbackThis: Ripples) {
    this.parentElement = canvas.parentElement ?? document.body;
    {
      // 获取边界尺寸
      const styles = getComputedStyle(this.parentElement);
      this.backgroundInfo = {
        width: parseInt(styles.width),
        height: parseInt(styles.height),
      };
    }
    this.originStyle = this.lastUseStyle = getBackgroundStyles(this.parentElement);
    // 注册监听属性变化
    this.mutationObserver = new MutationObserver(mutations => {
      /**  变化值  */
      mutations.forEach(mutation => {
        if (mutation.target !== this.parentElement) return;
        if (mutation.type === 'attributes') {
          dog('父级元素的属性变更');
          /**  上一次使用的值  */
          const lastStyleValues = Object.values(this.lastUseStyle);
          /**  现在的样式  */
          const currentStye = getBackgroundStyles(this.parentElement);
          /** 本次的样式值  */
          const currentStyleValues = Object.values(currentStye);
          if (!isEmptyArray(enArr.difference(lastStyleValues, currentStyleValues))) {
            dog('由于样式不同触发了真实的事件回调');
            this.lastUseStyle = currentStye; // 赋新值
            Reflect.apply(callback, callbackThis, []); // 触发事件
          }
        }
      });
    });
    // 开始监听属性变化
    this.mutationObserver.observe(this.parentElement, {
      subtree: true, // 不监听子元素的变化
      attributes: true, // 监听属性的变化
      attributeFilter: ['class', 'style'], // 监听的属性
    });
    // 监听尺寸变化
    this.resizeObserver = new ResizeObserver(() => {
      // dog('监听的父级元素发生了尺寸变化');
      Reflect.apply(callback, callbackThis, []);
    });
    this.resizeObserver.observe(this.parentElement);
  }
}
