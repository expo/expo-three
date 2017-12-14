import suppressExpoWarnings from './suppressWarnings';
const THREE = (global.THREE = global.THREE || require('three'));
THREE.suppressExpoWarnings = suppressExpoWarnings;
export default THREE;
