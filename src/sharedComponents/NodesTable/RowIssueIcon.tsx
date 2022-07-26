import * as React from 'react';
import { faLock } from '@fortawesome/pro-regular-svg-icons/faLock';
import { faSync } from '@fortawesome/pro-regular-svg-icons/faSync';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { nodeIssue } from 'helpers';
import { NodeType } from 'helpers/types';
import { Overlay } from 'sharedComponents';

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

const RowIssueIcon = ({ node, small }: { node: NodeType; small?: boolean }) => {
  const icon = getIcon(node);

  if (icon) {
    switch (true) {
      case node.status === 'jailed':
        return (
          <Overlay title="Jailed">
            <FontAwesomeIcon icon={icon} className="text-danger ml-1" size={small ? 'xs' : '1x'} />
          </Overlay>
        );

      case node.issues && node.issues.length > 0: {
        return (
          <Overlay title={nodeIssue(node)}>
            <FontAwesomeIcon icon={icon} className="ml-1 text-warning" size={small ? 'xs' : '1x'} />
          </Overlay>
        );
      }
    }
  }

  return null;
};

export default RowIssueIcon;
