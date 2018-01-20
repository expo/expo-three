import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  app.stop();

  ///TODO
  // load resources
  PIXI.loader
    .add('spritesheet', 'required/assets/monsters.json')
    .load(onAssetsLoaded);

  ///TODO
  // holder to store aliens
  var aliens = [];
  var alienFrames = [
    'eggHead.png',
    'flowerTop.png',
    'helmlok.png',
    'skully.png',
  ];

  var count = 0;

  // create an empty container
  var alienContainer = new PIXI.Container();
  alienContainer.x = 400;
  alienContainer.y = 300;

  // make the stage interactive
  app.stage.interactive = true;
  app.stage.addChild(alienContainer);

  function onAssetsLoaded() {
    // add a bunch of aliens with textures from image paths
    for (var i = 0; i < 100; i++) {
      var frameName = alienFrames[i % 4];

      //TODO
      // create an alien using the frame name..
      var alien = PIXI.Sprite.fromFrame(frameName);
      alien.tint = Math.random() * 0xffffff;

      /*
         * fun fact for the day :)
         * another way of doing the above would be
         * var texture = PIXI.Texture.fromFrame(frameName);
         * var alien = new PIXI.Sprite(texture);
         */
      alien.x = Math.random() * 800 - 400;
      alien.y = Math.random() * 600 - 300;
      alien.anchor.x = 0.5;
      alien.anchor.y = 0.5;
      aliens.push(alien);
      alienContainer.addChild(alien);
    }
    app.start();
  }

  // Combines both mouse click + touch tap
  app.stage.on('pointertap', onClick);

  function onClick() {
    alienContainer.cacheAsBitmap = !alienContainer.cacheAsBitmap;

    // feel free to play with what's below
    // var sprite = new PIXI.Sprite(alienContainer.generateTexture());
    // app.stage.addChild(sprite);
    // sprite.x = Math.random() * 800;
    // sprite.y = Math.random() * 600;
  }

  app.ticker.add(function() {
    // let's rotate the aliens a little bit
    for (var i = 0; i < 100; i++) {
      var alien = aliens[i];
      alien.rotation += 0.1;
    }

    count += 0.01;

    alienContainer.scale.x = Math.sin(count);
    alienContainer.scale.y = Math.sin(count);
    alienContainer.rotation += 0.01;
  });
});
