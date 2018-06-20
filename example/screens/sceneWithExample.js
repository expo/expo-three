import React from 'react';
import { View as GraphicsView } from 'expo-graphics';
import TouchableView from '../components/TouchableView';

function sceneWithExample(example) {
  const Example = example.default;

  let nextClass = function() {
    const stage = new Example();
    return (
      <TouchableView style={{ flex: 1 }}>
        <GraphicsView {...stage} />
      </TouchableView>
    );
  };
  nextClass.url = Example.url;

  return nextClass;
}

export default sceneWithExample;
