import { Ripples } from '../ripplesClass';
import { bindTexture } from '../tools';
import { drawQuad } from './drawQuad';
import { ripplesRenderDataWarehouse } from '../rippersData/renderData';

/**
 *
 * 绘制
 *
 */
export function render(this: Ripples) {
  const gl = this.gl;
  /**  渲染数据  */
  const renderData = ripplesRenderDataWarehouse[this.sole];
  /** 扰动系数 */
  const { perturbance, textures, backgroundTexture } = renderData;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  gl.enable(gl.BLEND);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(this.renderProgram.id);

  Reflect.apply(bindTexture, this, [backgroundTexture, 0]);
  Reflect.apply(bindTexture, this, [textures[0], 1]);

  gl.uniform1f(this.renderProgram.locations.perturbance, perturbance);
  gl.uniform2fv(this.renderProgram.locations.topLeft, this.renderProgram.uniforms.topLeft);
  gl.uniform2fv(this.renderProgram.locations.bottomRight, this.renderProgram.uniforms.bottomRight);
  gl.uniform2fv(
    this.renderProgram.locations.containerRatio,
    this.renderProgram.uniforms.containerRatio,
  );
  gl.uniform1i(this.renderProgram.locations.samplerBackground, 0);
  gl.uniform1i(this.renderProgram.locations.samplerRipples, 1);
  Reflect.apply(drawQuad, this, []);
  gl.disable(gl.BLEND);
}
