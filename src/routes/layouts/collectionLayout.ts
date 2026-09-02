import { TitledRouteObject } from '../routes';

export const collectionRoutes = {
  collections: '/collections',
  collectionsNft: '/collections/nft',
  collectionsSft: '/collections/sft',
  collectionDetails: '/collections/:hash',
  collectionDetailsRoles: '/collections/:hash/roles',
  collectionDetailsTransactions: '/collections/:hash/transactions'
};

export const collectionLayout: TitledRouteObject[] = [
  {
    path: collectionRoutes.collections,
    title: 'NFTs',
    preventScroll: true,
    lazyComponent: () =>
      import('pages/Collections').then((module) => module.Collections)
  },
  {
    path: collectionRoutes.collectionsNft,
    title: 'NFT Collections',
    preventScroll: true,
    lazyComponent: () =>
      import('pages/Collections').then((module) => module.Collections)
  },
  {
    path: collectionRoutes.collectionsSft,
    title: 'SFT Collections',
    preventScroll: true,
    lazyComponent: () =>
      import('pages/Collections').then((module) => module.Collections)
  },
  {
    path: collectionRoutes.collectionDetails,
    lazyComponent: () =>
      import('layouts/CollectionLayout').then(
        (module) => module.CollectionLayout
      ),
    preventScroll: true,
    children: [
      {
        path: collectionRoutes.collectionDetails,
        title: 'Collection Details',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/CollectionDetails/CollectionAssets').then(
            (module) => module.CollectionAssets
          )
      },
      {
        path: collectionRoutes.collectionDetailsTransactions,
        title: 'Collection Transactions',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/CollectionDetails/CollectionTransactions').then(
            (module) => module.CollectionTransactions
          )
      },
      {
        path: collectionRoutes.collectionDetailsRoles,
        title: 'Collection Roles',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/CollectionDetails/CollectionRoles').then(
            (module) => module.CollectionRoles
          )
      }
    ]
  }
];
