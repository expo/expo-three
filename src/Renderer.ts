import THREE from './Three';

type RendererProps = THREE.WebGLRendererParameters & {
  gl: WebGLRenderingContext;
  canvas?: HTMLCanvasElement;
  pixelRatio?: number;
  clearColor?: THREE.Color | string | number;
  width?: number;
  height?: number;
};
export default class Renderer extends THREE.WebGLRenderer {
  constructor({
    gl: context,
    canvas,
    pixelRatio = 1,
    clearColor,
    width,
    height,
    ...props
  }: RendererProps) {
    const inputCanvas =
      canvas ||
      ({
        width: context.drawingBufferWidth,
        height: context.drawingBufferHeight,
        style: {},
        addEventListener: (() => {}) as any,
        removeEventListener: (() => {}) as any,
        clientHeight: context.drawingBufferHeight,
      } as HTMLCanvasElement);

    super({
      canvas: inputCanvas,
      context,
      ...props,
    });

    this.setPixelRatio(pixelRatio);

    if (width && height) {
      this.setSize(width, height);
    }
    if (clearColor) {
      // @ts-ignore: Type 'string' is not assignable to type 'number'.ts(2345)
      this.setClearColor(clearColor);
    }
  }
}
