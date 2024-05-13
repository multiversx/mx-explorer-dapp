import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { NetworkLink } from 'components';
import { isContract, addressIsBech32 } from 'helpers';
import { useActiveRoute, useIsMainnet } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import {
  blocksRoutes,
  transactionsRoutes,
  accountsRoutes,
  applicationsRoutes,
  validatorsRoutes,
  tokensRoutes,
  nftRoutes,
  collectionRoutes,
  analyticsRoutes
} from 'routes';

import { LinksPropsType, MenuLinkType } from './types';

export const Links = (props: LinksPropsType) => {
  const { onClick } = props;
  const { adapter } = useSelector(activeNetworkSelector);
  const activeRoute = useActiveRoute();
  const { hash: address } = useParams();

  const isMainnet = useIsMainnet();
  const isAdapterAPI = adapter === 'api';
  const isOnAccountRoute =
    address &&
    addressIsBech32(address) &&
    Object.values(accountsRoutes).some((item) => activeRoute(item));

  const links: MenuLinkType[] = [
    {
      label: 'Dashboard',
      to: '/',
      show: true,
      activeRoutes: ['/']
    },
    {
      label: 'Blocks',
      to: blocksRoutes.blocks,
      show: true,
      activeRoutes: Object.values(blocksRoutes)
    },
    {
      label: 'Transactions',
      show: true,
      to: transactionsRoutes.transactions,
      activeRoutes: Object.values(transactionsRoutes)
    },
    {
      label: 'Accounts',
      show: true,
      to: accountsRoutes.accounts,
      activeRoutes: Object.values(accountsRoutes)
    },
    {
      label: 'Apps',
      show: true,
      to: applicationsRoutes.applications,
      activeRoutes: [applicationsRoutes.applications]
    },
    {
      label: 'Tokens',
      to: tokensRoutes.tokens,
      show: isAdapterAPI,
      activeRoutes: Object.values(tokensRoutes)
    },
    {
      label: 'NFTs',
      to: collectionRoutes.collections,
      show: isAdapterAPI,
      activeRoutes: [
        ...Object.values(collectionRoutes),
        ...Object.values(nftRoutes)
      ]
    },
    {
      label: 'Validators',
      to: isMainnet ? validatorsRoutes.identities : validatorsRoutes.nodes,
      show: isAdapterAPI,
      activeRoutes: Object.values(validatorsRoutes)
    },
    {
      label: 'Analytics',
      to: analyticsRoutes.analytics,
      show: isAdapterAPI && isMainnet,
      activeRoutes: Object.values(analyticsRoutes)
    }
  ].filter((link) => link.show);

  const getIsLinkActive = (link: MenuLinkType) => {
    if (isOnAccountRoute) {
      if (isContract(address)) {
        return link.to === applicationsRoutes.applications;
      } else {
        return link.to === accountsRoutes.accounts;
      }
    }

    return link.activeRoutes.some((item) => activeRoute(item));
  };

  return (
    <menu className='links navbar-nav mt-0' role='menubar'>
      {links.map((link) => {
        return (
          <li key={link.label} role='presentation'>
            <NetworkLink
              to={link.to}
              onClick={onClick}
              className={classNames('link nav-item', {
                active: getIsLinkActive(link)
              })}
              role='menuitem'
            >
              {link.label}
            </NetworkLink>
          </li>
        );
      })}
    </menu>
  );
};
