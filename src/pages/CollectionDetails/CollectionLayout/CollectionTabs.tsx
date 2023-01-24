import * as React from 'react';
import { NetworkLink } from 'components';
import { urlBuilder, useActiveRoute, nftText } from 'helpers';
import { NftEnumType } from 'types';

import { collectionRoutes } from 'routes';

import { useSelector } from 'react-redux';
import { collectionSelector } from 'redux/selectors';

export const CollectionTabs = () => {
  const activeRoute = useActiveRoute();
  const { collection, roles, type } = useSelector(collectionSelector);

  return (
    <div className="account-tabs d-flex flex-row">
      {type && type !== NftEnumType.MetaESDT && (
        <NetworkLink
          to={urlBuilder.collectionDetails(collection)}
          className={`tab-link me-spacer ${
            activeRoute(collectionRoutes.collectionDetails) ? 'active' : ''
          }`}
        >
          <h6>{nftText(type)}s</h6>
        </NetworkLink>
      )}

      {roles && (
        <NetworkLink
          to={urlBuilder.collectionDetailsRoles(collection)}
          className={`tab-link me-spacer ${
            activeRoute(collectionRoutes.collectionDetailsRoles) || type === NftEnumType.MetaESDT
              ? 'active'
              : ''
          }`}
        >
          <h6>Roles</h6>
        </NetworkLink>
      )}
    </div>
  );
};
