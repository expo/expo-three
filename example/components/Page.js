import React from 'react';

import Data from '../screens';
import List from './List';

class Page extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).title || 'Expo Three',
  });

  render() {
    const data = (this.props.navigation.state.params || {}).data || Data;
    const shouldRenderPage = typeof data === 'function';
    if (shouldRenderPage) {
      const InputType = data;
      return <InputType />;
    } else {
      return (
        <List
          data={Object.keys(data)}
          onPress={item => {
            const nextData = data[item];
            this.props.navigation.push('Page', {
              data: nextData,
              title: item,
            });
          }}
        />
      );
    }
  }
}

export default Page;
