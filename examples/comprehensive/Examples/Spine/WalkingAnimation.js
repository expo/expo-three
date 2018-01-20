import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  // load spine data
  PIXI.loader
    .add('spineboy', 'required/assets/spine/spineboy.json')
    .load(onAssetsLoaded);

  app.stage.interactive = true;

  function onAssetsLoaded(loader, res) {
    // create a spine boy
    var spineBoy = new PIXI.spine.Spine(res.spineboy.spineData);

    // set the position
    spineBoy.x = app.renderer.width / 2;
    spineBoy.y = app.renderer.height;

    spineBoy.scale.set(1.5);

    // set up the mixes!
    spineBoy.stateData.setMix('walk', 'jump', 0.2);
    spineBoy.stateData.setMix('jump', 'walk', 0.4);

    // play animation
    spineBoy.state.setAnimation(0, 'walk', true);

    app.stage.addChild(spineBoy);

    app.stage.on('pointerdown', function() {
      spineBoy.state.setAnimation(0, 'jump', false);
      spineBoy.state.addAnimation(0, 'walk', true, 0);
    });
  }
});
