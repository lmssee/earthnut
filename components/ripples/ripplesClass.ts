/****************************************************************************
 * @Author lmssee
 * @Email lmssee@outlook.com
 * @ProjectName website
 * @FileName ripples/index.ts
 * @CreateDate  周六  12/07/2024
 * @Description ripples 水涟漪效果
 ****************************************************************************/

import {
  bindTexture,
  createProgram,
  extractUrl,
  isDataUri,
  isPercentage,
  setCanvasStyle,
  translateBackgroundPosition,
} from './tools';
import { RipplesData } from './rippersData';
import { Program, RipplesOptions } from './interface';
import { getRandomInt } from 'a-js-tools';
import { defaultData } from './defaultData';

/**************************************
 *
 * ## 水波动涟漪的效果
 *
 *
 * 魔改自大佬的[代码](https://github.com/sirxemic/jquery.ripples)
 **************************************/
export class Ripples extends RipplesData {
  /**************************
   *
   *  默认值
   *
   * - resolution 分辨率,纹理的尺寸，该项目中该值为纹理的宽和高，缺省为 `360`
   * - dropRadius 扩撒半径，缺省值为 `20`
   * - perturbance 扰动系数，缺省为   `0.03`
   * - interactive 光标交互，缺省为 `true` ，关闭须显示传入 `false` 值
   * - crossOrigin 原始样式
   * - imageUrl    原始背景图片地址
   * - playingState 当前的播放状态，缺省为 `true` ，设定为 `false` 时并不关闭，而是暂停
   * - accelerating  加速光标移动触发，缺省为 `3`
   * - raindropsTimeInterval 雨滴滴落的间隔，缺省为 `660`，可设置区间为 `10 ~ 12000`
   * - idleFluctuations  闲置波动，在光标交互不触发时，将触发模拟雨滴，缺省为 `true`
   **************************/
  defaults = defaultData;
  /**  是否与鼠标互动  */
  interactive: boolean = this.defaults.interactive;
  /**  倍级触发光标事件  */
  #accelerating: number = this.defaults.accelerating;
  /**************************
   * 倍级触发光标事件
   **************************/
  set accelerating(value: number) {
    if (value > 100 || value < 2) return;
    this.#accelerating = value;
  }

  #resolution: number = this.defaults.resolution;

  /**  分辨率
   *
   * 纹理的尺寸，该项目中该值为纹理的宽和高
   *
   */
  set resolution(value: number) {
    if (value < 100 || value > 550) return;
    this.#resolution = value;
  }
  /**  扰动系数  */
  #perturbance: number = this.defaults.perturbance;
  /**   扰动系数  */
  set perturbance(value: number) {
    if (value < 0.0001 || value > 1) return;
    this.#perturbance = value;
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
    this.#running = value !== false;
  }

  /** 节点元素  */
  #parentElement!: HTMLElement;
  /**  纹理增量  */
  #textureDelta: Float32Array<ArrayBuffer>;
  #textures: WebGLTexture[] = [];
  #framebuffers: WebGLFramebuffer[] = [];
  #bufferWriteIndex: number = 0;
  #bufferReadIndex: number = 1;
  /**  webGL 数据流  */
  #quad!: WebGLBuffer;
  /**  当前 canvas 元素是否可见  */
  #visible: boolean = false;
  /**  当前动画的执行状态  */
  #running: boolean = false;
  /**    */
  /**  初始化状态  */
  #initialized: boolean = false;

  /**  初始化状态  */
  get initialized() {
    return this.#initialized;
  }

  /**  animation 引用  */
  #animationFrameId = 0;

  #originalCssBackgroundImage: string = '';
  imageSource: string = '';
  renderProgram!: Program;
  /**  背景纹理  */
  #backgroundTexture!: WebGLTexture;
  #updateProgram!: Program;

  #dropProgram!: Program;
  /**  背景（图片）的宽度  */
  #backgroundWidth!: number;
  /**  背景的高度  */
  #backgroundHeight!: number;
  /**  元素行内样式  */
  #originalInlineCss!: string;
  /**************************
   * 上一次雨滴滴落的时间
   *
   * 该时间更新触发时机：
   * - 2.2s 内没有事件触发
   * - 鼠标交互更新
   **************************/
  #lastRaindropsFallTime: number = Date.now();

  /**************************
   * 雨滴醉落的时间间隔
   **************************/
  #raindropsTimeInterval: number = this.defaults.raindropsTimeInterval;

