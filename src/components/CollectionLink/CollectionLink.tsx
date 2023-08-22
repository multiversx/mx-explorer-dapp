import React from 'react';
import { faHexagonCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { NetworkLink, NftBadge } from 'components';
import { urlBuilder } from 'helpers';

import { CollectionType } from 'types';

export const CollectionLink = ({
  collection
}: {
  collection: CollectionType;
}) => (
  <>
    <NetworkLink to={urlBuilder.collectionDetails(collection.collection)}>
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
