/**  获取元素的样式  */
export function getBackgroundStyles(element: HTMLElement) {
  const computedStyle = window.getComputedStyle(element);

  return {
    backgroundColor: computedStyle.backgroundColor,
    backgroundImage: computedStyle.backgroundImage,
    backgroundSize: computedStyle.backgroundSize,
    backgroundPosition: computedStyle.backgroundPosition,
    backgroundRepeat: computedStyle.backgroundRepeat,
    backgroundClip: computedStyle.backgroundClip,
    backgroundOrigin: computedStyle.backgroundOrigin,
    backgroundAttachment: computedStyle.backgroundAttachment,
    position: computedStyle.position,
  };
}
