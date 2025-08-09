export type EnImageProps = {
  /**  下载错误时展示的图像  */
  errorSrc?: string;
  /**  加载中的图像  */
  loadingSrc?: string;
} & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
