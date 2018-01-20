import ExpoPixi, { PIXI } from 'expo-pixi';

export default (container = async context => {
  const PAD = 80;
  //the plugin is here: https://github.com/pixijs/pixi-display/tree/layers, its WIP
  const app = ExpoPixi.application({
    context,
  });

  //create the stage instead of container
  app.stage = new PIXI.display.Stage();

  const backgroundTexture = await ExpoPixi.textureAsync(require('../../assets/pixi/p2.jpeg'));
  var background = new PIXI.extras.TilingSprite(backgroundTexture, WIDTH, HEIGHT);
  app.stage.addChild(background);
  //make container for bunnies
  var bunnyWorld = new PIXI.Container();
  app.stage.addChild(bunnyWorld);

  var lighting = new PIXI.display.Layer();
  lighting.on('display', function(element) {
    element.blendMode = PIXI.BLEND_MODES.ADD;
  });
  lighting.filters = [new PIXI.filters.VoidFilter()];
  lighting.filters[0].blendMode = PIXI.BLEND_MODES.MULTIPLY;

  lighting.filterArea = new PIXI.Rectangle(0, 0, WIDTH, HEIGHT);
  // lighting.filterArea = new PIXI.Rectangle(100, 100, 600, 400); //<-- try uncomment it

  app.stage.addChild(lighting);

  var ambient = new PIXI.Graphics();
  ambient.beginFill(0x808080, 1.0);
  ambient.drawRect(0, 0, WIDTH, HEIGHT);
  ambient.endFill();
  lighting.addChild(ambient); //<-- try comment it

  var bunnyTexture = await ExpoPixi.textureAsync(require('../../assets/pixi/bunny.png'));
  function updateBunny(bunny) {
    bunny.x += bunny.vx;
    bunny.y += bunny.vy;
    if (bunny.x > WIDTH + PAD) {
      bunny.x -= WIDTH + 2 * PAD;
    }
    if (bunny.x < -PAD) {
      bunny.x += WIDTH + 2 * PAD;
    }
    if (bunny.y > HEIGHT + PAD) {
      bunny.y -= HEIGHT + 2 * PAD;
    }
    if (bunny.y < -PAD) {
      bunny.y += HEIGHT + 2 * PAD;
    }
  }

  function createBunny() {
    var bunny = new PIXI.Sprite(bunnyTexture);
    bunny.update = updateBunny;

    var angle = Math.random() * Math.PI * 2;
    var speed = 200.0; //px per second
    bunny.vx = Math.cos(angle) * speed / 60.0;
    bunny.vy = Math.sin(angle) * speed / 60.0;
    bunny.position.set(Math.random() * WIDTH, Math.random() * HEIGHT);
    bunny.anchor.set(0.5, 0.5);

    var lightbulb = new PIXI.Graphics();
    var rr = (Math.random() * 0x80) | 0;
    var rg = (Math.random() * 0x80) | 0;
    var rb = (Math.random() * 0x80) | 0;
    var rad = 50 + Math.random() * 20;
    lightbulb.beginFill((rr << 16) + (rg << 8) + rb, 1.0);
    lightbulb.drawCircle(0, 0, rad);
    lightbulb.endFill();
    lightbulb.parentLayer = lighting; //<-- try comment it

    bunny.addChild(lightbulb);

    return bunny;
  }

  for (var i = 0; i < 40; i++) {
    bunnyWorld.addChild(createBunny());
  }

  app.ticker.add(function() {
    bunnyWorld.children.forEach(updateBunny);
  });
});
