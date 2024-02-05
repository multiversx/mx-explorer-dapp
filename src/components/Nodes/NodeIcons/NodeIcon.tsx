import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'components';
import { getNodeIcon } from 'helpers';
import { NodeType } from 'types';

export const NodeIcon = ({
  node,
  small
}: {
  node: NodeType;
  small?: boolean;
}) => {
  const icon = getNodeIcon(node);

  if (icon) {
    switch (true) {
      case node.type === 'observer':
        return (
          <Overlay title='Observer' className='node-icon'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-400 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.status === 'new':
        return (
          <Overlay title='New' className='node-icon'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-400 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.status === 'inactive':
        return (
          <Overlay title='Inactive' className='node-icon'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-400 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.receivedShardID !== node.computedShardID:
        return (
          <Overlay title='Changing shard' className='node-icon'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-400 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.status === 'waiting':
        return (
          <Overlay title='Waiting' className='node-icon'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-400 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.status === 'queued':
        return (
          <Overlay title='Queued' className='node-icon'>
            <FontAwesomeIcon
              icon={icon}
              className='text-neutral-400 me-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );
    }
  }

  return null;
};
