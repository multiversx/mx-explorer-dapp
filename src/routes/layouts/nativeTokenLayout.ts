import { networks } from 'config';

import { TitledRouteObject } from '../routes';

export const nativeTokenLayout: TitledRouteObject[] = [];

networks.forEach((network) => {
  if (!network.egldLabel) {
    return;
  }

  const networkPath = `/${network.egldLabel?.toLowerCase()}`;

  const routeExists = nativeTokenLayout.find(
    (route) => route.path === networkPath
  );

  if (routeExists) {
    return;
  }

  nativeTokenLayout.push({
    path: networkPath,
    preventScroll: true,
    lazyComponent: () =>
      import('layouts/NativeTokenLayout').then(
        (module) => module.NativeTokenLayout
      ),
    children: [
      {
        path: networkPath,
        title: network.egldLabel,
        preventScroll: true,
        lazyComponent: () =>
          import('pages/NativeToken/NativeTokenTransactions').then(
            (module) => module.NativeTokenTransactions
          )
      },
      {
        path: `${networkPath}/accounts`,
        title: 'Holders',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/NativeToken/NativeTokenAccounts').then(
            (module) => module.NativeTokenAccounts
          )
      }
    ]
  });
});
