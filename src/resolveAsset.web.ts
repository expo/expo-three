// Also not implemented
async function resolveAsset(fileReference): Promise<any[]> {
  let urls: any[] = [];
  if (Array.isArray(fileReference)) {
    for (let file of fileReference) {
      urls.push(file);
    }
  } else {
    urls.push(fileReference);
  }
  return urls;
}

export async function stringFromAsset(asset): Promise<string | void> {
  console.warn('ExpoTHREE.stringFromAsset: Not Implemented');
  return '';
}

export default resolveAsset;
