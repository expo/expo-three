import { Constants } from 'expo';
import React from 'react';

import Colors from '../constants/Colors';
import Settings from '../constants/Settings';
import Data from '../screens';
import LinkButton from './LinkButton';
import List from './List';
import StoreReviewButton from './StoreReviewButton';

class Page extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const title = params.title || Constants.manifest.name;
    const isPage = typeof params.data === 'function';
    let url;
    if (isPage) {
      url = params.data.url;
    }

    let headerRight;
    // Apple may sometimes reject your app for invoking SKStoreReview in a button, sometimes they won't... let's just disable it during review.
    if (!Settings.isInAppleReview) {
      headerRight = url ? <LinkButton url={url} /> : <StoreReviewButton />;
    }

    return {
      title,
      headerRight,
      headerTintColor: Colors.primaryColor,
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