  set raindropsTimeInterval(value: number) {
    if (value < 10 || value > 12000) return;
    this.#raindropsTimeInterval = value;
  }

  /**************************
   * 绑定的事件
   **************************/
  #events = {
    mousemove: (e: MouseEvent) => console.log(e),
    mousedown: (e: MouseEvent) => console.log(e),
    touchmove: (e: TouchEvent) => console.log(e),
    touchstart: (e: TouchEvent) => console.log(e),
  };

  constructor(canvas: HTMLCanvasElement, children: boolean, options?: RipplesOptions) {
    super(canvas);
    Object.defineProperties(this, {
      defaults: {
        value: this.defaults,
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });
    if (options) {
      typeof options.interactive !== 'boolean' && delete options.interactive;
    }

    /**  数据  */
    const data = {
      ...this.defaults,
      ...options,
    };
    this.interactive = data.interactive; // 是否与鼠标互动
    this.resolution = data.resolution; // 分辨率
    this.perturbance = data.perturbance; // 扰动系数
    this.dropRadius = data.dropRadius; // 扩散半径
    this.crossOrigin = data.crossOrigin; // 原始 css
    this.imageUrl = data.imageUrl; // 传入的背景图片
    this.idleFluctuations = data.idleFluctuations; /// 是否开启闲置波动

    if (
      this.initState === false ||
      canvas.parentElement === null ||
      this.config === null ||
      this.gl === null
    ) {
      this.initState = false;
      return;
    }

    const gl = this.gl;
    const _resolution = 1 / this.#resolution;
    this.#textureDelta = new Float32Array([_resolution, _resolution]); // 纹理增量
    this.#parentElement = canvas.parentElement;
    setCanvasStyle(canvas); /// 设置 canvas 的样式
    /// 加载扩展
    this.config.extensions.forEach(currentName => gl.getExtension(currentName));
    this.updateSize = this.updateSize.bind(this); /// 大哥说这样可以让他变成新的
    window.addEventListener('resize', this.updateSize);

    const arrayType = this.config.arrayType;
    const textureData = arrayType ? new arrayType(this.#resolution * this.#resolution * 4) : null;
    const config = this.config;

    for (let i = 0; i < 2; i++) {
      /**  初始化 WebGLTexture 对象  */
      const texture = gl.createTexture();
      /**  初始化 WebGLFramebuffer 对象  */
      const framebuffer = gl.createFramebuffer();
      /**  将给定的 WebGLFramebuffer 绑定到目标  */
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      /**  将给定的 WebGLTexture 绑定给目标（绑定点）  */
      gl.bindTexture(gl.TEXTURE_2D, texture);
      /**  动画纹理  */
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        config.linearSupport ? gl.LINEAR : gl.NEAREST,
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MAG_FILTER,
        config.linearSupport ? gl.LINEAR : gl.NEAREST,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      /** (指定二维纹理图像)[https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texImage2D]   */
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        this.#resolution,
        this.#resolution,
        0,
        gl.RGBA,
        config.type,
        textureData,
      );

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

      this.#textures.push(texture);
      this.#framebuffers.push(framebuffer);
    }

    // Init GL stuff
    this.#quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, +1, -1, +1, +1, -1, +1]),
      gl.STATIC_DRAW,
    );

    this.#initShaders();
    this.#initTexture();
    this.#setTransparentTexture();

    // Load the image either from the options or CSS rules
    this.#loadImage();

    // Set correct clear color and blend mode (regular alpha blending)
    gl.clearColor(0, 0, 0, 0);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // 插件初始化成功
    this.#visible = true;
    this.#running = true;
    this.#initialized = true;
    this.#setupPointerEvents(); /// 初始化监听事件
    this.#animationFrameId = requestAnimationFrame(() => this.#step());
  }

  /**************************
   * 初始化事件
   **************************/
  #setupPointerEvents() {
    const pointerEventsEnabled = () => this.#visible && this.#running && this.interactive;
    const dropAtPointer = (pointer: MouseEvent | Touch, big: boolean = false) => {
      if (pointerEventsEnabled()) {
        this.#lastRaindropsFallTime = Date.now(); /// 更新上一次触发时机，延迟主动触发的雨滴
        this.#dropAtPointer(pointer, this.dropRadius * (big ? 1.5 : 1), big ? 0.14 : 0.01);
      }
    };

    this.#events.mousemove = (e: MouseEvent) => {
      for (let i = this.#accelerating; i--; ) dropAtPointer(e);
    };
    this.#events.touchmove = this.#events.touchstart = (e: TouchEvent) => {
      const touches = e.touches;
      for (let i = 0; i < touches.length; i++) dropAtPointer(touches[i]);
    };
    this.#events.mousedown = e => dropAtPointer(e, true);

    (Object.keys(this.#events) as []).forEach(
      e => this.#parentElement && this.#parentElement.addEventListener(e, this.#events[e]),
    );
  }
  #loadImage() {
    const gl = this.gl;
    const newImageSource: string | null =
      this.imageUrl ||
      extractUrl(this.#originalCssBackgroundImage) ||
      extractUrl(window.getComputedStyle(this.#parentElement).backgroundImage);
    // 倘若图片资源未更改，则无需从新下载
    if (newImageSource === this.imageSource) return;
    this.imageSource = newImageSource!;
    // 虚假来源意味着没有背景。
    if (!this.imageSource) {
      this.#setTransparentTexture();
      return;
    }
    // 从新图像加载纹理。
    const image = new Image();
    image.onload = () => {
      /**  只有维度为 2 的幂的纹理才能重复换行  */
      const isPowerOfTwo = (x: number) => (x & (x - 1)) === 0;
      const wrapping =
        isPowerOfTwo(image.width) && isPowerOfTwo(image.height) ? gl.REPEAT : gl.CLAMP_TO_EDGE;
      gl.bindTexture(gl.TEXTURE_2D, this.#backgroundTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      this.#backgroundWidth = image.width;
      this.#backgroundHeight = image.height;
      // 隐藏我们要替换的背景。
      this.#hideCssBackground();
    };

    // Fall back to a transparent texture when loading the image failed.
    image.onerror = () => this.#setTransparentTexture();

    // 当图像源是数据 URI 时禁用 CORS。
    image.crossOrigin = isDataUri(this.imageSource) ? null : this.crossOrigin;
    image.src = this.imageSource;
  }

  /**************************
   * 开启绘制
   **************************/
  #step(this: Ripples) {
    if (!this.#visible) return;
    this.#computeTextureBoundaries();
    if (this.#running) this.#update();
    this.#render();
    this.#animationFrameId = requestAnimationFrame(() => this.#step());
  }

  /**************************
   * 绘制四方形
   **************************/
  #drawQuad() {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#quad);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
  /**************************
   * 绘制
   **************************/
  #render() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.enable(gl.BLEND);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.renderProgram.id);

    Reflect.apply(bindTexture, this, [this.#backgroundTexture, 0]);
    Reflect.apply(bindTexture, this, [this.#textures[0], 1]);

    gl.uniform1f(this.renderProgram.locations.perturbance, this.#perturbance);
    gl.uniform2fv(this.renderProgram.locations.topLeft, this.renderProgram.uniforms.topLeft);
    gl.uniform2fv(
      this.renderProgram.locations.bottomRight,
      this.renderProgram.uniforms.bottomRight,
    );
    gl.uniform2fv(
      this.renderProgram.locations.containerRatio,
      this.renderProgram.uniforms.containerRatio,
    );
    gl.uniform1i(this.renderProgram.locations.samplerBackground, 0);
    gl.uniform1i(this.renderProgram.locations.samplerRipples, 1);
    this.#drawQuad();
    gl.disable(gl.BLEND);
  }
  /**************************
   * 更新数据
   **************************/
  #update() {
    if (this.idleFluctuations) {
      const now = Date.now();
      /**  模拟雨滴坠落  */
      if (now - this.#lastRaindropsFallTime > this.#raindropsTimeInterval) {
        this.#lastRaindropsFallTime = now;
        this.raindropsFall();
      }
    }
    const gl = this.gl;
    gl.viewport(0, 0, this.#resolution, this.#resolution);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.#framebuffers[this.#bufferWriteIndex]);
    Reflect.apply(bindTexture, this, [this.#textures[this.#bufferReadIndex]]);
    gl.useProgram(this.#updateProgram.id!);
    this.#drawQuad();
    this.#swapBufferIndices();
  }
  /**************************
   * swap 缓冲区索引
   **************************/
  #swapBufferIndices() {
    this.#bufferWriteIndex = 1 - this.#bufferWriteIndex;
    this.#bufferReadIndex = 1 - this.#bufferReadIndex;
  }

  /**************************
   * 计算纹理边界
   **************************/
  #computeTextureBoundaries() {
    /** 父元素样式 background-size 的值 */
    const backgroundSize = window.getComputedStyle(this.#parentElement).backgroundSize;
    /** 父元素样式 background-attachment 的值  */
    const backgroundAttachment = window.getComputedStyle(this.#parentElement).backgroundAttachment;
    /** 父元素样式 background-position 的值  */
    const backgroundPosition = translateBackgroundPosition(
      window.getComputedStyle(this.#parentElement).backgroundPosition,
    );

    // 这里的 'container' 是背景适应的元素
    // （Chrome 窗口或某些元素，具体取决于附件）
    const container =
      backgroundAttachment == 'fixed'
        ? {
            left: window.scrollX,
            top: window.scrollY,
            width: window.innerWidth,
            height: window.innerHeight,
          }
        : {
            left: this.#parentElement.getBoundingClientRect().left,
            top: this.#parentElement.getBoundingClientRect().top,
            width: this.#parentElement.scrollWidth,
            height: this.#parentElement.scrollHeight,
          };

    // TODO: background-clip

    let backgroundWidth: string | number, backgroundHeight: string | number;

    if (backgroundSize == 'cover') {
      const scale = Math.max(
        container.width / this.#backgroundWidth,
        container.height / this.#backgroundHeight,
      );

      backgroundWidth = this.#backgroundWidth * scale;
      backgroundHeight = this.#backgroundHeight * scale;
    } else if (backgroundSize == 'contain') {
      const scale = Math.min(
        container.width / this.#backgroundWidth,
        container.height / this.#backgroundHeight,
      );

      backgroundWidth = this.#backgroundWidth * scale;
      backgroundHeight = this.#backgroundHeight * scale;
    } else {
      const _backgroundSize = backgroundSize.split(' ');
      backgroundWidth = _backgroundSize[0] || '';
      backgroundHeight = _backgroundSize[1] || backgroundWidth;

      if (isPercentage(backgroundWidth)) {
        backgroundWidth = (container.width * parseFloat(backgroundWidth)) / 100;
      } else if (backgroundWidth !== 'auto') {
        backgroundWidth = parseFloat(backgroundWidth);
      }

      if (isPercentage(backgroundHeight)) {
        backgroundHeight = (container.height * parseFloat(backgroundHeight)) / 100;
      } else if (backgroundHeight !== 'auto') {
        backgroundHeight = parseFloat(backgroundHeight);
      }

      if (backgroundWidth == 'auto' && backgroundHeight == 'auto') {
        backgroundWidth = this.#backgroundWidth;
        backgroundHeight = this.#backgroundHeight;
      } else {
        if (backgroundWidth == 'auto') {
          backgroundWidth =
            this.#backgroundWidth * (Number(backgroundHeight) / this.#backgroundHeight);
        }

        if (backgroundHeight == 'auto') {
          backgroundHeight =
            this.#backgroundHeight * (Number(backgroundWidth) / this.#backgroundWidth);
        }
      }
    }

    // 计算 backgroundX 及 backgroundY 在的值
    let backgroundX = (backgroundPosition && backgroundPosition[0]) || '0%';
    let backgroundY = (backgroundPosition && backgroundPosition[1]) || '0%';

    if (isPercentage(backgroundX)) {
      backgroundX = (
        container.left +
        ((container.width - Number(backgroundWidth)) * parseFloat(backgroundX)) / 100
      ).toString();
    } else {
      backgroundX = (container.left + parseFloat(backgroundX)).toString();
    }

    if (isPercentage(backgroundY)) {
      backgroundY = (
        container.top +
        ((container.height - Number(backgroundHeight)) * parseFloat(backgroundY)) / 100
      ).toString();
    } else {
      backgroundY = (container.top + parseFloat(backgroundY)).toString();
    }

    this.renderProgram.uniforms.topLeft = new Float32Array([
      (this.#parentElement.offsetLeft - Number(backgroundX)) / Number(backgroundWidth),
      (this.#parentElement.offsetTop - Number(backgroundY)) / Number(backgroundHeight),
    ]);
    this.renderProgram.uniforms.bottomRight = new Float32Array([
      this.renderProgram.uniforms.topLeft[0] +
        this.#parentElement.clientWidth / Number(backgroundWidth),
      this.renderProgram.uniforms.topLeft[1] +
        this.#parentElement.clientHeight / Number(backgroundHeight),
    ]);

    const maxSide: number = Math.max(this.canvas.width, this.canvas.height);

    this.renderProgram.uniforms.containerRatio = new Float32Array([
      this.canvas.width / maxSide,
      this.canvas.height / maxSide,
    ]);
  }

  /**************************
   * 初始化着色器
   **************************/
  #initShaders() {
    const gl = this.gl;

    const vertexShader = `
      attribute vec2 vertex;
      varying vec2 coord;
      void main() {
        coord = vertex * 0.5 + 0.5;
        gl_Position = vec4(vertex, 0.0, 1.0);
      }`;

    this.#dropProgram = createProgram(
      vertexShader,
      `precision highp float;

      const float PI = 3.141592653589793;
      uniform sampler2D texture;
      uniform vec2 center;
      uniform float radius;
      uniform float strength;

      varying vec2 coord;

      void main() {
        vec4 info = texture2D(texture, coord);

        float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);
        drop = 0.5 - cos(drop * PI) * 0.5;
        info.r += drop * strength;
        gl_FragColor = info;
      }`,
      gl,
    );

    this.#updateProgram = createProgram(
      vertexShader,
      `precision highp float;

      uniform sampler2D texture;
      uniform vec2 delta;

      varying vec2 coord;

      void main() {
        vec4 info = texture2D(texture, coord);
  
        vec2 dx = vec2(delta.x, 0.0);
        vec2 dy = vec2(0.0, delta.y);
  
        float average = (
          texture2D(texture, coord - dx).r +
          texture2D(texture, coord - dy).r +
          texture2D(texture, coord + dx).r +
          texture2D(texture, coord + dy).r
        ) * 0.25;
  
        info.g += (average - info.r) * 2.0;
        info.g *= 0.995;
        info.r += info.g;
  
        gl_FragColor = info;
      }
      `,
      this.gl!,
    );
    gl.uniform2fv(this.#updateProgram.locations!.delta, this.#textureDelta);

    this.renderProgram = createProgram(
      `
        precision highp float;

        attribute vec2 vertex;
        uniform vec2 topLeft;
        uniform vec2 bottomRight;
        uniform vec2 containerRatio;
        varying vec2 ripplesCoord;
        varying vec2 backgroundCoord;
        void main() {
          backgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);
          backgroundCoord.y = 1.0 - backgroundCoord.y;
          ripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;
          gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);
        }
      `,
      `
        precision highp float;

        uniform sampler2D samplerBackground;
        uniform sampler2D samplerRipples;
        uniform vec2 delta;

        uniform float perturbance;
        varying vec2 ripplesCoord;
        varying vec2 backgroundCoord;

        void main() {
          float height = texture2D(samplerRipples, ripplesCoord).r;
          float heightX = texture2D(samplerRipples, vec2(ripplesCoord.x + delta.x, ripplesCoord.y)).r;
          float heightY = texture2D(samplerRipples, vec2(ripplesCoord.x, ripplesCoord.y + delta.y)).r;
          vec3 dx = vec3(delta.x, heightX - height, 0.0);
          vec3 dy = vec3(0.0, heightY - height, delta.y);
          vec2 offset = -normalize(cross(dy, dx)).xz;
          float specular = pow(max(0.0, dot(offset, normalize(vec2(-0.6, 1.0)))), 4.0);
          gl_FragColor = texture2D(samplerBackground, backgroundCoord + offset * perturbance) + specular;
        }`,
      gl,
    );
    gl.uniform2fv(this.renderProgram.locations.delta, this.#textureDelta);
  }

  /**************************
   * 初始化纹理
   **************************/
  #initTexture() {
    const gl = this.gl;

    this.#backgroundTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.#backgroundTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
  /**************************
   * 设置透明的纹理
   **************************/
  #setTransparentTexture() {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.#backgroundTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.transparentPixels);
  }

  /**************************
   * 隐藏背景
   **************************/
  #hideCssBackground() {
    // 检测是否更改了行内样式或是重写了该样式
    const inlineCss = this.#parentElement.style.backgroundImage;
    if (inlineCss == 'none') return;
    this.#originalInlineCss = inlineCss;
    this.#originalCssBackgroundImage = window.getComputedStyle(this.#parentElement).backgroundImage;
    this.#parentElement.style.backgroundImage = 'none';
  }

  /**************************
   * 恢复背景样式
   **************************/
  #restoreCssBackground() {
    this.#parentElement.style.backgroundImage = this.#originalInlineCss || '';
  }

  /**************************
   * 触发的点
   **************************/
  #dropAtPointer(pointer: MouseEvent | Touch, radius: number, strength: number) {
    const style = window.getComputedStyle(this.#parentElement);
    const borderLeft = parseInt(style.borderLeftWidth) || 0,
      borderTop = parseInt(style.borderTopWidth) || 0;
    /**************************
     *
     * pointer.pageX 点击事件触发的位置相对于页面来说的，包含滚动的距离
     * this.#parentElement.offsetLeft 父元素左上角相对于定位元素的左边界偏移像素值
     * borderLeft 边框的宽度
     **************************/
    this.drop(
      pointer.pageX - this.#parentElement.offsetLeft - borderLeft,
      pointer.pageY - this.#parentElement.offsetTop - borderTop,
      radius,
      strength,
    );
  }
  /**************************
   * 模拟雨滴下落
   **************************/
  raindropsFall() {
    const style = window.getComputedStyle(this.#parentElement);
    const getValue = (str: string) => getRandomInt(parseInt(str));
    const left = style.width,
      top = style.height;
    this.drop(getValue(left), getValue(top), this.dropRadius * 1.5, 0.14);
  }

  /**************************
   * 公共方法，触发
   **************************/
  drop(x: number, y: number, radius: number, strength: number) {
    const gl = this.gl;
    /**  元素的宽  */
    const parentWidth = this.#parentElement.offsetWidth;
    /**  元素的高  */
    const parentHeight = this.#parentElement.offsetHeight;
    /**  元素较长的一边  */
    const longestSide = Math.max(parentWidth, parentHeight);

    radius = radius / longestSide;
    const dropPosition = new Float32Array([
      (2 * x - parentWidth) / longestSide,
      (parentHeight - 2 * y) / longestSide,
    ]);

    gl.viewport(0, 0, this.#resolution, this.#resolution);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.#framebuffers[this.#bufferWriteIndex]);
    Reflect.apply(bindTexture, this, [this.#textures[this.#bufferReadIndex]]);

    gl.useProgram(this.#dropProgram.id);
    gl.uniform2fv(this.#dropProgram.locations.center, dropPosition);
    gl.uniform1f(this.#dropProgram.locations.radius, radius);
    gl.uniform1f(this.#dropProgram.locations.strength, strength);

    this.#drawQuad();

    this.#swapBufferIndices();
  }
  /**************************
   * 元素的尺寸发生变化
   **************************/
  updateSize() {
    const newWidth = this.#parentElement.offsetWidth,
      newHeight = this.#parentElement.offsetHeight;
    if (newWidth != this.canvas.width || newHeight != this.canvas.height) {
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
    }
  }

  /**************************
   * 销毁
   **************************/
  destroy() {
    const _parent = this.#parentElement;
    if (_parent) {
      (Object.keys(this.#events) as []).forEach(
        e => _parent.removeEventListener && _parent.removeEventListener(e, this.#events[e]),
      );
      if (_parent.removeAttribute) _parent.removeAttribute('data-ripples');
    }
    if (this.styleElement) this.styleElement.remove(); /// 移除 style 元素
    this.gl = null as never; /// 销毁当前对  WebGLRenderingContext 的引用
    if (this.gl) this.gl = null as unknown as never; /// 销毁当前对  WebGLRenderingContext 的引用
    window.removeEventListener('resize', this.updateSize); /// 移除注册在 window 上的尺寸变化的事件
    // this.canvas.remove(); /// react 会自己管理移除元素
    this.#restoreCssBackground(); /// 恢复父级节点的背景样式
    if (this.#animationFrameId) window.cancelAnimationFrame(this.#animationFrameId); /// 清理 animationFrame
  }

  /**************************
   * 展示元素
   *
   * - 设置状态
   * - 设置 canvas 元素展示
   * - 隐藏父级节点背景
   **************************/
  show() {
    this.#visible = true;
    this.canvas.style.visibility = 'visible';
    this.#hideCssBackground();
  }

  /**************************
   * 隐藏元素
   *
   * - 设置状态
   * - 设置 canvas 元素隐藏
   * - 恢复父级节点背景
   **************************/
  hide() {
    this.#visible = false;
    this.canvas.style.visibility = 'hidden';
    this.#restoreCssBackground();
  }

  /**************************
   * 暂停动画涟漪状态
   **************************/
  pause() {
    this.#running = false;
  }
  /**************************
   * 播放动画涟漪状态
   **************************/
  play() {
    this.#running = true;
  }
  /**************************
   * 切换当前状态
   **************************/
  changePlayingState() {
    this.#running = !this.#running;
  }
  /**************************
   *  给初始化化量赋值
   **************************/
  set(property: keyof RipplesOptions, value: unknown) {
    if (property === 'imageUrl') {
      this.imageUrl = value as string;
      this.#loadImage();
    } else {
      this[property] = value as never;
    }
  }
}
