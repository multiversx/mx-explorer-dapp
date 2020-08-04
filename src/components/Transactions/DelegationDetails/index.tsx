import React from 'react';
import Chart from './Chart';
import { AddressDetailsType } from './../AddressDetails';
import './delegationDetails.scss';

const DelegationDetails = (props: AddressDetailsType) => {
  const Delegation = (
    <>
      {props.stake > 0 && (
        <div className="col-12 chart">
          <div className="card">
            <div className="card-body d-flex align-items-center">
              <div className="chart-container mr-4">
                <div>
                  <Chart stake={props.stake} claimableRewards={props.claimableRewards} />
                </div>
              </div>
              <div className="text-white ml-1">
                <p className="font-weight-bold mb-1">
                  <span className="delegation-label">Total:</span>{' '}
                  {(props.stake + props.claimableRewards).toLocaleString('en')} eGLD{' '}
                </p>
                <div className="d-flex">
                  <div className="mr-3">
                    <span className={`badge badge-pill badge-status badge-delegation`}>&nbsp;</span>
                    &nbsp;<span className="delegation-label">Delegation:</span>{' '}
                    {props.stake.toLocaleString('en')}
                  </div>
                  <div>
                    <span className={`badge badge-pill badge-status badge-rewards`}>&nbsp;</span>
                    &nbsp;<span className="delegation-label">Rewards:</span>{' '}
                    {props.claimableRewards.toLocaleString('en')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return props.addressId ? Delegation : null;
};

export default DelegationDetails;
