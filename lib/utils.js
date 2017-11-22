const THREE = global.THREE || require("three");
global.THREE = THREE;

const alignMesh = (mesh, axis = { x: 0.5, y: 0.5, z: 0.5 }) => {
  axis = axis || {};
  const box = new THREE.Box3().setFromObject(mesh);

  const size = box.getSize();
  const min = { x: -box.min.x, y: -box.min.y, z: -box.min.z };

  Object.keys(axis).map(key => {
    const scale = axis[key];
    mesh.position[key] = min[key] - size[key] + size[key] * scale;
  });
};

const scaleLongestSideToSize = (mesh, size) => {
  const { x: width, y: height, z: depth } = new THREE.Box3()
    .setFromObject(mesh)
    .getSize();
  const longest = Math.max(width, Math.max(height, depth));
  const scale = size / longest;
  mesh.scale.set(scale, scale, scale);
};

export default {
  alignMesh,
  scaleLongestSideToSize
};
