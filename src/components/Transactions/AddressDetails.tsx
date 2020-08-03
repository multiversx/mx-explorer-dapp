import React from 'react';
import { Denominate } from 'sharedComponents';
import Chart from './Chart';

export interface AddressDetailsType {
  addressId: string;
  code: string;
  balance: string;
  nonce: number;
  detailsFetched: boolean;
  claimableRewards: number;
  stake: number;
}

const AddressDetails = (props: AddressDetailsType) => {
  const labelClass = `card-label ${props.stake > 0 ? 'col-lg-2' : 'col-lg-1'}`;
  const dataClass = props.stake > 0 ? 'col-lg-10' : 'col-lg-11';
  const Address = (
    <div className="row mb-4">
      <div className={props.stake > 0 ? 'col-md-8' : 'col-12'}>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className={labelClass}>Address</div>
              <div className={dataClass}>{props.addressId}</div>
            </div>
            <hr className="hr-space" />
            <div className="row">
              <div className={labelClass}>Balance</div>
              <div className={dataClass}>
                {props.balance !== '...' ? (
                  <Denominate value={props.balance} showLastNonZeroDecimal />
                ) : (
                  props.balance
                )}
              </div>
            </div>
            {props.code && (
              <>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-1 card-label">Code</div>
                  <div className="col-lg-11">
                    <textarea
                      readOnly
                      className="form-control col-lg-12 cursor-text"
                      rows={2}
                      defaultValue={props.code}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {props.stake > 0 && (
        <div className="col-md-4 mt-4 mt-md-0">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-4">
                  <div className="row">
                    <Chart stake={props.stake} claimableRewards={props.claimableRewards} />
                  </div>
                </div>
                <div className="col-8">
                  <div className="row">
                    <div className="col-12">
                      Total {(props.stake + props.claimableRewards).toLocaleString('en')} eGLD{' '}
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-12">
                      <span className={`badge badge-pill badge-status badge-blue`}>&nbsp;</span>
                      &nbsp;Staked {props.stake.toLocaleString('en')} eGLD{' '}
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-12">
                      <span className={`badge badge-pill badge-status badge-blue-light`}>
                        &nbsp;
                      </span>
                      &nbsp;Claimable {props.claimableRewards.toLocaleString('en')} eGLD{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  return props.addressId ? Address : null;
};

export default AddressDetails;
