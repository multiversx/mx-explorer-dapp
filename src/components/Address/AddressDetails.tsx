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
  return props.addressId ? (
    <div className="col-12">
      <div className="card card-small">
        <div className="card-body p-0">
          <div className="container-fluid">
            <div className="row py-3 border-bottom">
              <div className="col-lg-2 text-secondary text-lg-right">Address</div>
              <div className="col">{props.addressId}</div>
            </div>
            <div className={`row py-3 ${props.code ? 'border-bottom' : ''}`}>
              <div className="col-lg-2 text-secondary text-lg-right">Balance</div>
              <div className="col">
                {props.balance !== '...' ? <Denominate value={props.balance} /> : props.balance}
              </div>
            </div>
            {props.code && (
              <>
                <div className="row py-3">
                  <div className="col-lg-2 text-secondary text-lg-right">Code</div>
                  <div className="col">
                    <textarea
                      readOnly
                      className="form-control col cursor-text mt-2"
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
    </div>
  ) : null;
};

export default AddressDetails;
