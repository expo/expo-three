import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  var squareX = new PIXI.Sprite(PIXI.Texture.WHITE);
  squareX.tint = 0xff0000;
  squareX.factor = 1;
  squareX.anchor.set(0.5);
  squareX.position.set(app.screen.width - 100, app.screen.height / 2);

  var squareY = new PIXI.Sprite(PIXI.Texture.WHITE);
  squareY.tint = 0xff0000;
  squareY.factor = 1;
  squareY.anchor.set(0.5);
  squareY.position.set(app.screen.width / 2, app.screen.height - 100);

  // create a new Sprite from an image path
  var container = new PIXI.projection.Container2d();
  container.position.set(app.screen.width / 2, app.screen.height / 2);

  app.stage.addChild(container);
  app.stage.addChild(squareX);
  app.stage.addChild(squareY);

  //add sprite itself

  const bunnyTexture = await ExpoPixi.textureAsync(require('../../assets/pixi/flowerTop.png'));
  var bunny = new PIXI.projection.Sprite2d(bunnyTexture);
  bunny.anchor.set(0.5);
  bunny.scale.set(0.7);
  container.addChild(bunny);

  //illuminate the sprite from two points!
  var lightY = new PIXI.projection.Sprite2d(PIXI.Texture.WHITE);
  lightY.anchor.set(0.5, 0.1);
  lightY.scale.set(15, 200);
  lightY.alpha = 0.2;
  container.addChildAt(lightY, 0);

  var lightX = new PIXI.projection.Sprite2d(PIXI.Texture.WHITE);
  lightX.anchor.set(0.1, 0.5);
  lightX.scale.set(200, 15);
  lightX.alpha = 0.2;
  container.addChildAt(lightX, 1);

  // Listen for animate update
  app.ticker.add(function(delta) {
    // clear the projection
    container.proj.clear();
    container.updateTransform();
    // now we can get local coords for points of perspective
    let posX = container.toLocal(squareX.position);
    let posY = container.toLocal(squareY.position);
    container.proj.setAxisX(posX, squareX.factor);
    container.proj.setAxisY(posY, squareY.factor);
  });

  addInteraction(squareX);
  addInteraction(squareY);
  //move the bunny too!
  addInteraction(bunny);

  // === CLICKS AND SNAP ===

  // changes axis factor
  function toggle(obj) {
    if (obj !== bunny) {
      obj.factor = 1.0 - obj.factor;
      obj.tint = obj.factor ? 0xff0033 : 0x00ff00;
    }
  }

  function snap(obj) {
    if (obj == bunny) {
      obj.position.set(0);
    } else {
      obj.position.x = Math.min(Math.max(obj.position.x, 0), app.screen.width);
      obj.position.y = Math.min(Math.max(obj.position.y, 0), app.screen.height);
    }
  }

  // === INTERACTION CODE  ===

  function addInteraction(obj) {
    obj.interactive = true;
    obj
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);
  }

  function onDragStart(event) {
    var obj = event.currentTarget;
    obj.dragData = event.data;
    obj.dragging = 1;
    obj.dragPointerStart = event.data.getLocalPosition(obj.parent);
    obj.dragObjStart = new PIXI.Point();
    obj.dragObjStart.copy(obj.position);
    obj.dragGlobalStart = new PIXI.Point();
    obj.dragGlobalStart.copy(event.data.global);
  }

  function onDragEnd(event) {
    var obj = event.currentTarget;
    if (!obj.dragging) return;
    if (obj.dragging == 1) {
      toggle(obj);
    } else {
      snap(obj);
    }

    obj.dragging = 0;
    obj.dragData = null;
    // set the interaction data to null
  }

  function onDragMove(event) {
    var obj = event.currentTarget;
    if (!obj.dragging) return;
    var data = obj.dragData; // it can be different pointer!
    if (obj.dragging == 1) {
      // click or drag?
      if (
        Math.abs(data.global.x - obj.dragGlobalStart.x) +
          Math.abs(data.global.y - obj.dragGlobalStart.y) >=
        3
      ) {
        // DRAG
        obj.dragging = 2;
      }
    }
    if (obj.dragging == 2) {
      var dragPointerEnd = data.getLocalPosition(obj.parent);
      // DRAG
      obj.position.set(
        obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x),
        obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y)
      );
    }
  }
});
