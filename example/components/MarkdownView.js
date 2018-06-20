import React from 'react';
import Markdown from 'react-native-simple-markdown';
import AssetUtils from 'expo-asset-utils';
import { FileSystem } from 'expo';
import { View } from 'react-native';
class MarkdownView extends React.Component {
  state = { contents: null };

  async componentDidMount() {
    const uri = await AssetUtils.uriAsync(this.props.asset);

    const contents = await FileSystem.readAsStringAsync(uri);
    this.setState({ contents });
  }
  render() {
    const { styles, asset, ...props } = this.props;
    const { contents } = this.state;
    if (!contents) {
      return null;
    }
    return (
      <View style={{ padding: 12 }}>
        <Markdown
          {...props}
          styles={[...markdownStyles, ...(styles || {})]}
          children={contents}
        />
      </View>
    );
  }
}

const markdownStyles = {
  heading1: {
    fontSize: 24,
    color: 'purple',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heading2: {
    fontSize: 18,
    color: 'purple',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  link: {
    color: 'pink',
  },
  mailTo: {
    color: 'orange',
  },
  text: {
    color: '#555555',
  },
};

export default MarkdownView;
