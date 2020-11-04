import * as React from 'react';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ValidatorType } from 'context/validators';

import RowIcon from './../RowIcon';

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="row">
    <div className="col-12 mt-spacer">
      <div className="card">
        <div className="card-body px-lg-spacer">{children}</div>
      </div>
    </div>
  </div>
);

const issueMessage = (issue: ValidatorType['issue']) => {
  switch (true) {
    case issue === 'Outdated client version':
      return 'Outdated client version, please update the node';
    case issue === 'Shuffle out restart failed':
      return 'Shuffle out restart failed, please manually restart the node';
    default:
      return issue;
  }
};

const Alert = ({ validator }: { validator: ValidatorType }) => {
  switch (true) {
    case validator.peerType === 'jailed':
      return (
        <Container>
          <RowIcon validator={validator} />
          Jailed
        </Container>
      );
    case validator.issue !== '':
      return (
        <Container>
          <RowIcon validator={validator} />
          {issueMessage(validator.issue)}
        </Container>
      );
    case validator.isActive === false:
      return (
        <Container>
          <FontAwesomeIcon
            title="Offline"
            icon={faExclamationTriangle}
            className="text-warning w300 mr-1"
          />
          <span className={validator.isValidator === false ? 'text-muted' : ''}>&nbsp;Offline</span>
        </Container>
      );

    default:
      return null;
  }
};
export default Alert;
