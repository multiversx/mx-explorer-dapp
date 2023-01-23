import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faLock } from '@fortawesome/pro-regular-svg-icons/faLock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { addressIsBech32 } from 'helpers';

import { useSelector } from 'react-redux';
import { tokenSelector } from 'redux/selectors';

export const LockedTokenAddressIcon = ({ address }: { address: string }) => {
  const { assets } = useSelector(tokenSelector);

  const lockedAccounts = assets?.lockedAccounts;

  if (lockedAccounts) {
    const validLockedAccounts = Object.keys(lockedAccounts).filter((account, i) => {
      const validAddress = addressIsBech32(account)
        ? account
        : addressIsBech32(lockedAccounts[account])
        ? lockedAccounts[account]
        : '';

      return validAddress === address;
    });
    const lockedAccountName = lockedAccounts?.[validLockedAccounts[0]];

    return lockedAccountName ? (
      <OverlayTrigger
        placement="top"
        delay={{ show: 0, hide: 400 }}
        overlay={(props: any) => (
          <Tooltip {...props} show={props.show.toString()}>
            {lockedAccountName}
          </Tooltip>
        )}
      >
        <FontAwesomeIcon icon={faLock} size="xs" className="me-1 text-secondary" />
      </OverlayTrigger>
    ) : null;
  }

  return null;
};
