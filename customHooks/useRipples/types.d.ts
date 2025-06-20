/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName react-ripples
 * @FileName interface.ts
 * @CreateDate  周二  12/17/2024
 * @Description BackgroundRipples 的类型声明文件
 ****************************************************************************/

import { CSSProperties, ReactElement } from 'react';

/**
 *
 *  背景涟漪的 props 类型
 *
 * - children  可选属性，定义子组件或子组件们
 * - style     可选属性，定义自定义外壳的样式，在内含 `children` 时生效
 * - option    可选属性，自定义涟漪的初始化属性
 *    - resolution 分辨率,纹理的尺寸，该项目中该值为纹理的宽和高，缺省为 `256`
 *    - dropRadius 扩撒半径，缺省值为 `20`
 *    - perturbance 扰动系数，缺省为   `0.03`
 *    - interactive 光标交互，缺省为 `true` ，关闭须显示传入 `false` 值
 *    - accelerating  加速光标移动触发，缺省为 `1`
 *    - crossOrigin 原始样式
 *    - imageUrl    原始背景图片地址
 *    - playingState 当前的播放状态，缺省为 `true` ，设定为 `false` 时并不关闭，而是暂停
 *    - raindropsTimeInterval 雨滴滴落的间隔，缺省为 `3600`，可设置区间为 `10 ~ 12000`
 *    - idleFluctuations  闲置波动，在光标交互不触发时，将触发模拟雨滴，缺省为 `true`
 *
 */
export interface BackgroundRipplesProps {
  /**
   * 用于设定外层的样式
   */
  style?: CSSProperties;

  /**  子元素  */
  children?: ReactDOM;
  /**
   * ## 可设定涟漪的参数
   *
   * - resolution 分辨率,纹理的尺寸，该项目中该值为纹理的宽和高，缺省为 `256`
   * - dropRadius 扩撒半径，缺省值为 `20`
   * - perturbance 扰动系数，缺省为   `0.03`
   * - interactive 光标交互，缺省为 `true` ，关闭须显示传入 `false` 值
   * - accelerating  加速光标移动触发，缺省为 `1`
   * - crossOrigin 原始样式
   * - imageUrl    原始背景图片地址
   * - playingState 当前的播放状态，缺省为 `true` ，设定为 `false` 时并不关闭，而是暂停
   * - raindropsTimeInterval 雨滴滴落的间隔，缺省为 `3600`，可设置区间为 `10 ~ 12000`
   * - idleFluctuations  闲置波动，在光标交互不触发时，将触发模拟雨滴，缺省为 `true`
   */
  option?: RipplesOptions;
}

/**
 *
 * WebGLProgram
 *
 */
export interface Program {
  id: WebGLProgram;
  uniforms: { [x: string]: Float32Array };
  locations: {
    [x: string]: WebGLUniformLocation;
  };
}
/**
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
 */
export interface RipplesOptions {
  /**
   * 分辨率
   *
   * 纹理的尺寸，该项目中该值为纹理的宽和高
   *
   * 缺省为 `256`
   */
  resolution?: number;
  /**
   * 扩散半径
   *
   * 缺省为 `20`
   */
  dropRadius?: number;
  /**
   * 扰动系数
   *
   * 缺省 `0.03`
   *
   * 取之范围 `0.01 - 1`
   */
  perturbance?: number;
  /**
   * 是否开启光标滑动轨迹
   *
   * 缺省为  `true`
   */
  interactive?: boolean;
  /**
   * 加速光标移动触发，缺省为 `3`
   *
   *
   * 由于大佬原方法在光标触发 mousemove 时不怎么明显
   *
   * 所以以倍级触发会让波动更加明显
   *
   * 可设置区间为 `2 - 100`
   */
  accelerating?: number;
  /**
   *  原设定的背景图片
   *
   * 缺省为 `''`
   */
  crossOrigin?: string;
  /**
   * 设定的元素背景的 url 地址
   *
   * 缺省为 `''`
   */
  imageUrl?: string;
  /**
   * 当前涟漪的状态
   *
   * 缺省为 `true` ， 即涟漪触发正在执行
   */
  playingState?: boolean;
  /**
   * 雨滴滴落的时间间隔
   *
   * 单位为 ms
   *
   * 缺省值为 `3600`
   *
   * 可设置区间为 `10 ~ 12000`
   */
  raindropsTimeInterval?: number;
  /**
   *  闲置波动
   *
   * 在光标交互不触发时，将触发模拟雨滴
   *
   * 缺省为 `true`
   */
  idleFluctuations?: boolean;
}

/**
 * 初始默认值
 */
export interface RipplesDefaultData {
  imageUrl: '';
  resolution: 256;
  dropRadius: 10;
  perturbance: 0.03;
  interactive: true;
  crossOrigin: '';
  playingState: true;
  accelerating: 1;
  raindropsTimeInterval: 3600;
  idleFluctuations: true;
}

/**
 *
 */

export type Textures = WebGLTexture[];
