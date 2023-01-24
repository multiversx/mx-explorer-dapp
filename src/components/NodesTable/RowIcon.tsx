import * as React from 'react';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faEye } from '@fortawesome/pro-regular-svg-icons/faEye';
import { faFlagAlt } from '@fortawesome/pro-regular-svg-icons/faFlagAlt';
import { faLeaf } from '@fortawesome/pro-regular-svg-icons/faLeaf';
import { faSnooze } from '@fortawesome/pro-regular-svg-icons/faSnooze';
import { faSync } from '@fortawesome/pro-regular-svg-icons/faSync';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Overlay } from 'components';
import { NodeType } from 'types';

export const getIcon = (node: NodeType) => {
  let icon;

  switch (true) {
    case node.type === 'observer':
      icon = faEye;
      break;

    case node.status === 'new':
      icon = faLeaf;
      break;

    case node.status === 'inactive':
      icon = faSnooze;
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

export const RowIcon = ({
  node,
  small
}: {
  node: NodeType;
  small?: boolean;
}) => {
  const icon = getIcon(node);

  if (icon) {
    switch (true) {
      case node.type === 'observer':
        return (
          <Overlay title='Observer'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-300 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.status === 'new':
        return (
          <Overlay title='New'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-300 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.status === 'inactive':
        return (
          <Overlay title='Inactive'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-300 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.receivedShardID !== node.computedShardID:
        return (
          <Overlay title='Changing shard'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-300 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.status === 'waiting':
        return (
          <Overlay title='Waiting'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-300 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.status === 'queued':
        return (
          <Overlay title='Queued'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-300 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );
    }
  }

  return null;
};
