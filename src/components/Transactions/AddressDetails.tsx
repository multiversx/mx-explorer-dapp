import { useBach32 } from 'helpers';
import React from 'react';
import { Denominate } from 'sharedComponents';

export interface AddressDetailsType {
  addressId: string;
  code: string;
  balance: string;
  nonce: number;
  detailsFetched: boolean;
}

const AddressDetails = (props: AddressDetailsType) => {
  const { getAddress } = useBach32();
  const address = getAddress(props.addressId);
  const Address = (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-1 card-label">Address</div>
              <div className="col-lg-11">{address}</div>
            </div>
            <hr className="hr-space" />
            <div className="row">
              <div className="col-lg-1 card-label">Balance</div>
              <div className="col-lg-11">
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
    </div>
  );
  return props.addressId ? Address : null;
};

export default AddressDetails;
