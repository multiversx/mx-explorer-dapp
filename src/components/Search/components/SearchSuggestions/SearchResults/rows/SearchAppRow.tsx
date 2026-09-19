import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DefaultImage from 'assets/img/default-icon.svg';
import { AccountName, NetworkLink, Overlay } from 'components';
import { urlBuilder } from 'helpers';
import { faBadgeCheck } from 'icons/solid';
import { AccountAssetType } from 'types';

interface SearchAppRowType {
  address: string;
  assets?: AccountAssetType;
  isVerified?: boolean;
  children?: ReactNode;
}

export const SearchAppRow = ({
  address,
  assets,
  isVerified,
  children
}: SearchAppRowType) => {
  const icon =
    assets?.svgUrl || assets?.pngUrl || assets?.iconSvg || assets?.iconPng;
  return (
    <NetworkLink
      to={urlBuilder.accountDetails(address)}
      key={address}
      className='search-suggestion selectable'
    >
      <div className='search-text trim text-truncate'>
        {icon ? (
          <img
            src={icon}
            alt={assets?.name ?? address}
            className='side-icon me-1'
            role='presentation'
          />
        ) : (
          <div className='side-icon me-1 d-flex align-items-center justify-content-center'>
            <DefaultImage />
          </div>
        )}
        <AccountName address={address} assets={assets} trimClassName='hash' />
        {isVerified && (
          <Overlay title='Verified'>
            <FontAwesomeIcon
              icon={faBadgeCheck}
              size='sm'
              className='text-primary'
            />
          </Overlay>
        )}
      </div>
      {children}
    </NetworkLink>
  );
};
