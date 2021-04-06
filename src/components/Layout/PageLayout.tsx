import React from 'react';
import { useMatchPath } from 'helpers';
import { validatorsRoutes, accountRoutes, providerRoutes } from 'routes';
import NodesLayout from 'components/Nodes/NodesLayout';
import AccountLayout from 'components/AccountDetails/AccountLayout';
import ProviderLayout from 'components/ProviderDetails/ProviderLayout';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const matchPath = useMatchPath();

  switch (true) {
    case matchPath(validatorsRoutes.index) !== null:
    case matchPath(validatorsRoutes.nodes) !== null:
    case matchPath(validatorsRoutes.providers) !== null:
      return <NodesLayout>{children}</NodesLayout>;

    case matchPath(accountRoutes.index) !== null:
    case matchPath(accountRoutes.code) !== null:
    case matchPath(accountRoutes.tokens) !== null:
    case matchPath(accountRoutes.oldAccountDetails) !== null:
      return <AccountLayout>{children}</AccountLayout>;

    case matchPath(providerRoutes.index) !== null:
    case matchPath(providerRoutes.transactions) !== null:
      return <ProviderLayout>{children}</ProviderLayout>;

    default:
      return <>{children}</>;
  }
}
