import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  var stage = app.stage;

  //prepare circle texture, that will be our brush
  var brush = new PIXI.Graphics();
  brush.beginFill(0xffffff);
  brush.drawCircle(0, 0, 50);
  brush.endFill();

  /// TODO: Preloader
  PIXI.loader.add('t1', 'required/assets/bkg-grass.jpg');
  PIXI.loader.add('t2', 'required/assets/BGrotate.jpg');
  PIXI.loader.load(setup);

  function setup(loader, resources) {
    var background = new PIXI.Sprite(resources['t1'].texture);
    stage.addChild(background);
    background.width = app.screen.width;
    background.height = app.screen.height;

    var imageToReveal = new PIXI.Sprite(resources['t2'].texture);
    stage.addChild(imageToReveal);
    imageToReveal.width = app.screen.width;
    imageToReveal.height = app.screen.height;

    var renderTexture = PIXI.RenderTexture.create(
      app.screen.width,
      app.screen.height,
    );

    var renderTextureSprite = new PIXI.Sprite(renderTexture);
    stage.addChild(renderTextureSprite);
    imageToReveal.mask = renderTextureSprite;

    app.stage.interactive = true;
    app.stage.on('pointerdown', pointerDown);
    app.stage.on('pointerup', pointerUp);
    app.stage.on('pointermove', pointerMove);

    var dragging = false;

    function pointerMove(event) {
      if (dragging) {
        brush.position.copy(event.data.global);
        app.renderer.render(brush, renderTexture, false, null, false);
      }
    }

    function pointerDown(event) {
      dragging = true;
      pointerMove(event);
    }

    function pointerUp(event) {
      dragging = false;
    }
  }
});
