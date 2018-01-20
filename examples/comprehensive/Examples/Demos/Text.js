import ExpoPixi from 'expo-pixi';
import 'pixi.js';

export default (basic = async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  // // Load them google fonts before starting...!
  window.WebFontConfig = {
    google: {
      families: ['Snippet', 'Arvo:700italic', 'Podkova:700'],
    },

    active: function() {
      // do something
      init();
    },
  };

  // include the web-font loader script
  /* jshint ignore:start */
  (function() {
    var wf = document.createElement('script');
    wf.src =
      ('https:' === document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();
  /* jshint ignore:end */

  async function init() {
    PIXI.loader.add('desyrel', 'required/assets/desyrel.xml').load(onAssetsLoaded);

    function onAssetsLoaded() {
      var bitmapFontText = new PIXI.extras.BitmapText('bitmap fonts are\n now supported!', {
        font: '35px Desyrel',
        align: 'right',
      });

      bitmapFontText.x = app.renderer.width - bitmapFontText.textWidth - 20;
      bitmapFontText.y = 20;

      app.stage.addChild(bitmapFontText);
    }

    // add a shiny background...
    var background = await ExpoPixi.spriteAsync(require('../../assets/pixi/textDemoBG.jpg'));
    background.width = app.renderer.width;
    background.height = app.renderer.height;
    app.stage.addChild(background);

    // create some white text using the Snippet webfont
    var textSample = new PIXI.Text('Pixi.js can has\n multiline text!', {
      fontFamily: 'Snippet',
      fontSize: 35,
      fill: 'white',
      align: 'left',
    });
    textSample.position.set(20);

    // create a text object with a nice stroke
    var spinningText = new PIXI.Text("I'm fun!", {
      fontWeight: 'bold',
      fontSize: 60,
      fontFamily: 'Arial',
      fill: '#cc00ff',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 6,
    });

    // setting the anchor point to 0.5 will center align the text... great for spinning!
    spinningText.anchor.set(0.5);
    spinningText.x = app.renderer.width / 2;
    spinningText.y = app.renderer.height / 2;

    // create a text object that will be updated...
    var countingText = new PIXI.Text('COUNT 4EVAR: 0', {
      fontWeight: 'bold',
      fontStyle: 'italic',
      fontSize: 60,
      fontFamily: 'Arvo',
      fill: '#3e1707',
      align: 'center',
      stroke: '#a4410e',
      strokeThickness: 7,
    });

    countingText.x = app.renderer.width / 2;
    countingText.y = 500;
    countingText.anchor.x = 0.5;

    app.stage.addChild(textSample, spinningText, countingText);

    var count = 0;

    app.ticker.add(function() {
      count += 0.05;
      // update the text with a new string
      countingText.text = 'COUNT 4EVAR: ' + Math.floor(count);

      // let's spin the spinning text
      spinningText.rotation += 0.03;
    });
  }
});
