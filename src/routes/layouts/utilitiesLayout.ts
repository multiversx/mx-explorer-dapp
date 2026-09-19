import { Converters } from 'pages/Utilities/Converters';
import { SmartContractInteraction } from 'pages/Utilities/SmartContractInteraction';

import { TitledRouteObject } from '../routes';

export const utilitiesRoutes = {
  converters: '/utilities/converters',
  smartContractInteraction: '/utilities/smart-contract'
};

export const utilitiesLayout: TitledRouteObject[] = [
  {
    path: utilitiesRoutes.converters,
    title: 'Converters',
    Component: Converters
  },
  {
    path: utilitiesRoutes.smartContractInteraction,
    title: 'Smart Contract Interaction',
    Component: SmartContractInteraction
  }
];
