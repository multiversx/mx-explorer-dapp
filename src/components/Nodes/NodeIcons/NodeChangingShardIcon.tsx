import { getNodeIcon } from 'helpers';
import { NodeType } from 'types';

import { NodeIcon } from './NodeIcon';

export const NodeChangingShardIcon = ({
  node,
  small
}: {
  node: NodeType;
  small?: boolean;
}) => {
  const icon = getNodeIcon(node);

  if (icon && node.receivedShardID !== node.computedShardID) {
    return <NodeIcon title='Changing Shard' icon={icon} small={small} />;
  }

  return null;
};
