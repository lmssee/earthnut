/**************************
 * swap 缓冲区索引
 **************************/
import { ripplesRenderDataWarehouse } from '../rippersData/renderData';
import { Ripples } from '../ripplesClass';

export function swapBufferIndices(this: Ripples) {
  const renderData = ripplesRenderDataWarehouse[this.sole];

  const { bufferWriteIndex, bufferReadIndex } = renderData;
  renderData.bufferWriteIndex = 1 - bufferWriteIndex;
  renderData.bufferReadIndex = 1 - bufferReadIndex;
}
