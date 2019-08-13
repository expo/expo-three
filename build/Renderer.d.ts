import THREE from './Three';
declare type RendererProps = THREE.WebGLRendererParameters & {
    gl: WebGLRenderingContext;
    canvas?: HTMLCanvasElement;
    pixelRatio?: number;
    clearColor?: THREE.Color | string | number;
    width?: number;
    height?: number;
};
export default class Renderer extends THREE.WebGLRenderer {
    constructor({ gl: context, canvas, pixelRatio, clearColor, width, height, ...props }: RendererProps);
}
export {};
