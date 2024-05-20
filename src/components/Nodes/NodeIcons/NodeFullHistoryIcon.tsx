import { faHistory } from 'icons/regular';
import { NodeType, NodeTypeEnum } from 'types';

import { NodeIcon } from './NodeIcon';

export const NodeFullHistoryIcon = ({
  node,
  small
}: {
  node: NodeType;
  small?: boolean;
}) => {
  if (node.type === NodeTypeEnum.observer && node.fullHistory) {
    return <NodeIcon title='Full History' icon={faHistory} small={small} />;
  }

  return null;
};
