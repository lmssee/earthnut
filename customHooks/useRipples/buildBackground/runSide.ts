import { Ripples } from '../ripplesClass';
import { dog } from 'dog';
/**
 * 设置缓变
 *
 * 缓变分两种，一种是没有任何设置的缓变；另一种就是两个不同类型之间的缓变
 *
 *
 */
export function runSide(this: Ripples) {
  const { options, fadeData } = this;

  /// 设置下一个循环
  fadeData.transparentId = setTimeout(
    () => {
      clearTimeout(fadeData.transparentId); // 清理栈中未执行的同类型调用，防止多次触发
      // 当前上一次为执行完毕放弃本次子执行，创建下一次执行
      if (fadeData.isTransitioning) return Reflect.apply(runSide, this, []);
      // 设置进度
      fadeData.drawProgress = 0;
      // 开始执行变化
      fadeData.isTransitioning = true;

      dog.type = false;
      dog('开始渐变');
    }, // 触发渐变
    options.raindropsTimeInterval * 2,
  );
}
