import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AccountAssetType } from 'helpers/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle';

const Overlay = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <OverlayTrigger
    placement="top"
    delay={{ show: 0, hide: 400 }}
    overlay={(props: any) => (
      <Tooltip {...props} show={props.show.toString()}>
        {title}
      </Tooltip>
    )}
  >
    <div className="d-flex align-items-center justify-content-center">{children}</div>
  </OverlayTrigger>
);

const AccountDetailsBlock = ({ assets }: { assets: AccountAssetType }) => {
  const dynamicIconColor = assets.iconSvg.includes('elrond.svg');
  return (
    <div className="d-flex align-items-center">
      {assets.iconSvg && (
        <img
          src={assets.iconSvg}
          alt={assets.name}
          className={`account-icon mr-2 ${dynamicIconColor ? 'icon-elrond' : ''}`}
        />
      )}
      <div>{assets.name}</div>
      <Overlay title={assets.description}>
        <FontAwesomeIcon icon={faInfoCircle} size="1x" className="text-secondary ml-1" />
      </Overlay>
    </div>
  );
};

export default AccountDetailsBlock;
