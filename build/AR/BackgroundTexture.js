import THREE from '../Three';
import { AR } from 'expo';
class BackgroundTexture extends THREE.Texture {
    constructor(renderer) {
        super();
        const properties = renderer.properties.get(this);
        properties.__webglInit = true;
        // @ts-ignore
        properties.__webglTexture = new WebGLTexture(AR.getCameraTexture());
    }
}
export default BackgroundTexture;
//# sourceMappingURL=BackgroundTexture.js.map