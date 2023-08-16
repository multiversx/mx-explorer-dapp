import React from 'react';
import { faRepeat } from 'icons/regular';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { PageState } from 'components';
import { NodeType } from 'types';

export interface RoundType {
  key: string;
  value: boolean;
}

interface RoundsType {
  data?: RoundType[];
  success: boolean | undefined;
}

export const RoundsPageState = ({ message }: { message: string }) => {
  return (
    <PageState
      icon={faRepeat}
      title={message}
      className='page-state-sm d-flex h-100 align-items-center justify-content-center'
      dataTestId='roundsErrorScreen'
    />
  );
};

export const Rounds = ({
  rounds,
  node
}: {
  rounds: RoundsType;
  node: NodeType;
}) => {
  return (
    <div className='card h-100' data-testid='roundsContainer'>
      {rounds.success === false && (
        <RoundsPageState message={'Unable to load rounds'} />
      )}
      {rounds.success === true && rounds.data && rounds.data.length === 0 && (
        <RoundsPageState
          message={`${
            node.status === 'eligible'
              ? 'No rounds'
              : 'Validator not in consensus'
          }`}
        />
      )}

      {rounds.success === true && rounds.data && rounds.data.length > 0 && (
        <>
          <div className='card-header'>
            <div className='card-header-item'>
              <h5 className='mb-0'>Latest Consensus Rounds</h5>
            </div>
          </div>
          <div className='card-body px-lg-spacer'>
            <div className='squares' data-testid='rounds'>
              {rounds.data.slice(0, 100).map((round, i) => (
                <OverlayTrigger
                  key={`roundkey-${i}`}
                  placement='top'
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
                  <div
                    className={
                      round.value ? 'full square-block' : 'square-block'
                    }
                  />
                </OverlayTrigger>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
