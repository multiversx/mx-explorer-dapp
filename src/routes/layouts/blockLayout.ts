import { MiniBlockLayout } from 'layouts/MiniBlockLayout';
import { BlockDetails } from 'pages/BlockDetails';
import { Blocks } from 'pages/Blocks';
import { MiniBlockDetails } from 'pages/MiniBlockDetails';

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
    Component: Blocks
  },
  {
    path: blocksRoutes.blocksDetails,
    title: 'Block Details',
    Component: BlockDetails
  },
  {
    path: blocksRoutes.miniBlockDetails,
    Component: MiniBlockLayout,
    children: [
      {
        path: blocksRoutes.miniBlockDetails,
        title: 'Miniblock Details',
        Component: MiniBlockDetails
      }
    ]
  }
];
