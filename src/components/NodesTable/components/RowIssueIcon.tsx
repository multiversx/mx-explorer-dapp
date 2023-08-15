import React from 'react';
import { faExclamationTriangle, faLock, faSync } from 'icons/regular';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'components';
import { getNodeIssue } from 'helpers';
import { NodeType } from 'types';

export const getIcon = (node: NodeType) => {
  let icon;

  switch (true) {
    case node.status === 'jailed':
      icon = faLock;
      break;

    case node.issues && node.issues.length > 0:
      icon = faExclamationTriangle;
      break;

    case node.receivedShardID !== node.computedShardID:
      icon = faSync;
      break;

    default:
      icon = null;
  }

  return icon;
};

export const RowIssueIcon = ({
  node,
  small
}: {
  node: NodeType;
  small?: boolean;
}) => {
  const icon = getIcon(node);

  if (icon) {
    switch (true) {
      case node.status === 'jailed':
        return (
          <Overlay title='Jailed' className='node-icon'>
            <FontAwesomeIcon
              icon={icon}
              className='text-danger ms-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.issues && node.issues.length > 0: {
        return (
          <Overlay title={getNodeIssue(node)} className='node-icon'>
            <FontAwesomeIcon
              icon={icon}
              className='ms-1 text-warning'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );
      }
    }
  }

  return null;
};
