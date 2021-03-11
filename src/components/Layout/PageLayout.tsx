import React from 'react';
import { useMatchPath } from 'helpers';
import { validatorsRoutes, accountDetailsRoutes } from 'routes';
import NodesLayout from 'components/Nodes/NodesLayout';
import AccountDetailsLayout from 'components/AccountDetails/AccountDetailsLayout';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const matchPath = useMatchPath();

  switch (true) {
    case matchPath(validatorsRoutes.index) !== null:
    case matchPath(validatorsRoutes.nodes) !== null:
    case matchPath(validatorsRoutes.providers) !== null:
      return <NodesLayout>{children}</NodesLayout>;

    case matchPath(accountDetailsRoutes.accountDetails) !== null:
    case matchPath(accountDetailsRoutes.accountDetailsContract) !== null:
      return <AccountDetailsLayout>{children}</AccountDetailsLayout>;

    default:
      return <>{children}</>;
  }
}
