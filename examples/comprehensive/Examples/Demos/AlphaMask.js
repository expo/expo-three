import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  app.stage.interactive = true;

  var bg = await ExpoPixi.spriteAsync(require('../../assets/pixi/bkg.jpg'));

  app.stage.addChild(bg);

  var cells = await ExpoPixi.spriteAsync(require('../../assets/pixi/cells.png'));

  cells.scale.set(1.5);

  var mask = await ExpoPixi.spriteAsync(require('../../assets/pixi/flowerTop.png'));

  mask.anchor.set(0.5);
  mask.x = 310;
  mask.y = 190;

  cells.mask = mask;

  app.stage.addChild(mask, cells);

  var target = new PIXI.Point();

  reset();

  function reset() {
    target.x = Math.floor(Math.random() * 550);
    target.y = Math.floor(Math.random() * 300);
  }

  app.ticker.add(function() {
    mask.x += (target.x - mask.x) * 0.1;
    mask.y += (target.y - mask.y) * 0.1;

    if (Math.abs(mask.x - target.x) < 1) {
      reset();
    }
  });
});
