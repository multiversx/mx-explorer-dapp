import * as React from 'react';
import { Card } from 'react-bootstrap';
import { useGlobalState } from 'context';
import { ValidatorType } from './../';
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

const PercentegeBar = ({ validator }: { validator: ValidatorType }) => {
  const {
    activeTestnet: { versionNumber },
  } = useGlobalState();
  switch (true) {
    case validator.peerType === 'jailed':
      return (
        <Container>
          <RowIcon validator={validator} />
          Jailed
        </Container>
      );
    case validator.star:
      return (
        <Container>
          <RowIcon validator={validator} />
          Outdated client configuration
        </Container>
      );
    case versionNumber !== validator.versionNumber.split('-')[0]:
      return (
        <Container>
          <RowIcon validator={validator} />
          Outdated client version
        </Container>
      );

    default:
      return null;
  }
};
export default PercentegeBar;
