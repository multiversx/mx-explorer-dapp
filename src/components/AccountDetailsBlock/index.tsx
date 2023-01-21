import * as React from 'react';
import { AssetType } from 'helpers/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle';
import { Overlay } from 'components';

export const AccountDetailsBlock = ({ assets }: { assets: AssetType }) => {
  return (
    <div className="d-flex align-items-center">
      {assets.iconSvg && (
        <img src={assets.iconSvg} alt={assets.name} className="account-icon mr-2" />
      )}
      <div>{assets.name}</div>
      <Overlay title={assets.description}>
        <div className="d-flex align-items-center justify-content-center">
          <FontAwesomeIcon icon={faInfoCircle} size="1x" className="text-secondary ml-1" />
        </div>
      </Overlay>
    </div>
  );
};
