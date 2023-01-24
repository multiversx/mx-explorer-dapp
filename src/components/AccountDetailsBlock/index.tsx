import * as React from 'react';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Overlay } from 'components';
import { AssetType } from 'types';

export const AccountDetailsBlock = ({ assets }: { assets: AssetType }) => {
  return (
    <div className='d-flex align-items-center'>
      {assets.iconSvg && (
        <img
          src={assets.iconSvg}
          alt={assets.name}
          className='account-icon me-2'
        />
      )}
      <div>{assets.name}</div>
      <Overlay title={assets.description}>
        <div className='d-flex align-items-center justify-content-center'>
          <FontAwesomeIcon
            icon={faInfoCircle}
            size='1x'
            className='text-neutral-400 ms-1'
          />
        </div>
      </Overlay>
    </div>
  );
};
