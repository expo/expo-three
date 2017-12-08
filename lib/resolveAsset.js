// @flow
import Expo from 'expo';
import { Image } from 'react-native';

function isAssetLibraryUri(uri) {
  return uri.toLowerCase().startsWith('asset-library://');
}

function isLocalUri(uri) {
  return uri.toLowerCase().startsWith('file://');
}

async function getInfoForFileAsync({ url, name }) {
  if (!url) {
    console.error('getInfoForFileAsync: cannot load from empty url!');
    return null;
  }
  name = name || url.substring(url.lastIndexOf('/') + 1);
  const localUri = Expo.FileSystem.cacheDirectory + name;

  if (isAssetLibraryUri(url)) {
    /// ios asset: we need to copy this over and then get the hash
    await Expo.FileSystem.copyAsync({
      from: url,
      to: localUri,
    });
    const hash = await getHashAsync(localUri);
    return { uri: localUri, name, hash };
  }
  if (isLocalUri(url)) {
    /// local image: we just need the hash
    const hash = await getHashAsync(localUri);
    return { uri: localUri, name, hash };
  } else {
    /// remote image: download first
    const { uri, md5: hash } = await Expo.FileSystem.downloadAsync(
      url,
      localUri,
      {
        md5: true,
      }
    );
    return { uri, name, hash };
  }
}

async function getHashAsync(uri) {
  const { md5 } = await Expo.FileSystem.getInfoAsync(uri, { md5: true });
  return md5;
}

async function getImageSizeAsync({ url }) {
  return await new Promise((res, rej) =>
    Image.getSize(url, (width, height) => res({ width, height }), rej)
  );
}

function isImageUrl(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

function getExtension(url) {
  return url
    .split('.')
    .pop()
    .toLowerCase();
}

async function assetFromUriAsync({ uri: fileuri, name: filename }) {
  const { uri, name, hash } = await getInfoForFileAsync({
    url: fileuri,
    name: filename,
  });

  if (uri) {
    const type = getExtension(name);
    let width = undefined;
    let height = undefined;
    if (isImageUrl(name)) {
      const size = await getImageSizeAsync({ url: uri });
      width = size.width;
      height = size.height;
    }

    return new Asset({ name, type, hash, uri, width, height });
  }
}

const resolveAsset = async fileReference => {
  let urls;
  if (fileReference instanceof Expo.Asset) {
    if (!fileReference.localUri) {
      await fileReference.downloadAsync();
    }
    return [fileReference];
  }
  if (typeof fileReference === 'string') {
    const asset = await assetFromUriAsync({ uri: fileReference });
    if (asset) {
      return await resolveAsset(asset);
    } else {
      return [fileReference];
    }
  } else if (typeof fileReference === 'number') {
    const asset = await Expo.Asset.fromModule(fileReference);
    return await resolveAsset(asset);
  } else if (Array.isArray(fileReference)) {
    let _urls = [];
    for (let item of fileReference) {
      const nItems = await resolveAsset(item);
      _urls = _urls.concat(nItems);
    }
    return _urls;
  } else {
    urls = fileReference;
  }
  return urls;
};

export default resolveAsset;
