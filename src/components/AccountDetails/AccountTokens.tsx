import React from 'react';
import { DetailItem, NetworkLink } from 'sharedComponents';
import { types, urlBuilder } from 'helpers';

const AccountTokens = ({ tokens }: { tokens: types.TokenType[] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <h6 className="m-0">Tokens</h6>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="container-fluid">
          {tokens.map(({ name }) => (
            <DetailItem title="Name">
              <NetworkLink to={urlBuilder.tokenDetails(name)}>{name}</NetworkLink>
            </DetailItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountTokens;
