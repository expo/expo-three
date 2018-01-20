import ExpoPixi, { PIXI } from 'expo-pixi';

export default (Filter = async context => {
  //http://pixijs.io/examples/#/filters/filter.js
  const app = ExpoPixi.application({
    context,
  });

  app.stage.interactive = true;

  var bg = await ExpoPixi.spriteAsync(require('../../assets/pixi/BGrotate.jpg'));
  bg.anchor.set(0.5);

  bg.x = app.renderer.width / 2;
  bg.y = app.renderer.height / 2;

  var filter = new PIXI.filters.ColorMatrixFilter();

  var container = new PIXI.Container();
  container.x = app.renderer.width / 2;
  container.y = app.renderer.height / 2;

  var bgFront = await ExpoPixi.spriteAsync(require('../../assets/pixi/SceneRotate.jpg'));
  bgFront.anchor.set(0.5);

  container.addChild(bgFront);

  var light2 = await ExpoPixi.spriteAsync(require('../../assets/pixi/LightRotate2.png'));
  light2.anchor.set(0.5);
  container.addChild(light2);

  var light1 = await ExpoPixi.spriteAsync(require('../../assets/pixi/LightRotate1.png'));
  light1.anchor.set(0.5);
  container.addChild(light1);

  var panda = await ExpoPixi.spriteAsync(require('../../assets/pixi/panda.png'));
  panda.anchor.set(0.5);

  container.addChild(panda);

  app.stage.addChild(container);

  app.stage.filters = [filter];

  var count = 0;
  var enabled = true;

  app.stage.on('pointertap', function() {
    enabled = !enabled;
    app.stage.filters = enabled ? [filter] : null;
  });

  var help = new PIXI.Text('Click or tap to turn filters on / off.', {
    fontFamily: 'Arial',
    fontSize: 12,
    fontWeight: 'bold',
    fill: 'white',
  });
  help.y = app.renderer.height - 25;
  help.x = 10;

  app.stage.addChild(help);

  app.ticker.add(function(delta) {
    bg.rotation += 0.01;
    bgFront.rotation -= 0.01;
    light1.rotation += 0.02;
    light2.rotation += 0.01;

    panda.scale.x = 1 + Math.sin(count) * 0.04;
    panda.scale.y = 1 + Math.cos(count) * 0.04;

    count += 0.1;

    var matrix = filter.matrix;

    matrix[1] = Math.sin(count) * 3;
    matrix[2] = Math.cos(count);
    matrix[3] = Math.cos(count) * 1.5;
    matrix[4] = Math.sin(count / 3) * 2;
    matrix[5] = Math.sin(count / 2);
    matrix[6] = Math.sin(count / 4);
  });
});
