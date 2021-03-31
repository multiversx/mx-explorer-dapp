import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faEye } from '@fortawesome/pro-regular-svg-icons/faEye';
import { faLeaf } from '@fortawesome/pro-regular-svg-icons/faLeaf';
import { faLock } from '@fortawesome/pro-regular-svg-icons/faLock';
import { faSync } from '@fortawesome/pro-regular-svg-icons/faSync';
import { faFlagAlt } from '@fortawesome/pro-regular-svg-icons/faFlagAlt';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { faSnooze } from '@fortawesome/pro-regular-svg-icons/faSnooze';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NodeType } from 'context/state';
import { nodeIssue } from 'helpers';

const Overlay = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <OverlayTrigger
    placement="top"
    delay={{ show: 0, hide: 400 }}
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

    case node.type === 'observer':
      icon = faEye;
      break;

    case node.status === 'new':
      icon = faLeaf;
      break;

    case node.status === 'inactive':
      icon = faSnooze;
      break;

    case node.issues && node.issues.length > 0:
      icon = faExclamationTriangle;
      break;

    case node.receivedShardID !== node.computedShardID:
      icon = faSync;
      break;

    case node.status === 'waiting':
      icon = faClock;
      break;

    case node.status === 'queued':
      icon = faFlagAlt;
      break;

    default:
      icon = null;
  }

  return icon;
};

export default class RowIcon extends React.Component<{ node: NodeType; small?: boolean }> {
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
                className="text-danger mr-1"
                size={small ? 'xs' : '1x'}
              />
            </Overlay>
          );

        case node.type === 'observer':
          return (
            <Overlay title="Observer">
              <FontAwesomeIcon
                icon={icon}
                className="text-secondary mr-1"
                size={small ? 'xs' : '1x'}
              />
            </Overlay>
          );

        case node.status === 'new':
          return (
            <Overlay title="New">
              <FontAwesomeIcon
                icon={icon}
                className="text-secondary mr-1"
                size={small ? 'xs' : '1x'}
              />
            </Overlay>
          );

        case node.status === 'inactive':
          return (
            <Overlay title="Inactive">
              <FontAwesomeIcon
                icon={icon}
                className="text-secondary mr-1"
                size={small ? 'xs' : '1x'}
              />
            </Overlay>
          );

        case node.issues && node.issues.length > 0: {
          return (
            <Overlay title={nodeIssue(node)}>
              <FontAwesomeIcon
                icon={icon}
                className="mr-1 text-warning"
                size={small ? 'xs' : '1x'}
              />
            </Overlay>
          );
        }

        case node.receivedShardID !== node.computedShardID:
          return (
            <Overlay title="Changing shard">
              <FontAwesomeIcon
                icon={icon}
                className="text-secondary mr-1"
                size={small ? 'xs' : '1x'}
              />
            </Overlay>
          );

        case node.status === 'waiting':
          return (
            <Overlay title="Waiting">
              <FontAwesomeIcon
                icon={icon}
                className="text-secondary mr-1"
                size={small ? 'xs' : '1x'}
              />
            </Overlay>
          );

        case node.status === 'queued':
          return (
            <Overlay title="Queued">
              <FontAwesomeIcon
                icon={icon}
                className="text-secondary mr-1"
                size={small ? 'xs' : '1x'}
              />
            </Overlay>
          );
      }
    }

    return null;
  }
}
