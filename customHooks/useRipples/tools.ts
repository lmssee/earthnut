/****************************************************************************
 * @Author lmssee
 * @Email lmssee@outlook.com
 * @ProjectName website
 * @FileName tools.ts
 * @CreateDate  周六  12/07/2024
 * @Description  工具
 ****************************************************************************/

import { setStyle } from 'a-element-inline-style';
import { Ripples } from './ripplesClass';
import { Program } from './interface';

/**************************************
 *
 * 转换背景的位置为特定的格式
 *
 **************************************/
export function translateBackgroundPosition(value: string): string[] {
  if (/\s+/.test(value)) {
    return value
      .replace(/center/, '50%')
      .replace(/top|left/, '0%')
      .replace(/bottom/, '100%')
      .replace(/\s+/, ' ')
      .split(' ');
  } else if (isPercentage(value)) {
    return [value, '50%'];
  } else {
    return {
      center: ['50%', '50%'],
      top: ['50%', '0%'],
      bottom: ['50%', '100%'],
      left: ['0%', '50%'],
      right: ['100%', '50%'],
    }[value as 'center' | 'top' | 'bottom' | 'left' | 'right'];
  }
}

/**************************************
 *
 * 检测数据是否为 url 外联图像地址
 *
 **************************************/

export function extractUrl(value: string) {
  const urlMatch = /url\(["']?([^"']*)["']?\)/.exec(value);
  if (urlMatch == null) {
    return null;
  }
  return urlMatch[1];
}

/**************************************
 *
 *  增加 WebGLProgram
 *
 *
 **************************************/
export function createProgram(
  vertexSource: string,
  fragmentSource: string,
  gl: WebGLRenderingContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _uniformValues?: string,
) {
  /**************************
   * 编译一个着色器
   **************************/
  function compileSource(type: GLenum, source: string) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source); /// 设置 WebGLShader 着色器
    gl.compileShader(shader); /// 编译一个着色器，使其成为二进制数据，然后就可以被 WebGLProgram 对象所使用
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error('compile error: ' + gl.getShaderInfoLog(shader));
    return shader;
  }

  const program: Program = {
    id: gl.createProgram(),
    uniforms: {},
    locations: {},
  };
  /**  向 WebGLProgram 添加一个片段  */
  gl.attachShader(program.id, compileSource(gl.VERTEX_SHADER, vertexSource));
  /**  向 WebGLProgram 添加一个顶点着色器  */
  gl.attachShader(program.id, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program.id); /// 链接给定的 WebGLProgram ，从而完成程序的片元和顶点着色器准备
  if (!gl.getProgramParameter(program.id, gl.LINK_STATUS))
    throw new Error('link error: ' + gl.getProgramInfoLog(program.id));
  gl.useProgram(program.id);
  gl.enableVertexAttribArray(0);
  let match;

  const shaderCode = vertexSource + fragmentSource;
  /**  待搜索的正则表达式  */
  const regex = /uniform (\w+) (\w+)/g;
  /**************************
   * 多次匹配
   *
   * 并在找不到时返回 null
   *
   * 每一次匹配都会更新 lastIndex 的数值
   *
   * 该方法是正则表达式的原始方法，强大而有效，但通常不能表达清楚调用的目的
   **************************/
  while ((match = regex.exec(shaderCode)) !== null) {
    const name = match[2];
    program.locations[name] = gl.getUniformLocation(program.id, name)!;
  }
  return program;
}

/**************************************
 *
 * 绑定纹理
 *
 **************************************/
export function bindTexture(this: Ripples, texture: WebGLTexture, unit: number = 0) {
  const gl = this.gl;
  gl.activeTexture(gl.TEXTURE0 + (unit || 0));
  gl.bindTexture(gl.TEXTURE_2D, texture);
}

/**************************************
 *
 * 是否是 base64 数据
 *
 **************************************/
export function isDataUri(url: string) {
  return url.match(/^data:/);
}

/**************************************
 *
 * 给定的字符串是否为百分数
 *
 **************************************/
export function isPercentage(value: string) {
  return value.endsWith('%');
}

/**************************
 * 给 canvas 设置样式
 **************************/
export function setCanvasStyle(canvas: HTMLCanvasElement) {
  const parent = canvas.parentElement!;
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;
  // 给 canvas 元素赋值行内样式
  setStyle(canvas, {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    pointerEvents: 'none',
  });
}
