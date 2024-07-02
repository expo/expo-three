// Also not implemented
async function resolveAsset(fileReference): Promise<any[]> {
  const urls: any[] = [];
  if (Array.isArray(fileReference)) {
    for (const file of fileReference) {
      urls.push(file);
    }
  } else {
    urls.push(fileReference);
  }
  return urls;
}

export async function stringFromAsset(asset): Promise<string> {
  console.warn('ExpoTHREE.stringFromAsset: Not Implemented');
  return '';
}

export default resolveAsset;
