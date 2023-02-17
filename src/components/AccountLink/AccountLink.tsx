import React from 'react';

import { ScAddressIcon, ShardSpan, NetworkLink, AccountName } from 'components';
import { addressIsBech32, urlBuilder } from 'helpers';
import { AccountAssetType } from 'types';

export interface AccountLinkType {
  address: string;
  assets?: AccountAssetType;
}

export const AccountLink = ({ address, assets }: AccountLinkType) => {
  return (
    <div className='d-flex align-items-center'>
      <ScAddressIcon initiator={address} />
      {addressIsBech32(address) ? (
        <NetworkLink
          to={urlBuilder.accountDetails(address)}
          className='trim-wrapper'
        >
          <AccountName address={address} assets={assets} />
        </NetworkLink>
      ) : (
        <ShardSpan shard={address} />
      )}
    </div>
  );
};
