import { ScAddressIcon, ShardSpan, NetworkLink, AccountName } from 'components';
import { addressIsBech32, urlBuilder } from 'helpers';
import { AccountAssetType } from 'types';

export interface AccountLinkType {
  address: string;
  assets?: AccountAssetType;
  className?: string;
  linkClassName?: string;
}

export const AccountLink = ({
  address,
  assets,
  className,
  linkClassName
}: AccountLinkType) => {
  return (
    <div
      className={`d-flex align-items-center ${className ? className : 'hash'}`}
    >
      <ScAddressIcon initiator={address} />
      {addressIsBech32(address) ? (
        <NetworkLink
          to={urlBuilder.accountDetails(address)}
          className={`trim-wrapper ${linkClassName ?? ''}`}
        >
          <AccountName address={address} assets={assets} />
        </NetworkLink>
      ) : (
        <ShardSpan shard={address} />
      )}
    </div>
  );
};
