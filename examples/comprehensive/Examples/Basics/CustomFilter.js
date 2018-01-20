import ExpoPixi, { PIXI } from 'expo-pixi';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  // Create background image
  var background = await ExpoPixi.spriteAsync(require('../../assets/pixi/bkg-grass.jpg'));
  background.width = app.renderer.width;
  background.height = app.renderer.height;
  app.stage.addChild(background);

  // Stop application wait for load to finish
  app.stop();

  /// TODO: shader load
  PIXI.loader.add('shader', 'required/assets/basics/shader.frag').load(onLoaded);

  var filter;

  // Handle the load completed
  function onLoaded(loader, res) {
    // Create the new filter, arguments: (vertexShader, framentSource)
    filter = new PIXI.Filter(null, res.shader.data);

    // Add the filter
    background.filters = [filter];

    // Resume application update
    app.start();
  }

  // Animate the filter
  app.ticker.add(function(delta) {
    filter.uniforms.customUniform += 0.04 * delta;
  });
});
