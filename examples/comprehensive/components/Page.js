import React from 'react';

import Examples from '../Examples';
import List from './List';
import PixiBaseView from './PixiBaseView';

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

class Page extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).title || 'Pixi.js',
  });

  render() {
    const data = (this.props.navigation.state.params || {}).data || Examples;
    const shouldRenderPage = isFunction(data.default || {});
    if (shouldRenderPage) {
      return <PixiBaseView app={data.default} />;
    } else {
      return (
        <List
          data={Object.keys(data)}
          onPress={item => {
            const nextData = data[item];
            this.props.navigation.navigate('Page', {
              data: nextData,
              title: item,
            });
          }}
        />
      );
    }
    return null;
  }
}

export default Page;
