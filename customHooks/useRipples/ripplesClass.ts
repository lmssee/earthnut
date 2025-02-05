/****************************************************************************
 * @Author lmssee
 * @Email lmssee@outlook.com
 * @ProjectName website
 * @FileName ripples/index.ts
 * @CreateDate  周六  12/07/2024
 * @Description ripples 水涟漪效果
 ****************************************************************************/

import { bindTexture, setCanvasStyle } from './tools';
import { RipplesData } from './rippersData';
import { Program, RipplesOptions } from './types';
import { getRandomInt } from 'a-js-tools';
import { defaultData } from './defaultData';
import { drawQuad } from './render/drawQuad';
import { swapBufferIndices } from './render/swapBufferIndices';
import { loadImage } from './init/loadImage';
import { hideCssBackground, restoreCssBackground } from './init/hideCssBackground';
import { RipplesRenderData, ripplesRenderDataWarehouse } from './rippersData/renderData';
import { initGL } from './init/initGL';

/**************************************
 *
 * ## 水波动涟漪的效果
 *
 *
 * 魔改自大佬的[代码](https://github.com/sirxemic/jquery.ripples)
 **************************************/
export class Ripples extends RipplesData {
  /**************************
   * 唯一标识
   *
   * 用于处理 Ripples 在实例化后数据交叉污染问题
   **************************/
  sole: symbol = Symbol('ripple');
  /**************************
   *
   *  默认值
   *
   * - resolution 分辨率,纹理的尺寸，该项目中该值为纹理的宽和高，缺省为 `256`
   * - dropRadius 扩撒半径，缺省值为 `20`
   * - perturbance 扰动系数，缺省为   `0.03`
   * - interactive 光标交互，缺省为 `true` ，关闭须显示传入 `false` 值
   * - crossOrigin 原始样式
   * - imageUrl    原始背景图片地址
   * - playingState 当前的播放状态，缺省为 `true` ，设定为 `false` 时并不关闭，而是暂停
   * - accelerating  加速光标移动触发，缺省为 `1`
   * - raindropsTimeInterval 雨滴滴落的间隔，缺省为 `3600`，可设置区间为 `10 ~ 12000`
   * - idleFluctuations  闲置波动，在光标交互不触发时，将触发模拟雨滴，缺省为 `true`
   **************************/

  defaults = defaultData;
  /**  是否与鼠标互动  */
  interactive: boolean = this.defaults.interactive;

  /**************************
   * 倍级触发光标事件
   **************************/
  set accelerating(value: number) {
    if (value > 100 || value < 2) return;

    ripplesRenderDataWarehouse[this.sole].accelerating = value;
  }
  /**  分辨率
   *
   * 纹理的尺寸，该项目中该值为纹理的宽和高
   *
   */
  set resolution(value: number) {
    if (value < 100 || value > 550) return;
    ripplesRenderDataWarehouse[this.sole].resolution = value;
  }

  /**   扰动系数  */
  set perturbance(value: number) {
    if (value < 0.0001 || value > 1) return;
    ripplesRenderDataWarehouse[this.sole].perturbance = value;
  }
  /**  扩散半径  */
  dropRadius: number;
  /**  原始 css  */
  crossOrigin: string = '';
  /**  传入的背景图片  */
  imageUrl: string | null;
  /**  闲置波动  */
  idleFluctuations: boolean = true;
  /**  当前播放的状态  */
  set playingState(value: boolean) {
    ripplesRenderDataWarehouse[this.sole].running = value !== false;
  }

  /**    */
  /**  初始化状态  */
  #initialized: boolean = false;

  /**  初始化状态  */
  get initialized() {
    return this.#initialized;
  }

  imageSource: string = '';
  renderProgram!: Program;

  set raindropsTimeInterval(value: number) {
    if (value < 10 || value > 12000) return;
    ripplesRenderDataWarehouse[this.sole].raindropsTimeInterval = value;
  }

