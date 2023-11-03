import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { NetworkLink, NftBadge } from 'components';
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
      <OverlayTrigger
        placement='top'
        delay={{ show: 0, hide: 400 }}
        overlay={(props: any) => (
          <Tooltip {...props} show={props.show.toString()}>
            Verified
          </Tooltip>
        )}
      >
        <FontAwesomeIcon
          icon={faHexagonCheck}
          size='sm'
          className='ms-2 text-yellow-spotlight'
        />
      </OverlayTrigger>
    )}
    <NftBadge type={collection.type} className='ms-2' />
  </>
);
