import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  var bg = await ExpoPixi.spriteAsync(require('../../assets/pixi/depth_blur_BG.jpg'));
  bg.width = app.renderer.width;
  bg.height = app.renderer.height;
  app.stage.addChild(bg);

  var littleDudes = await ExpoPixi.spriteAsync(require('../../assets/pixi/depth_blur_dudes.jpg'));
  littleDudes.x = app.renderer.width / 2 - 315;
  littleDudes.y = 200;
  app.stage.addChild(littleDudes);

  var littleRobot = await ExpoPixi.spriteAsync(require('../../assets/pixi/depth_blur_moby.jpg'));
  littleRobot.x = app.renderer.width / 2 - 200;
  littleRobot.y = 100;
  app.stage.addChild(littleRobot);

  var blurFilter1 = new PIXI.filters.BlurFilter();
  var blurFilter2 = new PIXI.filters.BlurFilter();

  littleDudes.filters = [blurFilter1];
  littleRobot.filters = [blurFilter2];

  var count = 0;

  app.ticker.add(function() {
    count += 0.005;

    var blurAmount = Math.cos(count);
    var blurAmount2 = Math.sin(count);

    blurFilter1.blur = 20 * blurAmount;
    blurFilter2.blur = 20 * blurAmount2;
  });
});
