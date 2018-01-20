import ExpoPixi, { PIXI } from 'expo-pixi';

export default (containerPivot = async context => {
  //http://pixijs.io/examples/#/basics/container-pivot.js
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

  // move container to the center
  container.x = app.renderer.width / 2;
  container.y = app.renderer.height / 2;

  // Center bunny sprite in local container coordinates
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;

  // Listen for animate update
  app.ticker.add(function(delta) {
    // rotate the container!
    // use delta to create frame-independent tranform
    container.rotation -= 0.01 * delta;
  });
});
