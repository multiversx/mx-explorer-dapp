import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'components';
import { getNodeIssue, getNodeIssueIcon } from 'helpers';
import { NodeType } from 'types';

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
          <Overlay title='Jailed' className='node-icon'>
            <FontAwesomeIcon
              icon={icon}
              className='text-danger ms-1'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );

      case node.issues && node.issues.length > 0: {
        return (
          <Overlay title={getNodeIssue(node)} className='node-icon'>
            <FontAwesomeIcon
              icon={icon}
              className='ms-1 text-warning'
              size={small ? 'xs' : '1x'}
            />
          </Overlay>
        );
      }
    }
  }

  return null;
};
