import * as React from 'react';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NodeType } from 'context/state';
import RowIcon from 'sharedComponents/NodesTable/RowIcon';
import { nodeIssue } from 'helpers';

const Container = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const Alert = ({ node }: { node: NodeType }) => {
  switch (true) {
    case node.status === 'jailed':
      return (
        <Container>
          <RowIcon node={node} small={true} />
          <small className="text-danger mt-1">Jailed</small>
        </Container>
      );
    case node.issues && node.issues.length > 0:
      return (
        <Container>
          <RowIcon node={node} small={true} />
          <small className="text-warning mt-1">{nodeIssue(node)}</small>
        </Container>
      );
    case node.online === false:
      return (
        <Container>
          <FontAwesomeIcon icon={faExclamationTriangle} size="xs" className="text-warning mr-1" />
          <small className={`mt-1 ${node.type === 'observer' ? 'text-muted' : ''}`}>
            &nbsp;Offline
          </small>
        </Container>
      );

    default:
      return null;
  }
};
export default Alert;
