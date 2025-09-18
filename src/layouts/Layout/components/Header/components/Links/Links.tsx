import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Navbar, NavDropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { NetworkLink } from 'components';
import { isContract, addressIsBech32 } from 'helpers';
import {
  useActiveRoute,
  useIsMainnet,
  useHasGrowthWidgets,
  useNetworkRoute
} from 'hooks';
import { faAngleDown } from 'icons/regular';
import { activeNetworkSelector } from 'redux/selectors';
import {
  blocksRoutes,
  transactionsRoutes,
  transactionsInPoolRoutes,
  accountsRoutes,
  applicationsRoutes,
  validatorsRoutes,
  tokensRoutes,
  nftRoutes,
  collectionRoutes,
  analyticsRoutes,
  eventsRoutes
} from 'routes';

import { LinksPropsType, MenuLinkType } from './types';

export const Links = (props: LinksPropsType) => {
  const { onClick } = props;
  const { adapter } = useSelector(activeNetworkSelector);
  const activeRoute = useActiveRoute();
  const { hash: address } = useParams();

  const networkRoute = useNetworkRoute();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const isMainnet = useIsMainnet();
  const isAdapterAPI = adapter === 'api';
  const isOnAccountRoute =
    address &&
    addressIsBech32(address) &&
    Object.values(accountsRoutes).some((item) => activeRoute(item));

  const isOnTransactionsInPoolRoute = Object.values(
    transactionsInPoolRoutes
  ).some((item) => activeRoute(item));

  const [show, setShow] = useState(false);

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
      activeRoutes: [
        ...Object.values(transactionsRoutes),
        ...Object.values(transactionsInPoolRoutes),
        ...Object.values(eventsRoutes)
      ],
      subRoutes: [
        {
          label: 'Transactions',
          show: true,
          to: transactionsRoutes.transactions,
          activeRoutes: Object.values(transactionsRoutes)
        },
        {
          label: 'Transaction Pool',
          show: true,
          to: transactionsInPoolRoutes.transactionsInPool,
          activeRoutes: Object.values(transactionsInPoolRoutes)
        },
        {
          label: 'Events',
          show: true,
          to: eventsRoutes.events,
          activeRoutes: Object.values(eventsRoutes)
        }
      ]
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
      activeRoutes: Object.values(applicationsRoutes)
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
      show: isAdapterAPI && isMainnet && hasGrowthWidgets,
      activeRoutes: Object.values(analyticsRoutes)
    }
  ].filter((link) => link.show);

  const getIsLinkActive = (link: MenuLinkType, includeAsterisk?: boolean) => {
    if (isOnAccountRoute) {
      if (isContract(address)) {
        return link.to === applicationsRoutes.applications;
      } else {
        return link.to === accountsRoutes.accounts;
      }
    }

    // avoid false positive from * transactionDetails route
    if (isOnTransactionsInPoolRoute && includeAsterisk) {
      return (
        link.to === transactionsInPoolRoutes.transactionsInPool ||
        link.to === transactionsInPoolRoutes.transactionsInPoolDetails
      );
    }

    return link.activeRoutes.some((item) => activeRoute(item));
  };

  return (
    <>
      <Navbar collapseOnSelect className='links navbar-nav mt-0' role='menubar'>
        {links.map((link) => {
          if (link.subRoutes) {
            return (
              <li
                key={`dropdown-${link.label}`}
                className={classNames('link dropdown-wrapper', {
                  active: getIsLinkActive(link) || show
                })}
                role='presentation'
              >
                <NetworkLink
                  to={link.to}
                  onClick={onClick}
                  role='menuitem'
                  className={classNames('link nav-link has-dropdown', {
                    active: getIsLinkActive(link) || show
                  })}
                  onMouseEnter={() => setShow(true)}
                  onMouseLeave={() => setShow(false)}
                >
                  {link.label}
                </NetworkLink>
                <NavDropdown
                  className={classNames('link', {
                    active: getIsLinkActive(link)
                  })}
                  id={`dropdown-${link.label}`}
                  title={<FontAwesomeIcon icon={faAngleDown} size='sm' />}
                  renderMenuOnMount={true}
                  show={show}
                  onMouseEnter={() => setShow(true)}
                  onMouseLeave={() => setShow(false)}
                  onClick={() => {
                    setShow((show) => !show);
                  }}
                >
                  {link.subRoutes.map((subroute) => {
                    return (
                      <NavDropdown.Item
                        as={Link}
                        key={subroute.label}
                        to={networkRoute(subroute.to)}
                        className={classNames({
                          active: getIsLinkActive(subroute, true)
                        })}
                        onClick={onClick}
                      >
                        {subroute.label}
                      </NavDropdown.Item>
                    );
                  })}
                </NavDropdown>
              </li>
            );
          }

          return (
            <NetworkLink
              key={link.label}
              to={link.to}
              onClick={onClick}
              className={classNames('link nav-link', {
                active: getIsLinkActive(link)
              })}
              role='menuitem'
            >
              {link.label}
            </NetworkLink>
          );
        })}
      </Navbar>
    </>
  );
};
