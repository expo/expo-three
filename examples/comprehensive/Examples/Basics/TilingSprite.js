import ExpoPixi, { PIXI } from 'expo-pixi';
export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  // create a texture from an image path
  const texture = await ExpoPixi.textureAsync(require('../../assets/pixi/p2.jpeg'));

  /* create a tiling sprite ...
 * requires a texture, a width and a height
 * in WebGL the image size should preferably be a power of two
 */
  /// TODO: tiling
  const tilingSprite = new PIXI.extras.TilingSprite(
    texture,
    app.renderer.width,
    app.renderer.height
  );
  app.stage.addChild(tilingSprite);

  let count = 0;

  app.ticker.add(function() {
    count += 0.005;

    tilingSprite.tileScale.x = 2 + Math.sin(count);
    tilingSprite.tileScale.y = 2 + Math.cos(count);

    tilingSprite.tilePosition.x += 1;
    tilingSprite.tilePosition.y += 1;
  });
});
