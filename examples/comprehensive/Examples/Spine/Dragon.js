import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  app.stop();

  ///TODO: Load Json
  // load spine data
  PIXI.loader
    .add('dragon', 'required/assets/spine/dragon.json')
    .load(onAssetsLoaded);

  var dragon = null;

  function onAssetsLoaded(loader, res) {
    // instantiate the spine animation
    dragon = new PIXI.spine.Spine(res.dragon.spineData);
    dragon.skeleton.setToSetupPose();
    dragon.update(0);
    dragon.autoUpdate = false;

    // create a container for the spine animation and add the animation to it
    var dragonCage = new PIXI.Container();
    dragonCage.addChild(dragon);

    // measure the spine animation and position it inside its container to align it to the origin
    var localRect = dragon.getLocalBounds();
    dragon.position.set(-localRect.x, -localRect.y);

    // now we can scale, position and rotate the container as any other display object
    var scale = Math.min(
      app.renderer.width * 0.7 / dragonCage.width,
      app.renderer.height * 0.7 / dragonCage.height,
    );
    dragonCage.scale.set(scale, scale);
    dragonCage.position.set(
      (app.renderer.width - dragonCage.width) * 0.5,
      (app.renderer.height - dragonCage.height) * 0.5,
    );

    // add the container to the stage
    app.stage.addChild(dragonCage);

    // once position and scaled, set the animation to play
    dragon.state.setAnimation(0, 'flying', true);

    app.start();
  }

  app.ticker.add(function() {
    // update the spine animation, only needed if dragon.autoupdate is set to false
    dragon.update(0.01666666666667); // HARDCODED FRAMERATE!
  });
});
