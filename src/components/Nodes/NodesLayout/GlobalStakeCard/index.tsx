import * as React from 'react';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { faLeaf } from '@fortawesome/pro-solid-svg-icons/faLeaf';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol-chart.svg';
import { useGlobalState } from 'context';
import { CardItem, MultilayerPercentageBar, PageState } from 'sharedComponents';

const GlobalStakeCard = ({ stakeFetched }: { stakeFetched: boolean }) => {
  const {
    globalStake,
    activeNetwork: { erdLabel },
  } = useGlobalState();

  return stakeFetched === false ? (
    <div className="row">
      <div className="col mb-spacer">
        <div className="card py-4">
          <PageState
            icon={faLock}
            title="Unable to load global stake"
            titleClassName="mt-0"
            className="page-state-sm"
            dataTestId="errorScreen"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="row global-stake-card">
      <div className="col mb-spacer">
        <div className="card d-flex flex-column flex-lg-row flex-wrap py-3 px-2 px-lg-4">
          <div className="card-body p-0 d-flex flex-column flex-lg-row">
            <div className="card-item-container w-100">
              <CardItem className="n3 lg" title="Active Stake" icon={faLock}>
                <div className="d-flex flex-column w-100">
                  <h5 className="m-0 pb-1">
                    {globalStake && globalStake.staked ? (
                      <>
                        {globalStake.staked.toLocaleString('en')} {erdLabel}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </h5>
                  {/* <small>
                    <span className="text-secondary">Deliquent stake:</span>{' '}
                    {globalStake && globalStake.deliquentStake
                      ? `${globalStake.deliquentStake}%`
                      : 'N/A'}
                  </small> */}
                </div>
              </CardItem>

              <CardItem className="n3 lg" title="Staking APR" icon={faLeaf}>
                <div className="d-flex flex-column w-100">
                  <h5 className="m-0 pb-1">
                    {globalStake && globalStake.baseApr
                      ? `Up to ${(globalStake.baseApr * 100).toFixed(2)}%`
                      : 'N/A'}
                  </h5>
                  {/* <small>
                    {globalStake && globalStake.waitingList ? `${globalStake.waitingList}% ` : 'N/A '}
                    <span className="text-secondary">for waiting list</span>
                  </small> */}
                </div>
              </CardItem>

              <CardItem
                className="n3 lg"
                title="Stake Weighted Node Version"
                customIcon={<ElrondSymbol />}
              >
                <div className="d-flex flex-column flex-fill">
                  {globalStake && globalStake.nodesVerions ? (
                    <MultilayerPercentageBar steps={globalStake.nodesVerions} />
                  ) : (
                    'N/A'
                  )}
                </div>
              </CardItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalStakeCard;
