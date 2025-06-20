import { ripplesRenderDataWarehouse } from '../rippersData/renderData';
import { Ripples } from '../ripplesClass';

/**
 *
 * 初始化纹理
 *
 */
export function initTexture(this: Ripples) {
  const gl = this.gl;
  const renderData = ripplesRenderDataWarehouse[this.sole];
  const _backgroundTexture = (renderData.backgroundTexture = gl.createTexture());
  gl.bindTexture(gl.TEXTURE_2D, _backgroundTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}
