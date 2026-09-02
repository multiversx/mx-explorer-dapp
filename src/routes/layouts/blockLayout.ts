import { TitledRouteObject } from '../routes';

export const blocksRoutes = {
  blocks: '/blocks',
  blocksDetails: '/blocks/:hash',
  miniBlockDetails: '/miniblocks/:hash'
};

export const blockLayout: TitledRouteObject[] = [
  {
    path: blocksRoutes.blocks,
    title: 'Blocks',
    lazyComponent: () => import('pages/Blocks').then((module) => module.Blocks)
  },
  {
    path: blocksRoutes.blocksDetails,
    title: 'Block Details',
    lazyComponent: () =>
      import('pages/BlockDetails').then((module) => module.BlockDetails)
  },
  {
    path: blocksRoutes.miniBlockDetails,
    lazyComponent: () =>
      import('layouts/MiniBlockLayout').then(
        (module) => module.MiniBlockLayout
      ),
    children: [
      {
        path: blocksRoutes.miniBlockDetails,
        title: 'Miniblock Details',
        lazyComponent: () =>
          import('pages/MiniBlockDetails').then(
            (module) => module.MiniBlockDetails
          )
      }
    ]
  }
];
