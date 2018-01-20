import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  var count = 0;

  // build a rope!
  var ropeLength = 918 / 20;

  var points = [];

  for (var i = 0; i < 20; i++) {
    points.push(new PIXI.Point(i * ropeLength, 0));
  }

  var stripTexture = await ExpoPixi.textureAsync(require('../../assets/pixi/snake.png'));

  var strip = new PIXI.mesh.Rope(stripTexture, points);

  strip.x = -459;

  var snakeContainer = new PIXI.Container();
  snakeContainer.x = 400;
  snakeContainer.y = 300;

  snakeContainer.scale.set(800 / 1100);
  app.stage.addChild(snakeContainer);

  snakeContainer.addChild(strip);

  app.ticker.add(function() {
    count += 0.1;

    // make the snake
    for (var i = 0; i < points.length; i++) {
      points[i].y = Math.sin(i * 0.5 + count) * 30;
      points[i].x = i * ropeLength + Math.cos(i * 0.3 + count) * 20;
    }
  });
});
