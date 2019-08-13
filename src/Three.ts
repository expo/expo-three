import * as THREE from 'three';
import suppressExpoWarnings from './suppressWarnings';

declare var global: any;

global.THREE = global.THREE || THREE;

// @ts-ignore
global.THREE['suppressExpoWarnings'] = suppressExpoWarnings;

export default THREE;
