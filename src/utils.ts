import THREE from './Three';

export function alignMesh(mesh: THREE.Mesh, axis = { x: 0.5, y: 0.5, z: 0.5 }) {
  const nAxis = axis || {};
  const box = new THREE.Box3().setFromObject(mesh);

  const size = new THREE.Vector3();
  box.getSize(size);
  const min = { x: -box.min.x, y: -box.min.y, z: -box.min.z };

  for (const key of Object.keys(nAxis)) {
    const scale = nAxis[key];
    mesh.position[key] = min[key] - size[key] + size[key] * scale;
  }
}

export function scaleLongestSideToSize(mesh: THREE.Mesh, size: number) {
  const sizedVector = new THREE.Vector3();
  new THREE.Box3().setFromObject(mesh).getSize(sizedVector);

  const { x: width, y: height, z: depth } = sizedVector;

  const longest = Math.max(width, Math.max(height, depth));
  const scale = size / longest;
  mesh.scale.set(scale, scale, scale);
}

/** Used for smoothing imported meshes */
export function computeMeshNormals(mesh: THREE.Mesh) {
  mesh.traverse(async (child: any) => {
    if (child instanceof THREE.Mesh) {
      /// Smooth geometry
      child.geometry.mergeVertices();
      child.geometry.computeVertexNormals();
      child.geometry.computeFaceNormals();
    }
  });
}

/**
 * Retrieves the file extension from a given URL.
 * @param url - The URL to extract the file extension from.
 * @returns The file extension, or an empty string if no extension is found.
 */
export const getUrlExtension = (url: string): string => {
  // Split the URL by any hash or query parameters, and take the first part
  const basePath = url.split(/[#?]/)[0];
  // Split the basePath by slashes to check if the last segment contains a dot
  const segments = basePath.split('/');
  // Take the last segment after the final slash
  const lastSegment = segments.pop();

  // Check if the last segment exists and contains a dot, indicating a file extension
  if (lastSegment && lastSegment.includes('.')) {
    // If it does, split by dot and trim the last part (extension)
    const extension = lastSegment.split('.').pop();
    return extension ? extension.trim() : '';
  }

  // If there's no dot in the last segment, return an empty string as there's no extension
  return '';
};

/**
 * Checks if the given URL has a matching extension from the provided list of extensions.
 * @param url - The URL to check.
 * @param extensions - An array of extensions to match against.
 * @returns A boolean indicating whether the URL has a matching extension.
 */
export const matchUrlExtensions = (
  url: string,
  extensions: string[]
): boolean => {
  const urlExtension = getUrlExtension(url);

  return extensions.includes(urlExtension);
};

export const matchUrlExtension = (url: string, extension: string): boolean => {
  return matchUrlExtensions(url, [extension]);
};
