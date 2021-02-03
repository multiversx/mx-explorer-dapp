import React from 'react';
import { CopyButton, Denominate, DetailItem } from 'sharedComponents';
import { types } from 'helpers';

const AccountDetailsCard = (props: types.AccountType) => {
  return props.address ? (
    <div className="card">
      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Address">
            <div className="d-flex align-items-center text-break-all mr-lg-n1rem">
              <span data-testid="address">{props.address}</span>
              <CopyButton text={props.address} />
            </div>
          </DetailItem>
          <DetailItem title="Balance">
            {props.balance !== '...' ? <Denominate value={props.balance} /> : props.balance}
          </DetailItem>
          {props.username && (
            <DetailItem title="Herotag">
              <span data-testid="username">{props.username}</span>
            </DetailItem>
          )}
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

export default AccountDetailsCard;
