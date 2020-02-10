type AnyFunction = (...args: any[]) => any;
type AnyObject = { [key: string]: any };

export default function parseAssetCallback(
  assetName: string,
  callbackOrDictionary: AnyFunction | AnyObject
): any {
  if (typeof callbackOrDictionary === 'function') {
    return (callbackOrDictionary as AnyFunction)(assetName);
  } else if (
    callbackOrDictionary !== null &&
    typeof callbackOrDictionary === 'object'
  ) {
    if (assetName in callbackOrDictionary) {
      return callbackOrDictionary[assetName];
    }

    throw new Error(
      `parseAssetCallback: object doesn't contain key: ${assetName}`
    );
  }

  throw new Error(
    'parseAssetCallback: prop `callbackOrDictionary` must be a function or object'
  );
}
