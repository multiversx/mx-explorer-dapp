import { NonIndexRouteObject } from 'react-router-dom';

import { CollectionLayout } from 'layouts/CollectionLayout';
import { CollectionAssets } from 'pages/CollectionDetails/CollectionAssets';
import { CollectionRoles } from 'pages/CollectionDetails/CollectionRoles';
import { Collections } from 'pages/Collections';

export const collectionRoutes = {
  collections: '/collections',
  collectionsNft: '/collections/nft',
  collectionsSft: '/collections/sft',
  collectionDetails: '/collections/:hash',
  collectionDetailsRoles: '/collections/:hash/roles'
};

export const collectionLayout: NonIndexRouteObject[] = [
  {
    path: collectionRoutes.collections,
    //title: 'NFTs',
    Component: Collections
  },
  {
    path: collectionRoutes.collectionsNft,
    //title: 'NFT Collections',
    Component: Collections
  },
  {
    path: collectionRoutes.collectionsSft,
    //title: 'SFT Collections',
    Component: Collections
  },
  {
    path: collectionRoutes.collectionDetails,
    //title: 'Collection Details',
    Component: CollectionLayout,
    children: [
      {
        path: collectionRoutes.collectionDetails,
        //title: 'Collection Details',
        Component: CollectionAssets
      },
      {
        path: collectionRoutes.collectionDetailsRoles,
        //title: 'Collection Roles',
        Component: CollectionRoles
      }
    ]
  }
];
