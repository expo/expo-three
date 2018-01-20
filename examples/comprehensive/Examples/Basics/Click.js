import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });
  // const bunny = await ExpoPixi.spriteAsync(require('../../assets/pixi/bunny.png'));

  // Scale mode for all textures, will retain pixelation
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  const sprite = PIXI.Sprite.fromImage('required/assets/basics/bunny.png');

  // Set the initial position
  sprite.anchor.set(0.5);
  sprite.x = app.renderer.width / 2;
  sprite.y = app.renderer.height / 2;

  // Opt-in to interactivity
  sprite.interactive = true;

  // Shows hand cursor
  sprite.buttonMode = true;

  // Pointers normalize touch and mouse
  sprite.on('pointerdown', onClick);

  // Alternatively, use the mouse & touch events:
  // sprite.on('click', onClick); // mouse-only
  // sprite.on('tap', onClick); // touch-only

  app.stage.addChild(sprite);

  function onClick() {
    sprite.scale.x *= 1.25;
    sprite.scale.y *= 1.25;
  }
});
