import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import {
  ScAddressIcon,
  ShardSpan,
  NetworkLink,
  AccountName,
  LockedTokenAddressIcon
} from 'components';
import { addressIsBech32, urlBuilder } from 'helpers';
import { interfaceSelector } from 'redux/selectors';
import { setHighlightedText } from 'redux/slices/interface';
import { AccountAssetType, WithClassnameType } from 'types';

export interface AccountLinkType extends WithClassnameType {
  address: string;
  username?: string;
  assets?: AccountAssetType;
  linkClassName?: string;
  fetchAssets?: boolean;
  showLockedAccounts?: boolean;
  hasHighlight?: boolean;
}

export const AccountLink = ({
  address,
  assets,
  username,
  fetchAssets = false,
  showLockedAccounts = true,
  hasHighlight,
  className,
  linkClassName,
  'data-testid': testId
}: AccountLinkType) => {
  const dispatch = useDispatch();
  const { highlightedText } = useSelector(interfaceSelector);

  return (
    <div
      className={classNames(
        'd-flex',
        'align-items-center',
        'trim-wrapper',
        { 'text-highlighted': hasHighlight && highlightedText === address },
        className
      )}
      data-testid={testId}
      {...(hasHighlight
        ? {
            onMouseEnter: () => {
              dispatch(setHighlightedText(address));
            },
            onMouseLeave: () => dispatch(setHighlightedText(''))
          }
        : {})}
    >
      <ScAddressIcon initiator={address} />
      {addressIsBech32(address) ? (
        <NetworkLink
          to={urlBuilder.accountDetails(address)}
          className={classNames('trim-wrapper', linkClassName)}
        >
          <AccountName
            address={address}
            username={username}
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
