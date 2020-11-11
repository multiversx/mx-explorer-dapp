import React from 'react';
import { CopyButton, Denominate, DetailItem, Trim } from 'sharedComponents';

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
    <div className="card">
      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Address">
            <div className="d-flex align-items-center">
              <Trim text={props.addressId} />
              <CopyButton text={props.addressId} />
            </div>
          </DetailItem>
          <DetailItem title="Balance">
            {props.balance !== '...' ? <Denominate value={props.balance} /> : props.balance}
          </DetailItem>

          {props.code && (
            <DetailItem title="Contract Code">
              <textarea
                readOnly
                className="form-control col cursor-text mt-2"
                rows={4}
                defaultValue={props.code}
              />
            </DetailItem>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default AddressDetails;
