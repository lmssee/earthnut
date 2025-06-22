import { isNull, isZero } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { hideCssBackground } from './hideCssBackground';

/**
 *
 * 加载
 *
 */
export function loadImage(this: Ripples) {
  const gl = this.gl;
  const { renderData } = this;
  if (isNull(renderData)) return;

  const { parentElement, backgroundTexture, originalCssBackgroundImage } = renderData;
  const newImageSource: string | null =
    renderData.imageUrl ||
    extractUrl(originalCssBackgroundImage) ||
    extractUrl(window.getComputedStyle(parentElement).backgroundImage);
  // 倘若图片资源未更改，则无需从新下载
  if (newImageSource === renderData.imageSource) return;
  renderData.imageSource = newImageSource!;
  // 虚假来源意味着没有背景。
  if (!renderData.imageSource) {
    Reflect.apply(setTransparentTexture, this, []);
    return;
  }
  // 从新图像加载纹理。
  const image = new Image();
  image.onload = () => {
    /**  只有维度为 2 的幂的纹理才能重复换行  */
    const isPowerOfTwo = (x: number) => isZero(x & (x - 1));
    const wrapping =
      isPowerOfTwo(image.width) && isPowerOfTwo(image.height) ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    renderData.backgroundInfo = {
      width: image.width,
      height: image.height,
    };

    // 隐藏我们要替换的背景。
    Reflect.apply(hideCssBackground, this, []);
  };

  // Fall back to a transparent texture when loading the image failed.
  image.onerror = () => Reflect.apply(setTransparentTexture, this, []);

  // 当图像源是数据 URI 时禁用 CORS。
  image.crossOrigin = isDataUri(renderData.imageSource) ? null : renderData.crossOrigin;
  image.src = renderData.imageSource;
}

/**
 *
 * 设置透明的纹理
 *
 */

export function setTransparentTexture(this: Ripples) {
  const gl = this.gl;
  const { renderData } = this;
  if (isNull(renderData)) return;

  const { backgroundTexture } = renderData;
  gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.transparentPixels);
}

/**
 *
 * 检测数据是否为 url 外联图像地址
 *
 */

function extractUrl(value: string) {
  const urlMatch = /url\(["']?([^"']*)["']?\)/.exec(value);
  return isNull(urlMatch) ? null : urlMatch[1];
}
/**
 *
 * 是否是 base64 数据
 *
 */
function isDataUri(url: string) {
  return url.match(/^data:/);
}
