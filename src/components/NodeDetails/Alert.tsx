import * as React from 'react';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NodeType } from 'context/state';
import RowIssueIcon from 'sharedComponents/NodesTable/RowIssueIcon';
import { nodeIssue } from 'helpers';

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="d-flex align-items-center">{children}</div>
);

const Alert = ({ node }: { node: NodeType }) => {
  switch (true) {
    case node.status === 'jailed':
      return (
        <Container>
          <RowIssueIcon node={node} small={true} />
          <small className="text-danger ml-1">Jailed</small>
        </Container>
      );
    case node.issues && node.issues.length > 0:
      return (
        <Container>
          <RowIssueIcon node={node} small={true} />
          <small className="text-warning ml-1">{nodeIssue(node)}</small>
        </Container>
      );
    case node.online === false:
      return (
        <Container>
          <FontAwesomeIcon icon={faExclamationTriangle} size="xs" className="text-warning mr-1" />
          <small className={`ml-1 ${node.type === 'observer' ? 'text-muted' : ''}`}>
            &nbsp;Offline
          </small>
        </Container>
      );

    default:
      return null;
  }
};
export default Alert;
