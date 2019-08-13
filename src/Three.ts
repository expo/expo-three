import * as THREE from 'three';
import suppressExpoWarnings from './suppressWarnings';

// @ts-ignore
global.THREE = global.THREE || THREE;
THREE['suppressExpoWarnings'] = suppressExpoWarnings;
export default THREE;
