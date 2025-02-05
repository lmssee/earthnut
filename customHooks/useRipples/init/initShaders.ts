import { ripplesRenderDataWarehouse } from '../rippersData/renderData';
import {
  dropProgramFragmentSource,
  renderProgramFragmentSource,
  renderVertexSource,
  updateProgramFragmentSource,
  vertexShader,
} from '../rippersData/vertexSource';
import { Ripples } from '../ripplesClass';
import { createProgram } from '../tools';
/**************************************
 *
 * 初始化着色器
 *
 **************************************/

export function initShaders(this: Ripples) {
  const gl = this.gl;
  const renderData = ripplesRenderDataWarehouse[this.sole];
  const { textureDelta } = renderData;
  renderData.dropProgram = createProgram(vertexShader, dropProgramFragmentSource, gl);
  const updateProgram = (renderData.updateProgram = createProgram(
    vertexShader,
    updateProgramFragmentSource,
    this.gl!,
  ));
  gl.uniform2fv(updateProgram.locations!.delta, textureDelta);
  this.renderProgram = createProgram(renderVertexSource, renderProgramFragmentSource, gl);
  gl.uniform2fv(this.renderProgram.locations.delta, textureDelta);
}
