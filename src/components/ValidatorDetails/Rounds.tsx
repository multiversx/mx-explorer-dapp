import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type RoundType = {
  key: string;
  value: string;
};

const Rounds = ({ rounds }: { rounds: RoundType[] }) => {
  return (
    <div className="col-md-5">
      <div className="mt-4">
        <h4>Last Rounds</h4>
      </div>
      <div className="card" style={{ height: 'auto' }}>
        <div className="card-body">
          {rounds.length === 0 ? (
            <div
              style={{ minHeight: '95px' }}
              className="d-flex justify-content-center"
              ng-show="rounds.length == 0"
            >
              <div className="lds-ellipsis align-self-center">
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          ) : (
            <div className="squares">
              {rounds.length &&
                rounds.map((round: any) => (
                  <OverlayTrigger
                    key={round.key}
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props: any) => (
                      <Tooltip id={round.key} {...props}>
                        {round.key.indexOf('_') > 0 ? round.key.split('_').pop() : round.key}
                      </Tooltip>
                    )}
                  >
                    <div className={round.value ? 'full square-block' : 'square-block'}></div>
                  </OverlayTrigger>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rounds;
