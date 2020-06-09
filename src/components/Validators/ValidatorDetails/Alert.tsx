import * as React from 'react';
import { Card } from 'react-bootstrap';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ValidatorType } from 'context/validators';

import RowIcon from './../RowIcon';

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="row">
    <div className="col-12 mb-4">
      <Card>
        <Card.Body>{children}</Card.Body>
      </Card>
    </div>
  </div>
);

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
          {validator.issue}
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
