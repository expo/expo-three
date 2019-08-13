import THREE from './Three';
export default class Renderer extends THREE.WebGLRenderer {
    constructor({ gl: context, canvas, pixelRatio = 1, clearColor, width, height, ...props }) {
        const inputCanvas = canvas ||
            {
                width: context.drawingBufferWidth,
                height: context.drawingBufferHeight,
                style: {},
                addEventListener: (() => { }),
                removeEventListener: (() => { }),
                clientHeight: context.drawingBufferHeight,
            };
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
//# sourceMappingURL=Renderer.js.map