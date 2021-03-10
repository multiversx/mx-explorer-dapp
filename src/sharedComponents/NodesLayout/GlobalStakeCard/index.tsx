import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { faCoins } from '@fortawesome/pro-solid-svg-icons/faCoins';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol-chart.svg';
import { useGlobalState } from 'context';
import { Denominate, MultilayerPercentageBar, PageState } from 'sharedComponents';

const GlobalStakeCard = ({ stakeFetched }: { stakeFetched: boolean }) => {
  const { globalStake } = useGlobalState();

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
        <div className="card d-flex flex-column flex-lg-row py-3 py-lg-spacer px-3 px-lg-spacer">
          <div className="d-flex align-items-center mb-3 mb-lg-0 pr-md-5">
            <div className="right-angle-icon lg mr-4">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <div className="d-flex flex-column">
              <span className="text-secondary mb-1">Active Stake</span>
              {globalStake && globalStake.totalStaked ? (
                <h5 className="m-0 pb-1">
                  <Denominate value={globalStake.totalStaked} decimals={0} />
                </h5>
              ) : (
                '...'
              )}
              <small className="text-secondary">
                {globalStake && globalStake.deliquentStake
                  ? `Deliquent stake: ${globalStake.deliquentStake}%`
                  : '...'}
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center mb-3 mb-lg-0 pr-md-5">
            <div className="right-angle-icon lg mr-4">
              <FontAwesomeIcon icon={faCoins} />
            </div>
            <div className="d-flex flex-column">
              <span className="text-secondary mb-1">Staking APR</span>
              <h5 className="m-0 pb-1">
                {globalStake && globalStake.apr ? `${globalStake.apr}%` : '...'}
              </h5>
              <small className="text-secondary">
                {globalStake && globalStake.waitingList
                  ? `${globalStake.waitingList}% for waiting list`
                  : '...'}
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center flex-fill">
            <div className="right-angle-icon lg mr-4">
              <ElrondSymbol />
            </div>
            <div className="d-flex flex-column flex-fill">
              <span className="text-secondary mb-2">Stake Weighted Node Version</span>
              {globalStake && globalStake.nodesVerions ? (
                <MultilayerPercentageBar steps={globalStake.nodesVerions} />
              ) : (
                '...'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalStakeCard;
