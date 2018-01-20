import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  // use empty array if you dont want to use detect feature
  var extensions = PIXI.compressedTextures.detectExtensions(app.renderer);

  var loader = new PIXI.loaders.Loader();
  loader.pre(PIXI.compressedTextures.extensionChooser(extensions));
  // use @2x texture if resolution is 2, use dds format if its windows
  var textureOptions1 = {
    metadata: { choice: ['@2x.png', '.dds', '@2x.dds'] },
  };
  // use dds format if its windows but dont care for retina
  var textureOptions2 = { metadata: { choice: ['.dds'] } };
  // while loading atlas, choose resolution for atlas and choose format for image
  var atlasOptions = {
    metadata: {
      choice: ['@2x.json', '@1x.json'],
      imageMetadata: { choice: ['.dds'] },
    },
  };

  loader
    .add(
      'building1',
      'required/assets/compressed/building1.png',
      textureOptions1,
    )
    .add(
      'building2',
      'required/assets/compressed/building2.png',
      textureOptions2,
    )
    .add('atlas1', 'required/assets/compressed/buildings.json', atlasOptions)
    .load(function(loader, resources) {
      var spr1 = new PIXI.Sprite(resources.building1.texture);
      var spr2 = new PIXI.Sprite(resources.building2.texture);
      var spr3 = new PIXI.Sprite.fromImage('goldmine_10_5.png');
      var spr4 = new PIXI.Sprite.fromImage('wind_extractor_10.png');
      spr1.y = spr3.y = 150;
      spr2.y = spr4.y = 350;
      spr1.x = spr2.x = 250;
      spr3.x = spr4.x = 450;
      app.stage.addChild(spr1, spr2, spr3, spr4);
    });

  // ATTENTION: PIXI recognizes resolution of atlas by suffix (@1x, @2x, ... )
  // If you dont specify that, resolution of the atlas will be taken from "meta.scale"
  // which in our example is 1 and 0.5 instead of 2 and 1. It will shrink everything!
});
