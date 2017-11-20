import THREE from "../Three";

export default (mesh, axis = { x: 0.5, y: 0.5, z: 0.5 }) => {
  axis = axis || {};
  const box = new THREE.Box3().setFromObject(mesh);

  const size = box.getSize();
  const min = { x: -box.min.x, y: -box.min.y, z: -box.min.z };

  Object.keys(axis).map(key => {
    const scale = axis[key];
    mesh.position[key] = min[key] - size[key] + size[key] * scale;
  });
};
