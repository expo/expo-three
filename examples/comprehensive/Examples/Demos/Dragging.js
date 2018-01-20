import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  // create a texture from an image path
  var texture = await ExpoPixi.textureAsync(require('../../assets/pixi/bunny.png'));

  // Scale mode for pixelation
  texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

  for (var i = 0; i < 10; i++) {
    createBunny(
      Math.floor(Math.random() * app.renderer.width),
      Math.floor(Math.random() * app.renderer.height)
    );
  }

  function createBunny(x, y) {
    // create our little bunny friend..
    var bunny = new PIXI.Sprite(texture);

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    // center the bunny's anchor point
    bunny.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    bunny.scale.set(3);

    ///TODO: mouse input
    // setup events for mouse + touch using
    // the pointer events
    bunny
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);

    // For mouse-only events
    // .on('mousedown', onDragStart)
    // .on('mouseup', onDragEnd)
    // .on('mouseupoutside', onDragEnd)
    // .on('mousemove', onDragMove);

    // For touch-only events
    // .on('touchstart', onDragStart)
    // .on('touchend', onDragEnd)
    // .on('touchendoutside', onDragEnd)
    // .on('touchmove', onDragMove);

    // move the sprite to its designated position
    bunny.x = x;
    bunny.y = y;

    // add it to the stage
    app.stage.addChild(bunny);
  }

  function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
  }

  function onDragMove() {
    if (this.dragging) {
      var newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }
});