  constructor(canvas: HTMLCanvasElement, options?: RipplesOptions) {
    super(canvas);
    console.log('初始化参数', options);

    /**  数据初始化  */
    ripplesRenderDataWarehouse[this.sole] = new RipplesRenderData(defaultData);

    Object.defineProperties(this, {
      defaults: {
        value: this.defaults,
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });
    if (options) typeof options.interactive !== 'boolean' && delete options.interactive;

    /**  数据  */
    const data = {
      ...this.defaults,
      ...options,
    };

    /**************************************
     *
     * 涟漪设定参数
     *
     * - accelerating  加速光标移动触发，缺省为 `1`
     * - resolution 分辨率,纹理的尺寸，该项目中该值为纹理的宽和高，缺省为 `256`
     * - dropRadius 扩撒半径，缺省值为 `20`
     * - perturbance 扰动系数，缺省为   `0.03`
     * - interactive 光标交互，缺省为 `true` ，关闭须显示传入 `false` 值
     * - crossOrigin 原始样式
     * - imageUrl    原始背景图片地址
     * - playingState 当前的播放状态，缺省为 `true` ，设定为 `false` 时并不关闭，而是暂停
     * - raindropsTimeInterval 雨滴滴落的间隔，缺省为 `3600`，可设置区间为 `10 ~ 12000`
     * - idleFluctuations  闲置波动，在光标交互不触发时，将触发模拟雨滴，缺省为 `true`
     **************************************/
    this.accelerating = data.accelerating; // 倍级触发
    this.dropRadius = data.dropRadius; // 扩散半径
    this.resolution = data.resolution; // 分辨率
    this.interactive = data.interactive; // 是否与鼠标互动
    this.perturbance = data.perturbance; // 扰动系数
    this.crossOrigin = data.crossOrigin; // 原始 css
    this.imageUrl = data.imageUrl; // 传入的背景图片
    this.idleFluctuations = data.idleFluctuations; /// 是否开启闲置波动
    this.playingState = data.playingState; /// 当前的状态值
    this.raindropsTimeInterval = data.raindropsTimeInterval; ///

    if (
      this.initState === false ||
      canvas.parentElement === null ||
      this.config === null ||
      this.gl === null
    ) {
      this.initState = false;
      return;
    }
    ripplesRenderDataWarehouse[this.sole].parentElement = canvas.parentElement;
    setCanvasStyle(canvas); /// 设置 canvas 的样式
    Reflect.apply(initGL, this, []);
  }

  /**************************
   * 模拟雨滴下落
   **************************/
  raindropsFall() {
    const parent = ripplesRenderDataWarehouse[this.sole].parentElement;
    const style = window.getComputedStyle(parent);
    const getValue = (str: string) => getRandomInt(parseInt(str));
    const left = style.width,
      top = style.height;
    this.drop(getValue(left), getValue(top), this.dropRadius, 0.03);
  }

  /**************************
   * 公共方法，触发
   **************************/
  drop(x: number, y: number, radius: number, strength: number) {
    const gl = this.gl;
    const {
      resolution,
      parentElement,
      dropProgram,
      textures,
      framebuffers,
      bufferWriteIndex,
      bufferReadIndex,
    } = ripplesRenderDataWarehouse[this.sole];
    /**  元素的宽  */
    const parentWidth = parentElement.offsetWidth;
    /**  元素的高  */
    const parentHeight = parentElement.offsetHeight;
    /**  元素较长的一边  */
    const longestSide = Math.max(parentWidth, parentHeight);
    radius = radius / longestSide;
    const dropPosition = new Float32Array([
      (2 * x - parentWidth) / longestSide,
      (parentHeight - 2 * y) / longestSide,
    ]);

    gl.viewport(0, 0, resolution, resolution);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[bufferWriteIndex]);
    Reflect.apply(bindTexture, this, [textures[bufferReadIndex]]);
    gl.useProgram(dropProgram.id);
    gl.uniform2fv(dropProgram.locations.center, dropPosition);
    gl.uniform1f(dropProgram.locations.radius, radius);
    gl.uniform1f(dropProgram.locations.strength, strength);
    Reflect.apply(drawQuad, this, []);
    Reflect.apply(swapBufferIndices, this, []);
  }
  /**************************
   * 元素的尺寸发生变化
   **************************/
  updateSize() {
    const { parentElement } = ripplesRenderDataWarehouse[this.sole];
    const newWidth = parentElement.offsetWidth,
      newHeight = parentElement.offsetHeight;
    if (newWidth != this.canvas.width || newHeight != this.canvas.height) {
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
    }
  }

  /**************************
   * 销毁
   **************************/
  destroy() {
    if (ripplesRenderDataWarehouse[this.sole].animationFrameId)
      window.cancelAnimationFrame(ripplesRenderDataWarehouse[this.sole].animationFrameId);
    const { parentElement, events } = ripplesRenderDataWarehouse[this.sole];
    if (parentElement) {
      (Object.keys(events) as []).forEach(
        e => parentElement.removeEventListener && parentElement.removeEventListener(e, events[e]),
      );
      if (parentElement.removeAttribute) parentElement.removeAttribute('data-ripples');
    }
    if (this.styleElement) this.styleElement.remove(); /// 移除 style 元素
    this.gl = null as never; /// 销毁当前对  WebGLRenderingContext 的引用
    Reflect.apply(restoreCssBackground, this, []); /// 恢复父级节点的背景样式
    {
      const renderData = ripplesRenderDataWarehouse[this.sole];
      Object.keys(renderData).forEach(e => (renderData[e as never] = null as never));
      ripplesRenderDataWarehouse[this.sole] = null as never;
    }
    if (this.gl) this.gl = null as unknown as never; /// 销毁当前对  WebGLRenderingContext 的引用
    window.removeEventListener('resize', this.updateSize); /// 移除注册在 window 上的尺寸变化的事件
    // this.canvas.remove(); /// react 会自己管理移除元素
  }

  /**************************
   * 展示元素
   *
   * - 设置状态
   * - 设置 canvas 元素展示
   * - 隐藏父级节点背景
   **************************/
  show() {
    ripplesRenderDataWarehouse[this.sole].visible = true;
    this.canvas.style.visibility = 'visible';
    Reflect.apply(hideCssBackground, this, []);
  }

  /**************************
   * 隐藏元素
   *
   * - 设置状态
   * - 设置 canvas 元素隐藏
   * - 恢复父级节点背景
   **************************/
  hide() {
    ripplesRenderDataWarehouse[this.sole].visible = false;
    this.canvas.style.visibility = 'hidden';
    Reflect.apply(restoreCssBackground, this, []); /// 恢复父级节点的背景样式
  }

  /**************************
   * 暂停动画涟漪状态
   **************************/
  pause() {
    this.playingState = false;
  }
  /**************************
   * 播放动画涟漪状态
   **************************/
  play() {
    this.playingState = true;
  }
  /**************************
   * 切换当前状态
   **************************/
  changePlayingState() {
    this.playingState = !ripplesRenderDataWarehouse[this.sole].running;
  }
  /**************************
   *  给初始化变量赋值
   **************************/
  set(property: keyof RipplesOptions, value: unknown) {
    if (property === 'imageUrl') {
      this.imageUrl = value as string;
      Reflect.apply(loadImage, this, []);
    } else {
      this[property] = value as never;
    }
  }
}
