import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  var squareFar = new PIXI.Sprite(PIXI.Texture.WHITE);
  squareFar.tint = 0xff0000;
  squareFar.factor = 1;
  squareFar.anchor.set(0.5);
  squareFar.position.set(app.screen.width / 2, 50);

  // create a new Sprite from an image path
  var container = new PIXI.projection.Container2d();
  container.position.set(app.screen.width / 2, app.screen.height);

  var surfaceTexture = await ExpoPixi.textureAsync(require('../../assets/pixi/bkg.jpg'));
  var surface = new PIXI.projection.Sprite2d(surfaceTexture);
  surface.anchor.set(0.5, 1.0);
  //surface.scale.y = -1; //sorry, have to do that to make a correct projection
  surface.width = app.screen.width;
  surface.height = app.screen.height;
  //var squarePlane = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('required/assets/flowerTop.png'));
  var squarePlane = new PIXI.projection.Sprite2d(PIXI.Texture.WHITE);
  squarePlane.tint = 0xff0000;
  squarePlane.factor = 1;
  squarePlane.proj.affine = PIXI.projection.AFFINE.AXIS_X;
  squarePlane.anchor.set(0.5, 0.0);
  squarePlane.position.set(-app.screen.width / 4, -app.screen.height / 2);

  var bunnyTexture = await ExpoPixi.spriteAsync(require('../../assets/pixi/flowerTop.png'));

  var bunny = new PIXI.projection.Sprite2d(bunnyTexture);
  bunny.anchor.set(0.5, 1.0);

  app.stage.addChild(container);
  app.stage.addChild(squareFar);
  container.addChild(surface);
  container.addChild(squarePlane);
  squarePlane.addChild(bunny);

  // Listen for animate update
  app.ticker.add(function(delta) {
    // clear the projection
    container.proj.clear();
    container.updateTransform();
    // now we can get local coords for points of perspective
    let pos = container.toLocal(squareFar.position);
    //need to invert this thing, otherwise we'll have to use scale.y=-1 which is not good
    pos.y = -pos.y;
    pos.x = -pos.x;
    container.proj.setAxisY(pos, -squareFar.factor);

    squarePlane.proj.affine = squarePlane.factor
      ? PIXI.projection.AFFINE.AXIS_X
      : PIXI.projection.AFFINE.NONE;
  });

  addInteraction(squareFar);
  addInteraction(squarePlane);
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
    } else if (obj == squarePlane) {
      //plane bounds
      obj.position.x = Math.min(
        Math.max(obj.position.x, -app.screen.width / 2 + 10),
        app.screen.width / 2 - 10
      );
      obj.position.y = Math.min(Math.max(obj.position.y, -app.screen.height + 10), 10);
    } else {
      //far
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
    event.stopPropagation();
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

    event.stopPropagation();
    // set the interaction data to null
  }

  function onDragMove(event) {
    var obj = event.currentTarget;
    if (!obj.dragging) return;
    event.stopPropagation();
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
