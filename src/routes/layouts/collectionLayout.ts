import { CollectionLayout } from 'layouts/CollectionLayout';
import { CollectionAssets } from 'pages/CollectionDetails/CollectionAssets';
import { CollectionRoles } from 'pages/CollectionDetails/CollectionRoles';
import { Collections } from 'pages/Collections';

import { TitledRouteObject } from '../routes';

export const collectionRoutes = {
  collections: '/collections',
  collectionsNft: '/collections/nft',
  collectionsSft: '/collections/sft',
  collectionDetails: '/collections/:hash',
  collectionDetailsRoles: '/collections/:hash/roles'
};

export const collectionLayout: TitledRouteObject[] = [
  {
    path: collectionRoutes.collections,
    title: 'NFTs',
    preventScroll: true,
    Component: Collections
  },
  {
    path: collectionRoutes.collectionsNft,
    title: 'NFT Collections',
    preventScroll: true,
    Component: Collections
  },
  {
    path: collectionRoutes.collectionsSft,
    title: 'SFT Collections',
    preventScroll: true,
    Component: Collections
  },
  {
    path: collectionRoutes.collectionDetails,
    Component: CollectionLayout,
    preventScroll: true,
    children: [
      {
        path: collectionRoutes.collectionDetails,
        title: 'Collection Details',
        preventScroll: true,
        Component: CollectionAssets
      },
      {
        path: collectionRoutes.collectionDetailsRoles,
        title: 'Collection Roles',
        preventScroll: true,
        Component: CollectionRoles
      }
    ]
  }
];
