import { getNodeIssue, getNodeIssueIcon } from 'helpers';
import { NodeType } from 'types';

import { NodeIcon } from './NodeIcon';

export const NodeIssueIcon = ({
  node,
  small
}: {
  node: NodeType;
  small?: boolean;
}) => {
  const icon = getNodeIssueIcon(node);

  if (icon) {
    switch (true) {
      case node.status === 'jailed':
        return (
          <NodeIcon
            title='Jailed'
            icon={icon}
            small={small}
            className='text-danger'
          />
        );

      case node.issues && node.issues.length > 0: {
        return (
          <NodeIcon
            title={getNodeIssue(node)}
            icon={icon}
            small={small}
            className='text-warning'
          />
        );
      }
    }
  }

  return null;
};
