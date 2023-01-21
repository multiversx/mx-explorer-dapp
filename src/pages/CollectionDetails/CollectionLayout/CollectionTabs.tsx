import * as React from 'react';
import { NetworkLink } from 'components';
import { urlBuilder, useActiveRoute, nftText } from 'helpers';
import { NftEnumType } from 'helpers/types';
import { useGlobalState } from 'context';
import { collectionRoutes } from 'routes';

export const CollectionTabs = () => {
  const activeRoute = useActiveRoute();
  const { collectionDetails } = useGlobalState();

  return (
    <div className="account-tabs d-flex flex-row">
      {collectionDetails && collectionDetails.type !== NftEnumType.MetaESDT && (
        <NetworkLink
          to={urlBuilder.collectionDetails(collectionDetails.collection)}
          className={`tab-link mr-spacer ${
            activeRoute(collectionRoutes.collectionDetails) ? 'active' : ''
          }`}
        >
          <h6>{nftText(collectionDetails.type)}s</h6>
        </NetworkLink>
      )}

      {collectionDetails?.roles && (
        <NetworkLink
          to={urlBuilder.collectionDetailsRoles(collectionDetails.collection)}
          className={`tab-link mr-spacer ${
            activeRoute(collectionRoutes.collectionDetailsRoles) ||
            collectionDetails.type === NftEnumType.MetaESDT
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
