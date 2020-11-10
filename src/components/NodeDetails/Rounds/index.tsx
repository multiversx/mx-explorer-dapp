import * as React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { PageState } from 'sharedComponents';

export interface RoundType {
  key: string;
  value: boolean;
}

interface RoundsType {
  data?: RoundType[];
  success: boolean | undefined;
  peerType: string;
}

const Rounds = ({ rounds }: { rounds: RoundsType }) => {
  return (
    <>
      <div className="card" data-testid="roundsContainer">
        {rounds.success === false && (
          <PageState
            icon={faCogs}
            title="Unable to load rounds"
            className="page-state-sm d-flex h-100 align-items-center justify-content-center"
            dataTestId="roundsErrorScreen"
          />
        )}

        {rounds.success === true && rounds.data && rounds.data.length === 0 && (
          <PageState
            icon={faCogs}
            title={`${
              rounds.peerType === 'waiting' ? 'Validator not in consensus' : 'Unable to load rounds'
            }`}
            className="page-state-sm d-flex h-100 align-items-center justify-content-center"
            dataTestId="roundsErrorScreen"
          />
        )}

        {rounds.success === true && rounds.data && rounds.data.length > 0 && (
          <>
            <div className="card-header">
              <div className="card-header-item">
                <h6 className="m-0">Last Consensus Rounds</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="squares" data-testid="rounds">
                {rounds.data.length &&
                  rounds.data.map((round) => (
                    <OverlayTrigger
                      key={round.key}
                      placement="top"
                      delay={{ show: 0, hide: 50 }}
                      overlay={(props: any) => (
                        <Tooltip id={round.key} {...props}>
                          Block {round.value ? ' ' : ' not '} proposed{' '}
                          {String(round.key).indexOf('_') > 0
                            ? String(round.key).split('_').pop()
                            : round.key}
                        </Tooltip>
                      )}
                    >
                      <div className={round.value ? 'full square-block' : 'square-block'} />
                    </OverlayTrigger>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Rounds;
