import { getRandomInt } from 'a-js-tools';

const build = (times: number = 0) => {
  /**  构建数据  */
  const data: {
    /**  数据  */
    list: [number, number, number, number][][];
    /**  直径  */
    diameter: number;
    /**  半径  */
    radius: number;
    /**  晶格数  */
    cells: number;
  } = {
    list: [],
    diameter: 48,
    radius: 0,
    cells: 0,
  };
  // 防止为单
  if (data.diameter % 2 !== 0) data.diameter++;
  /**  宽  */
  const { diameter: d, list: l } = data;
  /**  半宽  */
  const r = d / 2;
  data.radius = r;
  data.cells = d ** 2;
  for (let x = 0; x < d; x++) {
    l[x] = [];
    for (let y = 0; y < d; y++) l[x][y] = [0, 0, 0, 0];
  }
  // 绘制 1 / 8
  for (let x = 0; x <= r; x++) {
    for (let y = x; y <= r; y++) {
      /**  子项数据  */
      const column: [number, number, number, number] = l[x][y];
      const noise = () => getRandomInt(255, 190);
      column[0] = noise(); // R
      column[1] = noise(); // G
      column[2] = noise(); // B
      /**  小于半宽则为圆内 */
      column[3] =
        Math.ceil(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) <= r
          ? getRandomInt(120, 180)
          : getRandomInt(160, 240); // A
    }
  }
  // 绘制 1 / 8
  for (let x = 0; x <= r; x++) for (let y = 0; y <= x; y++) l[x][y] = l[y][x];
  // 绘制为右上半圆
  for (let x = r; x < d; x++) for (let y = 0; y <= r; y++) l[x][y] = l[d - x][y];
  // 绘制左下为 3 / 4 圆
  for (let x = 0; x < r; x++) for (let y = r; y < d; y++) l[x][y] = l[x][d - y];
  // 绘制右下为全圆
  for (let x = r; x < d; x++) for (let y = r; y < d; y++) l[x][y] = l[x][d - y];
  const k = times % d; // 偏移值，让图有动感
  data.list = [...l.slice(k), ...l.slice(0, k)];

  return data;
};

/**  圆数据  */
export const circleDataList = new (class {
  /**  计数器  */
  #cum: number = 1;
  /**  构建新的数据依据  */
  build() {
    if (this.#cum > 100) this.#cum = 0;
    this.data = build((this.#cum += 3));
  }
  /**  数据依据  */
  data = build();
})();
