import classNames from 'classnames';

import {
  ScAddressIcon,
  ShardSpan,
  NetworkLink,
  AccountName,
  LockedTokenAddressIcon
} from 'components';
import { addressIsBech32, urlBuilder } from 'helpers';
import { AccountAssetType, WithClassnameType } from 'types';

export interface AccountLinkType extends WithClassnameType {
  address: string;
  assets?: AccountAssetType;
  linkClassName?: string;
  fetchAssets?: boolean;
  showLockedAccounts?: boolean;
}

export const AccountLink = ({
  address,
  assets,
  fetchAssets = false,
  showLockedAccounts = true,
  className,
  linkClassName,
  'data-testid': testId
}: AccountLinkType) => {
  return (
    <div
      className={classNames(
        'd-flex',
        'align-items-center',
        'trim-wrapper',
        className,
        {
          hash: !className
        }
      )}
      data-testid={testId}
    >
      <ScAddressIcon initiator={address} />
      {addressIsBech32(address) ? (
        <NetworkLink
          to={urlBuilder.accountDetails(address)}
          className={classNames('trim-wrapper', linkClassName)}
        >
          <AccountName
            address={address}
            assets={assets}
            fetchAssets={fetchAssets}
            className={linkClassName}
          />
        </NetworkLink>
      ) : (
        <ShardSpan shard={address} />
      )}
      {showLockedAccounts && (
        <LockedTokenAddressIcon address={address} className='ms-1' />
      )}
    </div>
  );
};
