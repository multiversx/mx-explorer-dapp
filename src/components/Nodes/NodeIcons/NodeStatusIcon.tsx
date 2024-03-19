import { getNodeIcon } from 'helpers';
import { NodeType } from 'types';

import { NodeIcon } from './NodeIcon';

export const NodeStatusIcon = ({
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
        return <NodeIcon title='Observer' icon={icon} small={small} />;

      case node.status === 'new':
        return <NodeIcon title='New' icon={icon} small={small} />;

      case node.status === 'inactive':
        return <NodeIcon title='Inactive' icon={icon} small={small} />;

      case node.receivedShardID !== node.computedShardID:
        return <NodeIcon title='Changing Shard' icon={icon} small={small} />;

      case node.status === 'waiting':
        return <NodeIcon title='Waiting' icon={icon} small={small} />;

      case node.status === 'queued':
        return <NodeIcon title='Queued' icon={icon} small={small} />;

      case node.status === 'auction':
        return <NodeIcon title='Auction' icon={icon} small={small} />;
    }
  }

  return null;
};
