import ExpoPixi, { PIXI } from 'expo-pixi';
import { Asset } from 'expo';

export default async context => {
  const app = ExpoPixi.application({
    context,
  });

  const asset = Asset.fromModule(require('../../assets/pixi/fighter.json'));
  await asset.downloadAsync();

  PIXI.loader.add(asset.localUri, onAssetsLoaded).load();

  function onAssetsLoaded() {
    // create an array of textures from an image path
    const frames = [];

    for (let i = 0; i < 30; i++) {
      const val = i < 10 ? '0' + i : i;

      // magically works since the spritesheet was loaded with the pixi loader
      frames.push(PIXI.Texture.fromFrame('rollSequence00' + val + '.png'));
    }

    // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
    const anim = new PIXI.extras.AnimatedSprite(frames);

    /*
 * An AnimatedSprite inherits all the properties of a PIXI sprite
 * so you can change its position, its anchor, mask it, etc
 */
    anim.x = app.renderer.width / 2;
    anim.y = app.renderer.height / 2;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.5;
    anim.play();

    app.stage.addChild(anim);

    // Animate the rotation
    app.ticker.add(function() {
      anim.rotation += 0.01;
    });
  }
};
