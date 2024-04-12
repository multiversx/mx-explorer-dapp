import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NetworkLink, NftBadge, Overlay } from 'components';
import { urlBuilder } from 'helpers';
import { faHexagonCheck } from 'icons/solid';

import { CollectionType, WithClassnameType } from 'types';

export interface CollectionLinkType extends WithClassnameType {
  collection: CollectionType;
}

export const CollectionLink = ({ collection, ...rest }: CollectionLinkType) => (
  <>
    <NetworkLink
      to={urlBuilder.collectionDetails(collection.collection)}
      {...rest}
    >
      <div className='d-flex align-items-center'>
        {collection?.assets?.svgUrl && (
          <img
            src={collection.assets.svgUrl}
            alt={collection.name}
            className='side-icon me-1'
          />
        )}
        <div>{collection.ticker ?? collection.collection}</div>
      </div>
    </NetworkLink>

    {collection.isVerified && (
      <Overlay title='Verified'>
        <FontAwesomeIcon
          icon={faHexagonCheck}
          size='sm'
          className='ms-2 text-yellow-spotlight'
        />
      </Overlay>
    )}
    <NftBadge type={collection.type} className='ms-2' />
  </>
);
