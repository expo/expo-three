import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  // create a background...
  var background = await ExpoPixi.spriteAsync(require('../../assets/pixi/button_test_BG.jpg'));

  background.width = app.renderer.width;
  background.height = app.renderer.height;

  // add background to stage...
  app.stage.addChild(background);

  // create some textures from an image path
  var textureButton = await ExpoPixi.textureAsync(require('../../assets/pixi/button.png'));

  var textureButtonDown = await ExpoPixi.textureAsync(require('../../assets/pixi/buttonDown.png'));
  var textureButtonOver = await ExpoPixi.textureAsync(require('../../assets/pixi/buttonOver.png'));

  var buttons = [];

  var buttonPositions = [175, 75, 655, 75, 410, 325, 150, 465, 685, 445];

  for (var i = 0; i < 5; i++) {
    var button = new PIXI.Sprite(textureButton);
    button.buttonMode = true;

    button.anchor.set(0.5);
    button.x = buttonPositions[i * 2];
    button.y = buttonPositions[i * 2 + 1];

    // make the button interactive...
    button.interactive = true;
    button.buttonMode = true;

    /// TODO
    button
      // Mouse & touch events are normalized into
      // the pointer* events for handling different
      // button events.
      .on('pointerdown', onButtonDown)
      .on('pointerup', onButtonUp)
      .on('pointerupoutside', onButtonUp)
      .on('pointerover', onButtonOver)
      .on('pointerout', onButtonOut);

    // Use mouse-only events
    // .on('mousedown', onButtonDown)
    // .on('mouseup', onButtonUp)
    // .on('mouseupoutside', onButtonUp)
    // .on('mouseover', onButtonOver)
    // .on('mouseout', onButtonOut)

    // Use touch-only events
    // .on('touchstart', onButtonDown)
    // .on('touchend', onButtonUp)
    // .on('touchendoutside', onButtonUp)

    // add it to the stage
    app.stage.addChild(button);

    // add button to array
    buttons.push(button);
  }

  // set some silly values...
  buttons[0].scale.set(1.2);
  buttons[2].rotation = Math.PI / 10;
  buttons[3].scale.set(0.8);
  buttons[4].scale.set(0.8, 1.2);
  buttons[4].rotation = Math.PI;

  function onButtonDown() {
    this.isdown = true;
    this.texture = textureButtonDown;
    this.alpha = 1;
  }

  function onButtonUp() {
    this.isdown = false;
    if (this.isOver) {
      this.texture = textureButtonOver;
    } else {
      this.texture = textureButton;
    }
  }

  function onButtonOver() {
    this.isOver = true;
    if (this.isdown) {
      return;
    }
    this.texture = textureButtonOver;
  }

  function onButtonOut() {
    this.isOver = false;
    if (this.isdown) {
      return;
    }
    this.texture = textureButton;
  }
});
