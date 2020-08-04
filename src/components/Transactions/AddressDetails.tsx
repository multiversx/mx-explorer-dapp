import React from 'react';
import { Denominate } from 'sharedComponents';

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
  const labelClass = `card-label col-md-2 col-lg-1`;
  const dataClass = 'col-md-10 col-lg-11';
  const Address = (
    <div className="col-12" style={{ minHeight: '8.357rem' }}>
      <div className="card">
        <div className="card-body">
          <div className="row mt-2">
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
  );
  return props.addressId ? Address : null;
};

export default AddressDetails;
