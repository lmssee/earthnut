# 版本日志

## v0.0.1 (2025-7-1)

- 更改了背景图
- 添加了默认背景
- 背景展现为渐变

## version:0.0.0

购买了新的域名，又要折腾了

## version:0.0.13

. _创建时间： 2025-2-6 13:55_

- 上一个版本由于错误的输出配置导致 esModel 未正确打包

## version:0.0.11

. _创建时间： 2025-2-1 18:16_

- 更新 `css`、`scss` 文件的导出方式，原来是想根据 `@angular/material` 来做样式导出
- `useRipples` 在参数 `playingState` 为 `false` 后暂停新的绘制到数据，但由于暂时对 WebGL 一窍不通，没有办法在传入数据为 `false` 时及时清理旧的渲染数据

### 导出 css 的修改

```json
// 原来参照 `@angular/material`
{
  "export": {
    "./scss": {
      "style": "./dist/styles/common.scss"
    },
    "./css": {
      "style": "./dist/styles/common.css"
    }
  }
}
```

现更改为：

```json
{
  "exports": {
    "scss": "./dist/styles/common.scss",
    "css": "./dist/styles/common.css"
  }
}
```

## version:0.0.10

. _创建时间： 2025-2-1 18:16_

- 在测试 `BackgroundRipple` 使用的页面内元素滚动，导致在页面滚动后本应出现的 bug 为出现，现已修正

## version:0.0.9

. _创建时间： 2025-1-27 04:34_

- 解决了当 `BackgroundRipple` 非全屏使用时鼠标触发点的问题

## version:0.0.8

. _创建时间： 2025-1-17 04:34_

- 刚才提交很快，我想再试一下，我不信真的还是那么快

## version:0.0.7

. _创建时间： 2025-1-17 04:20_

- 刚才提交很快，我想再试一下

## version:0.0.6

. _创建时间： 2025-1-17 04:18_

- 没错，我有更新了，我只是给 `BackgroundRipple` 中的 `canvas` 添加了一个样式属性

## version:0.0.5

. _创建时间： 2025-1-8 21:28_

- 上一个版本导出类型有缺失

## version:0.0.4

. _创建时间： 2025-1-7 15:03_

- 添加了 `useInputIsComposing`

## version:0.0.3

. _创建时间： 2025-1-3 16:31_

- `ripple` 中 `touchmove`、`touchstart` 事件监听添加 `{ passive: true}`
- 添加 `useTimeId`、`useAnimationFrameId`、`useRipples` 自定义 hooks
- 添加 `earthnut/css`、`earthnut/scss` 样式表
