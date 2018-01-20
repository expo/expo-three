import ExpoPixi, { PIXI } from 'expo-pixi';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  /// TODO: text
  var basicText = new PIXI.Text('Basic text in pixi');
  basicText.x = 30;
  basicText.y = 90;

  app.stage.addChild(basicText);

  var style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
  });

  var richText = new PIXI.Text('Rich text with a lot of options and across multiple lines', style);
  richText.x = 30;
  richText.y = 180;

  app.stage.addChild(richText);
});
