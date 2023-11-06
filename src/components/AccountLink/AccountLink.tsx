import classNames from 'classnames';

import { ScAddressIcon, ShardSpan, NetworkLink, AccountName } from 'components';
import { addressIsBech32, urlBuilder } from 'helpers';
import { AccountAssetType, WithClassnameType } from 'types';

export interface AccountLinkType extends WithClassnameType {
  address: string;
  assets?: AccountAssetType;
  linkClassName?: string;
}

export const AccountLink = ({
  address,
  assets,
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
          <AccountName address={address} assets={assets} />
        </NetworkLink>
      ) : (
        <ShardSpan shard={address} />
      )}
    </div>
  );
};
