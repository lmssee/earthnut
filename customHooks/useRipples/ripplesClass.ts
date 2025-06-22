/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName website
 * @FileName ripples/index.ts
 * @CreateDate  周六  12/07/2024
 * @Description ripples 水涟漪效果
 ****************************************************************************/
import { setCanvasStyle } from './tools';
import { RipplesData } from './rippersData';
import { RipplesOptions } from './types';
import { getRandomInt } from 'a-js-tools';
import { defaultData } from './defaultData';
import { loadImage } from './init/loadImage';
import { hideCssBackground } from './init/hideCssBackground';
import { RipplesRenderData } from './rippersData/renderData';
import { isFalse, isNull } from 'a-type-of-js';
import { initGL } from './init';
import { dog } from './../../dog';
import { updateSize } from './callback/update-size';
import { destroy } from './callback/destroy';
import { restoreCssBackground } from './callback/restoreCssBackground';
import { drop } from './callback/drop';

/**
 *
 * ## 水波动涟漪的效果
 *
 * 魔改自大佬的[jQuey 代码](https://github.com/sirxemic/jquery.ripples)
 */
export class Ripples extends RipplesData {
  /**  渲染数据  */
  renderData: RipplesRenderData | null = null;

  defaults = defaultData;

  /**  初始化状态  */
  initialized: boolean = false;

  /**
   * 构建 Ripple 对象
   */
  constructor(canvas: HTMLCanvasElement, options?: RipplesOptions) {
    super(canvas);
    dog('初始化参数', options);
    /// 定义不可写的默认值
    Object.defineProperties(this, {
      defaults: {
        value: this.defaults,
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });

    // 数据初始化
    this.renderData = new RipplesRenderData({
      ...this.defaults,
      ...options,
    });

    if (
      isFalse(this.initState) ||
      isNull(canvas.parentElement) ||
      isNull(this.config) ||
      isNull(this.gl)
    )
      this.initState = false;
    else {
      this.renderData.parentElement = canvas.parentElement;
      setCanvasStyle(canvas); /// 设置 canvas 的样式
      /// 初始化 gl 及渲染粒子（动画）
      Reflect.apply(initGL, this, []);
    }
  }

  /** 模拟雨滴下落  */
  raindropsFall() {
    const { renderData } = this;
    if (isNull(renderData)) return;
    const parent = renderData.parentElement;
    const style = window.getComputedStyle(parent);
    const getValue = (str: string) => getRandomInt(parseInt(str));
    const left = style.width,
      top = style.height;
    this.drop(getValue(left), getValue(top), renderData.dropRadius, 0.03);
  }

  /** 公共方法，触发 */
  drop(x: number, y: number, radius: number, strength: number) {
    Reflect.apply(drop, this, [x, y, radius, strength]);
  }

  /** 元素的尺寸发生变化  */
  updateSize() {
    Reflect.apply(updateSize, this, []);
  }

  /**  销毁  */
  destroy() {
    Reflect.apply(destroy, this, []);
  }

  /**  展示元素 */
  show() {
    if (isNull(this.renderData)) return;
    this.renderData.visible = true;
    this.canvas.style.visibility = 'visible';
    Reflect.apply(hideCssBackground, this, []);
  }

  /** 隐藏元素 */
  hide() {
    if (isNull(this.renderData)) return;
    this.renderData.visible = false;
    this.canvas.style.visibility = 'hidden';
    Reflect.apply(restoreCssBackground, this, []); /// 恢复父级节点的背景样式
  }

  /** 暂停动画涟漪状态   */
  pause() {
    if (isNull(this.renderData)) return;
    this.renderData.running = false;
  }

  /**  播放动画涟漪状态  */
  play() {
    if (isNull(this.renderData)) return;
    this.renderData.running = true;
  }
  /** 切换当前状态   */
  changePlayingState() {
    const { renderData } = this;
    if (isNull(renderData)) return;
    dog('当前执行切换状态');
    renderData.running = !renderData.running;
    dog('更新后的状态', renderData.running);
  }
  /**  给初始化变量赋值  */
  set(property: keyof RipplesOptions, value: unknown) {
    if (isNull(this.renderData)) return;
    if (property === 'imageUrl') {
      this.renderData.imageUrl = value as string;
      Reflect.apply(loadImage, this, []);
    } else
      /**  @ts-ignore: 忽略这个错误  */
      this.renderData[property] = value;
  }
}
