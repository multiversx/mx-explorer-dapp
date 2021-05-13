import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faLock } from '@fortawesome/pro-regular-svg-icons/faLock';
import { faSync } from '@fortawesome/pro-regular-svg-icons/faSync';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NodeType } from 'context/state';
import { nodeIssue } from 'helpers';

const Overlay = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <OverlayTrigger
    placement="top"
    delay={{ show: 0, hide: 0 }}
    overlay={(props) => (
      <Tooltip id="button-tooltip" {...props}>
        {title}
      </Tooltip>
    )}
  >
    {children}
  </OverlayTrigger>
);

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

export default class RowIssueIcon extends React.Component<{ node: NodeType; small?: boolean }> {
  render() {
    const { node, small } = this.props;
    const icon = getIcon(node);

    if (icon) {
      switch (true) {
        case node.status === 'jailed':
          return (
            <Overlay title="Jailed">
              <FontAwesomeIcon
                icon={icon}
                className="text-danger ml-1"
                size={small ? 'xs' : '1x'}
              />
            </Overlay>
          );

        case node.issues && node.issues.length > 0: {
          return (
            <Overlay title={nodeIssue(node)}>
              <FontAwesomeIcon
                icon={icon}
                className="ml-1 text-warning"
                size={small ? 'xs' : '1x'}
              />
            </Overlay>
          );
        }
      }
    }

    return null;
  }
}
