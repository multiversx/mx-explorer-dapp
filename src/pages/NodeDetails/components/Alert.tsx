import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RowIssueIcon } from 'components/NodesTable/components/RowIssueIcon';
import { getNodeIssue } from 'helpers';
import { faExclamationTriangle } from 'icons/regular';
import { NodeType } from 'types';

export const Container = ({ children }: { children: React.ReactNode }) => (
  <div className='d-flex align-items-center'>{children}</div>
);

export const Alert = ({ node }: { node: NodeType }) => {
  switch (true) {
    case node.status === 'jailed':
      return (
        <Container>
          <RowIssueIcon node={node} small={true} />
          <small className='text-danger ms-1'>Jailed</small>
        </Container>
      );
    case node.issues && node.issues.length > 0:
      return (
        <Container>
          <RowIssueIcon node={node} small={true} />
          <small className='text-warning ms-1'>{getNodeIssue(node)}</small>
        </Container>
      );
    case node.online === false:
      return (
        <Container>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size='xs'
            className='text-warning me-1'
          />
          <small
            className={`ms-1 ${node.type === 'observer' ? 'text-muted' : ''}`}
          >
            &nbsp;Offline
          </small>
        </Container>
      );

    default:
      return null;
  }
};
