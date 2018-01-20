import ExpoPixi, { PIXI } from 'expo-pixi';

export default (container = async context => {
  //http://pixijs.io/examples/#/basics/container.js
  const app = ExpoPixi.application({
    context,
  });

  var container = new PIXI.Container();

  app.stage.addChild(container);

  var texture = await ExpoPixi.textureAsync(require('../../assets/pixi/bunny.png'));

  // Create a 5x5 grid of bunnies
  for (var i = 0; i < 25; i++) {
    var bunny = new PIXI.Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);
  }

  // Center on the screen
  container.x = (app.renderer.width - container.width) / 2;
  container.y = (app.renderer.height - container.height) / 2;
});
