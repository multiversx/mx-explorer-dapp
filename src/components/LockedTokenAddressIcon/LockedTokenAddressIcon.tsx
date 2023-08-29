import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { addressIsBech32 } from 'helpers';
import { faLock } from 'icons/regular';
import { tokenSelector } from 'redux/selectors';

export const LockedTokenAddressIcon = ({ address }: { address: string }) => {
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
      <OverlayTrigger
        placement='top'
        delay={{ show: 0, hide: 400 }}
        overlay={(props: any) => (
          <Tooltip {...props} show={props.show.toString()}>
            {lockedAccountName}
          </Tooltip>
        )}
      >
        <FontAwesomeIcon
          icon={faLock}
          size='xs'
          className='me-1 text-primary'
        />
      </OverlayTrigger>
    ) : null;
  }

  return null;
};
