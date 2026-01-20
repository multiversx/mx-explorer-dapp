import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NetworkLink, Overlay } from 'components';
import { urlBuilder } from 'helpers';
import { faHexagonCheck } from 'icons/solid';
import { NftTypeEnum, TokenAssetType } from 'types';

interface SearchCollectionRowType {
  identifier: string;
  name?: string;
  isVerified?: boolean;
  assets?: TokenAssetType;
  type?: NftTypeEnum;
  children?: ReactNode;
}

export const SearchCollectionRow = ({
  identifier,
  name,
  isVerified,
  assets,
  type,
  children
}: SearchCollectionRowType) => {
  return (
    <NetworkLink
      to={
        type === NftTypeEnum.MetaESDT
          ? urlBuilder.tokenMetaEsdtDetails(identifier)
          : urlBuilder.collectionDetails(identifier)
      }
      key={identifier}
      className='search-suggestion selectable'
    >
      <div className='search-text trim text-truncate'>
        {assets ? (
          <>
            {assets?.svgUrl && (
              <img
                src={assets.svgUrl}
                className='side-icon me-1'
                alt=''
                role='presentation'
              />
            )}
            <div className='text-truncate'>{name ?? identifier}</div>
            {isVerified && (
              <Overlay title='Verified' className='verified-badge-wrapper'>
                <FontAwesomeIcon
                  icon={faHexagonCheck}
                  size='sm'
                  className='text-yellow-spotlight ms-2'
                />
              </Overlay>
            )}
          </>
        ) : (
          identifier
        )}
      </div>
      {children}
    </NetworkLink>
  );
};
