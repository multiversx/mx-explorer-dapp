import React from 'react';
import { Denominate, DetailItem, NetworkLink } from 'sharedComponents';
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
          {tokens.map(({ tokenIdentifier, tokenName, balance }) => (
            <DetailItem title={tokenName}>
              <Denominate
                value={balance ? balance : '0'}
                showLastNonZeroDecimal={true}
                token={tokenIdentifier}
              />
            </DetailItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountTokens;
