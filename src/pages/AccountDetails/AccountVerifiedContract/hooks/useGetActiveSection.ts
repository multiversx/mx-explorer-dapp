import { VerifiedContractTabsEnum } from '@multiversx/sdk-dapp-sc-explorer/types/base.types';
import { useMatch } from 'react-router-dom';

import { useNetworkRoute } from 'hooks';
import { accountsRoutes } from 'routes';

export const useGetActiveSection = () => {
  const networkRoute = useNetworkRoute();

  let pathActiveSection: VerifiedContractTabsEnum =
    VerifiedContractTabsEnum.details;
  if (useMatch(networkRoute(accountsRoutes.accountCodeDetails))) {
    pathActiveSection = VerifiedContractTabsEnum.details;
  }
  if (useMatch(networkRoute(accountsRoutes.accountCodeConstructor))) {
    pathActiveSection = VerifiedContractTabsEnum.contractConstructor;
  }
  if (useMatch(networkRoute(accountsRoutes.accountCodeEndpoints))) {
    pathActiveSection = VerifiedContractTabsEnum.readEndpoints;
  }
  if (useMatch(networkRoute(accountsRoutes.accountCodeEndpointsRead))) {
    pathActiveSection = VerifiedContractTabsEnum.readEndpoints;
  }
  if (useMatch(networkRoute(accountsRoutes.accountCodeEndpointsWrite))) {
    pathActiveSection = VerifiedContractTabsEnum.writeEndpoints;
  }
  if (useMatch(networkRoute(accountsRoutes.accountCodeSource))) {
    pathActiveSection = VerifiedContractTabsEnum.sourceCode;
  }
  if (useMatch(networkRoute(accountsRoutes.accountCodeEvents))) {
    pathActiveSection = VerifiedContractTabsEnum.events;
  }
  if (useMatch(networkRoute(accountsRoutes.accountCodeTypes))) {
    pathActiveSection = VerifiedContractTabsEnum.types;
  }

  return pathActiveSection;
};
