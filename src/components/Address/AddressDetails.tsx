import React from 'react';
import { Denominate, DetailItem } from 'sharedComponents';

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
            <DetailItem title="Address">{props.addressId}</DetailItem>
            <DetailItem title="Balance">
              {props.balance !== '...' ? <Denominate value={props.balance} /> : props.balance}
            </DetailItem>

            {props.code && (
              <DetailItem title="Code">
                <textarea
                  readOnly
                  className="form-control col cursor-text mt-2"
                  rows={2}
                  defaultValue={props.code}
                />
              </DetailItem>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddressDetails;
