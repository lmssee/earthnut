export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | string[];

  /**  样式  */
  style?: React.CSSProperties;
  /**  布局的  */
  /**************************
   * 布局的宽
   *
   *
   * 缺省值为 100vw
   **************************/
  width?: string | number;
  /**************************
   * 布局可视界面的高
   *
   * 用于限制 side bar 的高度
   *
   * 缺省值为 100vh
   *
   * 为具体值。当为 100% 时 side bar 渲染不正确
   **************************/
  height?: string | number;
}

export interface LayoutSideBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | string[];
  /**************************
   * 侧边栏的宽度
   *
   * 缺省值为 150
   **************************/
  width?: number | string;
  /**************************
   * 是否居右
   *
   * 缺省值为 false
   **************************/
  right?: boolean;
  /**************************
   * 是否占用所有空间
   *
   * 缺省值为 false
   **************************/
  full?: boolean;
}

export interface LayoutHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | string[];
  /**************************
   * header 的高度
   *
   * 缺省值为 2.8rem
   **************************/
  height?: number | string;
  /**************************
   * 是否取消悬挂粘连
   *
   * 缺省值为 false
   **************************/
  noSticky?: boolean;
}

export interface LayoutFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | string[];
  /**************************
   * footer 的高度
   *
   * 缺省值为 2rem
   **************************/
  height?: number | string;
}
