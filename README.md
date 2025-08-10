# 花生亻 ui

嗯，姑且称之为 ui 吧

## 安装

```sh
npm install  --save earthnut
```

## 文档

参阅 [earthnut](https://earthnut.dev/quickUse/)

## 涟漪背景

由于当前组件的开发进度较缓慢，目前：

- 尽管接受所有的 style 属性，但是 `position` 还是期待是非 'static' 值，否则将影响涟漪背景的渲染位置和显示状态；
- 当前如果设置了 `background` 的话，有可能在恢复时使得其覆盖其他子属性；
- 当前期待使用 `background-color` 设置背景色，而不是在上面的 `background` 中设置背景色。譬如：`background-color: #f0f6;`
- 当前更期待使用配置参数 `option` 的 'imgUrl' 来配置目标背景图（请注意图源的跨域问题）。譬如：`imgUrl: 'background.png'`
- 当然，也可以使用标准的 `background-image` 配置符合要求的背景图片（目前仅支持单张图配置）。譬如：`background-image: url(background.png);`
- 当前可配置 `background-image` 为渐变色，但仅支持从上到下的线性渐变（仅支持单渐变）。譬如： `background-image: linear-gradient(black, transparent);`
- 在同时配置了 `imgUrl`、`background-image`、`background-color` 时仅会显示一个效果（混合效果暂时并未实现）。优先展示 `imgUrl`，然后是 `background-image`，之后是 `background-color` 。如果都未设置则会展示默认的老式地板砖背景图
- 尽量不要是使用透明色或是当前的主背景色，否则导致涟漪的效果不明显

切换背景最好不好通过设置

## 自定义钩子

几个简单的自定义钩子，写着玩

### useTimeId

就是 `useRef` 和 `useEffect` 的简单使用。

```ts
import { useTimeId } from 'earthnut';

export function Home () {

  const timeId = useTimeId();

  return <>
      <button
      onclick = { () => {
          timeId.current = setTimeout(() =>
            console.log('没有感情的按钮 A 打印了一条没有感情的消息'), 2500);
          }
      }>
          没有感情的按钮 A
      </button>
      <button onclick={()=> clearTimeout(timeId.current)}>没有感情的按钮 B</button>
  </>
}
```

### useAnimationFrame

使用下一帧动画。

```ts
import { useAnimationFrame } from 'earthnut';
```
