import React from 'react';
import { DetailItem, NetworkLink } from 'sharedComponents';
import { types, urlBuilder } from 'helpers';

const AccountEsdt = ({ esdt }: { esdt: types.EsdtType[] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <h6 className="m-0">ESDT</h6>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="container-fluid">
          {esdt.map((coin) => (
            <DetailItem title="Name">
              <NetworkLink to={urlBuilder.esdtDetails(coin.name)}>{coin.name}</NetworkLink>
            </DetailItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountEsdt;
