import * as React from 'react';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NodeType } from 'context/state';
import RowIcon from 'sharedComponents/NodesTable/RowIcon';
import { nodeIssue } from 'helpers';

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="row">
    <div className="col-12 mt-spacer">
      <div className="card">
        <div className="card-body px-lg-spacer">{children}</div>
      </div>
    </div>
  </div>
);

const Alert = ({ node }: { node: NodeType }) => {
  switch (true) {
    case node.peerType === 'jailed':
      return (
        <Container>
          <RowIcon node={node} />
          Jailed
        </Container>
      );
    case node.issues.length > 0:
      return (
        <Container>
          <RowIcon node={node} />
          {nodeIssue(node)}
        </Container>
      );
    case node.status === 'offline':
      return (
        <Container>
          <FontAwesomeIcon
            title="Offline"
            icon={faExclamationTriangle}
            className="text-warning w300 mr-1"
          />
          <span className={node.nodeType === 'observer' ? 'text-muted' : ''}>&nbsp;Offline</span>
        </Container>
      );

    default:
      return null;
  }
};
export default Alert;
