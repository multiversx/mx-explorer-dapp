import { ProofLayout } from 'layouts/ProofLayout';
import { ProofDetails } from 'layouts/ProofLayout/ProofDetails';

import { NftAccounts } from 'pages/NftDetails/NftAccounts';
import { Proofs } from 'pages/Proofs';

import { TitledRouteObject } from '../routes';

export const proofRoutes = {
  proofs: '/proofs',
  proofDetails: '/proofs/:hash',
  proofDetailsAccounts: '/proofs/:hash/accounts'
};

export const proofLayout: TitledRouteObject[] = [
  {
    path: proofRoutes.proofs,
    title: 'Proofs',
    Component: Proofs
  },
  {
    path: proofRoutes.proofDetails,
    preventScroll: true,
    Component: ProofLayout,
    children: [
      {
        path: proofRoutes.proofDetails,
        title: 'Proof Details',
        preventScroll: true,
        Component: ProofDetails
      },
      {
        path: proofRoutes.proofDetailsAccounts,
        title: 'Proof Accounts',
        preventScroll: true,
        Component: NftAccounts
      }
    ]
  }
];
