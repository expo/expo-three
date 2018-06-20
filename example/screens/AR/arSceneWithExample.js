import { Permissions } from 'expo';
import React from 'react';

import PermissionGuard from '../../components/PermissionGuard';

function arSceneWithExample(example) {
  const Example = example.default;

  let nextClass = function() {
    return (
      <PermissionGuard permission={Permissions.CAMERA}>
        <Example />
      </PermissionGuard>
    );
  };
  nextClass.url = Example.url;

  return nextClass;
}

export default arSceneWithExample;
