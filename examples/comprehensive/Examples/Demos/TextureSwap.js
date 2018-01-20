import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  var bol = false;

  // create a texture from an image path
  var texture = await ExpoPixi.textureAsync(require('../../assets/pixi/flowerTop.png'));

  // create a second texture
  var secondTexture = await ExpoPixi.spriteAsync(require('../../assets/pixi/eggHead.png'));

  // create a new Sprite using the texture
  var dude = new PIXI.Sprite(texture);

  // center the sprites anchor point
  dude.anchor.set(0.5);

  // move the sprite to the center of the screen
  dude.x = app.renderer.width / 2;
  dude.y = app.renderer.height / 2;

  app.stage.addChild(dude);

  // make the sprite interactive
  dude.interactive = true;
  dude.buttonMode = true;

  dude.on('pointertap', function() {
    bol = !bol;
    if (bol) {
      dude.texture = secondTexture;
    } else {
      dude.texture = texture;
    }
  });

  app.ticker.add(function() {
    // just for fun, let's rotate mr rabbit a little
    dude.rotation += 0.1;
  });
});
