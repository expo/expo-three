import ExpoTHREE, { THREE } from 'expo-three';

import Assets from '../../Assets';
import ThreeStage from './ThreeStage';

class XLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();

    const model = Assets.models.xfile;
    const object = await ExpoTHREE.loadAsync(
      model['SSR06_Born2.x'],
      null,
      name => model.texture[name]
    );

    // let models = [];
    // let skeletons = [];
    // let animates = [];
    // let actions = {};
    // for (let i = 0; i < object.FrameInfo.length; i++) {
    //   models.push(object.FrameInfo[i]);
    //   let childModel = models[i];

    //   if (childModel instanceof THREE.SkinnedMesh) {
    //     var skeletonHelper = new THREE.SkeletonHelper(childModel);
    //     skeletons.push(skeletonHelper);
    //     if (
    //       object.XAnimationObj !== undefined &&
    //       object.XAnimationObj.length !== 0
    //     ) {
    //       childModel.geometry.animations = [];
    //       childModel.geometry.animations.push(
    //         THREE.AnimationClip.parseAnimation(
    //           splitAnimation(
    //             object.XAnimationObj[0],
    //             'stand',
    //             10 * object.XAnimationObj[0].fps,
    //             11 * object.XAnimationObj[0].fps
    //           ),
    //           childModel.skeleton.bones
    //         )
    //       );
    //       childModel.geometry.animations.push(
    //         THREE.AnimationClip.parseAnimation(
    //           splitAnimation(
    //             object.XAnimationObj[0],
    //             'walk',
    //             50 * object.XAnimationObj[0].fps,
    //             80 * object.XAnimationObj[0].fps
    //           ),
    //           childModel.skeleton.bones
    //         )
    //       );
    //       childModel.geometry.animations.push(
    //         THREE.AnimationClip.parseAnimation(
    //           splitAnimation(
    //             object.XAnimationObj[0],
    //             'dash',
    //             140 * object.XAnimationObj[0].fps,
    //             160 * object.XAnimationObj[0].fps
    //           ),
    //           childModel.skeleton.bones
    //         )
    //       );
    //       childModel.geometry.animations.push(
    //         THREE.AnimationClip.parseAnimation(
    //           splitAnimation(
    //             object.XAnimationObj[0],
    //             'dashing',
    //             160 * object.XAnimationObj[0].fps,
    //             165 * object.XAnimationObj[0].fps
    //           ),
    //           childModel.skeleton.bones
    //         )
    //       );
    //       childModel.geometry.animations.push(
    //         THREE.AnimationClip.parseAnimation(
    //           splitAnimation(
    //             object.XAnimationObj[0],
    //             'damage',
    //             500 * object.XAnimationObj[0].fps,
    //             530 * object.XAnimationObj[0].fps
    //           ),
    //           childModel.skeleton.bones
    //         )
    //       );
    //       childModel.mixer = new THREE.AnimationMixer(childModel);
    //       animates.push(childModel.mixer);
    //       var stand = childModel.mixer.clipAction('stand');
    //       stand.setLoop(THREE.LoopRepeat);
    //       actions['stand'] = stand;
    //       var walk = childModel.mixer.clipAction('walk');
    //       walk.setLoop(THREE.LoopRepeat);
    //       walk.play();
    //       actions['walk'] = walk;
    //       var dash = childModel.mixer.clipAction('dash');
    //       dash.setLoop(THREE.LoopRepeat);
    //       actions['dash'] = dash;
    //       var dashing = childModel.mixer.clipAction('dashing');
    //       dashing.setLoop(THREE.LoopPingPong);
    //       actions['dashing'] = dashing;
    //       var damage = childModel.mixer.clipAction('damage');
    //       damage.setLoop(THREE.LoopRepeat);
    //       actions['damage'] = damage;
    //     }
    //   }
    // }

    // models.map(model => this.scene.add(model));
    // skeletons.map(skeleton => this.scene.add(skeleton));
    // this.animates = animates;
    // this.camera.position.z = -20;
    // this.camera.position.y = 15;
  }

  onRender(delta) {
    super.onRender(delta);
    // for (let i = 0; i < this.animates.length; i++) {
    //   this.animates[i].update(delta * 1000);
    // }
  }
}

export default XLoaderExample;
