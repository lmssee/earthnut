import { dog } from 'dog';
import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { setTransparentTexture } from './default-background';
import { createImageBySrc } from './utils/createImageBySrc';
/**
 *
 * 加载图像
 *
 * - 初始化的时候首先触发加载背景图像
 * - 通过 Ripple 的 set 方法设置属性 imageUrl 值时将触发
 * - 尺寸发生变化时亦将触发更改
 * - 父元素的样式属性发生变更时也会触发
 *
 * 在加载过程中如果渲染的图片为非法的（加载错误）那么将查找当前的背景色或是背景图作为依据，再就是都没有的情况下将会渲染一个类似于旧地板的色
 */
export function loadImage(this: Ripples) {
  dog.type = false;
  const { renderData, options, fadeData } = this;
  if (isNull(renderData)) {
    dog('执行绘制时没有渲染数据');
    Reflect.apply(setTransparentTexture, this, []);
    return;
  }
  const { lastUseStyle } = renderData;
  const { backgroundInfo } = fadeData;

  const { width, height } = backgroundInfo;
  const newImageSource: string | null =
    options.imageUrl || extractUrl(lastUseStyle.backgroundImage);
  dog('当前获取的图像资源为', newImageSource);
  // 倘若图片资源未更改，则无需从新下载（但需要有值前提下）
  // 图片资源未更改，但是尺寸发生变化时亦会触发该方法
  // if (newImageSource === renderData.imageSource && newImageSource) return;
  renderData.imageSource = newImageSource!;
  // 虚假来源意味着没有背景。
  if (!newImageSource) {
    dog.warn('没有原始图像，开始使用空白自绘');
    Reflect.apply(setTransparentTexture, this, []);
    return;
  }
  // 从新图像加载纹理。
  const image = createImageBySrc(newImageSource, width, height);
  image.onload = () => {
    clearTimeout(fadeData.transparentId); // 清理默认的渲染透明
    dog('背景图下载完毕', fadeData.toBeList.length);
    // 下载有效背景时清理默认的背景纹理和同地址的背景纹理
    fadeData.toBeList = fadeData.toBeList.filter(
      e =>
        e.tagName.toLowerCase() === 'img' &&
        e.getAttribute('src') !== newImageSource &&
        e.width === width &&
        e.height === height,
    );

    fadeData.toBeList.push(image); // 设置渐变过去
    fadeData.run(); // 开启渐变
  };

  // 下载图像出错
  image.onerror = () => {
    dog.warn('下载图像错误');
    Reflect.apply(setTransparentTexture, this, []);
  };

  // 当图像源是数据 URI 时禁用 CORS。
  // TODO
  image.crossOrigin = options.crossOrigin;
  dog.type = true;
}

/** 检测数据是否为 url 外联图像地址 */
function extractUrl(value: string) {
  const urlMatch = /url\(["']?([^"']*)["']?\)/.exec(value);
  return isNull(urlMatch) ? null : urlMatch[1];
}
