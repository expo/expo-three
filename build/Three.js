import * as THREE from 'three';
import suppressExpoWarnings from './suppressWarnings';
global.THREE = global.THREE || THREE;
// @ts-ignore
global.THREE['suppressExpoWarnings'] = suppressExpoWarnings;
export default THREE;
//# sourceMappingURL=Three.js.map