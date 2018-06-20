import React from 'react';

import Data from '../screens';
import List from './List';
import StoreReviewButton from './StoreReviewButton';
import LinkButton from './LinkButton';

class Page extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const title = params.title || 'Expo Three';
    const isPage = typeof params.data === 'function';
    let url;
    if (isPage) {
      url = params.data.url;
    }

    const headerRight = url ? <LinkButton url={url} /> : <StoreReviewButton />;
    return {
      title,
      headerRight,
    };
  };

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
