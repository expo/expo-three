import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  // load spine data
  PIXI.loader
    .add('goblins', 'required/assets/spine/goblins.json')
    .load(onAssetsLoaded);

  app.stage.interactive = true;
  app.stage.buttonMode = true;

  function onAssetsLoaded(loader, res) {
    var goblin = new PIXI.spine.Spine(res.goblins.spineData);

    // set current skin
    goblin.skeleton.setSkinByName('goblin');
    goblin.skeleton.setSlotsToSetupPose();

    // set the position
    goblin.x = 400;
    goblin.y = 600;

    goblin.scale.set(1.5);

    // play animation
    goblin.state.setAnimation(0, 'walk', true);

    app.stage.addChild(goblin);

    app.stage.on('pointertap', function() {
      // change current skin
      var currentSkinName = goblin.skeleton.skin.name;
      var newSkinName = currentSkinName === 'goblin' ? 'goblingirl' : 'goblin';
      goblin.skeleton.setSkinByName(newSkinName);
      goblin.skeleton.setSlotsToSetupPose();
    });
  }
});
