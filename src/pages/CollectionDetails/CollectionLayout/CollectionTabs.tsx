import * as React from 'react';
import { useSelector } from 'react-redux';
import { NetworkLink } from 'components';
import { urlBuilder, useActiveRoute, nftText } from 'helpers';
import { collectionSelector } from 'redux/selectors';
import { collectionRoutes } from 'routes';
import { NftEnumType } from 'types';

export const CollectionTabs = () => {
  const activeRoute = useActiveRoute();
  const { collection, roles, type } = useSelector(collectionSelector);

  return (
    <div className='tab-links d-flex flex-row flex-wrap'>
      {type && type !== NftEnumType.MetaESDT && (
        <NetworkLink
          to={urlBuilder.collectionDetails(collection)}
          className={`tab-link me-3 me-lg-4 ${
            activeRoute(collectionRoutes.collectionDetails) ? 'active' : ''
          }`}
        >
          <h5>{nftText(type)}s</h5>
        </NetworkLink>
      )}

      {roles && (
        <NetworkLink
          to={urlBuilder.collectionDetailsRoles(collection)}
          className={`tab-link me-3 me-lg-4 ${
            activeRoute(collectionRoutes.collectionDetailsRoles) ||
            type === NftEnumType.MetaESDT
              ? 'active'
              : ''
          }`}
        >
          <h5>Roles</h5>
        </NetworkLink>
      )}
    </div>
  );
};
