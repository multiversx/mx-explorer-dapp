import React from 'react';
import Chart from './Chart';
import { useGlobalState } from 'context';
import { AddressDetailsType } from './../AddressDetails';

const DelegationDetails = (props: AddressDetailsType) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  const total = (props.stake + props.claimableRewards).toLocaleString('en', {
    minimumFractionDigits: 4,
  });
  const stake = props.stake.toLocaleString('en', { minimumFractionDigits: 4 });
  const rewards = props.claimableRewards.toLocaleString('en', { minimumFractionDigits: 4 });

  return props.addressId ? (
    <>
      {props.stake > 0 && (
        <div className="card chart">
          <div className="card-body bg-primary d-flex align-items-center">
            <div className="chart-container mr-4">
              <div>
                <Chart stake={props.stake} claimableRewards={props.claimableRewards} />
              </div>
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
  ) : null;
};

export default DelegationDetails;
