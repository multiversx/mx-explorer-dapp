import { getNodeIcon } from 'helpers';
import { NodeType, NodeStatusEnum, NodeTypeEnum } from 'types';

import { NodeChangingShardIcon } from './NodeChangingShardIcon';
import { NodeIcon } from './NodeIcon';

export const NodeStatusIcon = ({
  node,
  small
}: {
  node: NodeType;
  small?: boolean;
}) => {
  if (node.receivedShardID !== node.computedShardID) {
    return <NodeChangingShardIcon node={node} small={small} />;
  }

  const icon = getNodeIcon(node);
  if (icon) {
    switch (true) {
      case node.type === NodeTypeEnum.observer:
        return <NodeIcon title='Observer' icon={icon} small={small} />;

      case node.status === NodeStatusEnum.new:
        return <NodeIcon title='New' icon={icon} small={small} />;

      case node.status === NodeStatusEnum.inactive:
        return <NodeIcon title='Inactive' icon={icon} small={small} />;

      case node.status === NodeStatusEnum.waiting:
        return <NodeIcon title='Waiting' icon={icon} small={small} />;

      case node.status === NodeStatusEnum.queued:
        return <NodeIcon title='Queued' icon={icon} small={small} />;

      case node.status === NodeStatusEnum.auction:
        return <NodeIcon title='Auction' icon={icon} small={small} />;
    }
  }

  return null;
};
