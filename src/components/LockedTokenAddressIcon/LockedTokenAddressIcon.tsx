import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Overlay } from 'components';
import { addressIsBech32 } from 'helpers';
import { faLock } from 'icons/regular';
import { tokenSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export interface LockedTokenAddressIconUIType extends WithClassnameType {
  address: string;
}

export const LockedTokenAddressIcon = ({
  address,
  className
}: LockedTokenAddressIconUIType) => {
  const { token } = useSelector(tokenSelector);
  const { assets } = token;

  const lockedAccounts = assets?.lockedAccounts;

  if (lockedAccounts) {
    const validLockedAccounts = Object.keys(lockedAccounts).filter(
      (account) => {
        const validAddress = addressIsBech32(account)
          ? account
          : addressIsBech32(lockedAccounts[account])
          ? lockedAccounts[account]
          : '';

        return validAddress === address;
      }
    );
    const lockedAccountName = lockedAccounts?.[validLockedAccounts[0]];

    return lockedAccountName ? (
      <Overlay title={lockedAccountName}>
        <FontAwesomeIcon
          icon={faLock}
          size='xs'
          className={classNames('text-primary ms-1', className)}
        />
      </Overlay>
    ) : null;
  }

  return null;
};
