import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  /// TODO: this
  var sprites = new PIXI.particles.ParticleContainer(10000, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
  });
  app.stage.addChild(sprites);

  // create an array to store all the sprites
  var maggots = [];

  var totalSprites = app.renderer instanceof PIXI.WebGLRenderer ? 10000 : 100;

  for (var i = 0; i < totalSprites; i++) {
    // create a new Sprite

    var dude = await ExpoPixi.spriteAsync(require('../../assets/pixi/tinyMaggot.png'));

    dude.tint = Math.random() * 0xe8d4cd;

    // set the anchor point so the texture is centerd on the sprite
    dude.anchor.set(0.5);

    // different maggots, different sizes
    dude.scale.set(0.8 + Math.random() * 0.3);

    // scatter them all
    dude.x = Math.random() * app.renderer.width;
    dude.y = Math.random() * app.renderer.height;

    dude.tint = Math.random() * 0x808080;

    // create a random direction in radians
    dude.direction = Math.random() * Math.PI * 2;

    // this number will be used to modify the direction of the sprite over time
    dude.turningSpeed = Math.random() - 0.8;

    // create a random speed between 0 - 2, and these maggots are slooww
    dude.speed = (2 + Math.random() * 2) * 0.2;

    dude.offset = Math.random() * 100;

    // finally we push the dude into the maggots array so it it can be easily accessed later
    maggots.push(dude);

    sprites.addChild(dude);
  }

  // create a bounding box box for the little maggots
  var dudeBoundsPadding = 100;
  var dudeBounds = new PIXI.Rectangle(
    -dudeBoundsPadding,
    -dudeBoundsPadding,
    app.renderer.width + dudeBoundsPadding * 2,
    app.renderer.height + dudeBoundsPadding * 2
  );

  var tick = 0;

  app.ticker.add(function() {
    // iterate through the sprites and update their position
    for (var i = 0; i < maggots.length; i++) {
      var dude = maggots[i];
      dude.scale.y = 0.95 + Math.sin(tick + dude.offset) * 0.05;
      dude.direction += dude.turningSpeed * 0.01;
      dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
      dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
      dude.rotation = -dude.direction + Math.PI;

      // wrap the maggots
      if (dude.x < dudeBounds.x) {
        dude.x += dudeBounds.width;
      } else if (dude.x > dudeBounds.x + dudeBounds.width) {
        dude.x -= dudeBounds.width;
      }

      if (dude.y < dudeBounds.y) {
        dude.y += dudeBounds.height;
      } else if (dude.y > dudeBounds.y + dudeBounds.height) {
        dude.y -= dudeBounds.height;
      }
    }

    // increment the ticker
    tick += 0.1;
  });
});
