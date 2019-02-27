import THREE from '../Three';
declare class Light extends THREE.PointLight {
    constructor();
    _data: {};
    data: any;
    update(): void;
}
export default Light;
