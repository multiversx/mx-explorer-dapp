import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Dropdown, Nav, Navbar } from 'react-bootstrap';
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
  eventsRoutes,
  utilitiesRoutes
} from 'routes';

import { LinksPropsType, MenuLinkType } from './types';

export const Links = (props: LinksPropsType) => {
  const { onClick } = props;
  const { adapter } = useSelector(activeNetworkSelector);
  const activeRoute = useActiveRoute();
  const networkRoute = useNetworkRoute();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const isMainnet = useIsMainnet();
  const { hash: address } = useParams();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  const isAdapterAPI = adapter === 'api';
  const isOnAccountRoute =
    address &&
    addressIsBech32(address) &&
    Object.values(accountsRoutes).some((item) => activeRoute(item));

  const isOnTransactionsInPoolRoute = Object.values(
    transactionsInPoolRoutes
  ).some((item) => activeRoute(item));

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const setDropdownOpen = (label: string, isOpen: boolean) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: isOpen }));
  };

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
    },
    {
      label: 'Utilities',
      show: true,
      to: utilitiesRoutes.converters,
      activeRoutes: Object.values(utilitiesRoutes),
      subRoutes: [
        {
          label: 'Converters',
          show: true,
          to: utilitiesRoutes.converters,
          activeRoutes: [utilitiesRoutes.converters]
        },
        {
          label: 'Smart Contract Interaction',
          show: true,
          to: utilitiesRoutes.smartContractInteraction,
          activeRoutes: [utilitiesRoutes.smartContractInteraction]
        }
      ]
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
      <Navbar collapseOnSelect className='links navbar-nav mt-0'>
        {links.map((link) => {
          if (link.subRoutes) {
            const show = openDropdowns[link.label];
            return (
              <div
                key={`dropdown-${link.label}`}
                className={classNames('link dropdown-wrapper', {
                  active: getIsLinkActive(link) || show
                })}
              >
                <NetworkLink
                  to={link.to}
                  onClick={onClick}
                  className={classNames('link nav-link has-dropdown', {
                    active: getIsLinkActive(link) || show
                  })}
                  onMouseEnter={() => setDropdownOpen(link.label, true)}
                  onMouseLeave={() => setDropdownOpen(link.label, false)}
                >
                  {link.label}
                </NetworkLink>
                <Dropdown
                  className={classNames('link nav-item', {
                    active: getIsLinkActive(link)
                  })}
                  show={show}
                  onMouseEnter={() => setDropdownOpen(link.label, true)}
                  onMouseLeave={() => setDropdownOpen(link.label, false)}
                  onClick={() => {
                    toggleDropdown(link.label);
                  }}
                >
                  <Dropdown.Toggle
                    as={Nav.Link}
                    id={`dropdown-${link.label}`}
                    aria-label={`${link.label} submenu`}
                  >
                    <FontAwesomeIcon icon={faAngleDown} size='sm' />
                  </Dropdown.Toggle>
                  <Dropdown.Menu renderOnMount={true}>
                    {link.subRoutes.map((subroute) => {
                      return (
                        <Dropdown.Item
                          as={Link}
                          key={subroute.label}
                          to={networkRoute(subroute.to)}
                          className={classNames({
                            active: getIsLinkActive(subroute, true)
                          })}
                          onClick={onClick}
                        >
                          {subroute.label}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
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
            >
              {link.label}
            </NetworkLink>
          );
        })}
      </Navbar>
    </>
  );
};
