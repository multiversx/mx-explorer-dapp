import React from 'react';
import { useMatchPath } from 'helpers';
import { validatorsRoutes, accountRoutes } from 'routes';
import NodesLayout from 'components/Nodes/NodesLayout';
import AccountLayout from 'components/AccountDetails/AccountLayout';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const matchPath = useMatchPath();

  switch (true) {
    case matchPath(validatorsRoutes.index) !== null:
    case matchPath(validatorsRoutes.nodes) !== null:
    case matchPath(validatorsRoutes.providers) !== null:
      return <NodesLayout>{children}</NodesLayout>;

    case matchPath(accountRoutes.index) !== null:
    case matchPath(accountRoutes.contract) !== null:
      return <AccountLayout>{children}</AccountLayout>;

    default:
      return <>{children}</>;
  }
}
