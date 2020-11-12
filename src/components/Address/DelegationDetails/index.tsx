import React from 'react';
import DelegationChart from './DelegationChart';
import { useGlobalState } from 'context';
import { AddressDetailsType } from './../AddressDetails';
import { PageState } from 'sharedComponents';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';

const DelegationDetails = (props: AddressDetailsType) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  const total = (props.stake + props.claimableRewards).toLocaleString('en', {
    minimumFractionDigits: 4,
  });
  const stake = props.stake.toLocaleString('en', { minimumFractionDigits: 4 });
  const rewards = props.claimableRewards.toLocaleString('en', { minimumFractionDigits: 4 });

  return (
    <>
      {props.address && props.rewardsFetched === false && (
        <div className="card py-3">
          <PageState
            icon={faCoins}
            title="Unable to load delegation"
            titleClassName="mt-0"
            className="page-state-sm"
            dataTestId="delegationErrorScreen"
          />
        </div>
      )}

      {props.address && props.rewardsFetched && props.stake > 0 && (
        <div className="card chart">
          <div className="card-body bg-primary d-flex align-items-center">
            <div className="mr-4">
              <DelegationChart stake={props.stake} claimableRewards={props.claimableRewards} />
            </div>
            <div className="text-white ml-1">
              <p className="font-weight-bold mb-1">
                <span className="delegation-label">Total:</span> {total} {erdLabel}{' '}
              </p>
              <p className="mb-1">
                <span className={`badge badge-pill badge-status badge-delegation`}>&nbsp;</span>
                &nbsp;<span className="delegation-label">Delegation:</span> {stake}
              </p>
              <p className="mb-0">
                <span className={`badge badge-pill badge-status badge-rewards`}>&nbsp;</span>
                &nbsp;<span className="delegation-label">Rewards:</span> {rewards}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DelegationDetails;
