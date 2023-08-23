import React from 'react';
import { faCircleCheck } from 'icons/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { Tabs } from 'components/Tabs';
import { urlBuilder } from 'helpers';
import { useNetworkRoute } from 'hooks';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { accountsRoutes } from 'routes';

export const AccountTabs = () => {
  const networkRoute = useNetworkRoute();
  const { account } = useSelector(accountSelector);
  const { address, code, isVerified } = account;
  const { adapter } = useSelector(activeNetworkSelector);

  const tokensRouteActive = adapter === 'api';
  const tabs = [
    {
      tabLabel: 'Transactions',
      tabTo: urlBuilder.accountDetails(address),
      activationRoutes: [accountsRoutes.accountDetails]
    },
    {
      tabLabel: 'ESDT Tokens',
      tabTo: urlBuilder.accountDetailsTokens(address),
      activationRoutes: [accountsRoutes.accountTokens],
      show: tokensRouteActive
    },
    {
      tabLabel: 'NFTs',
      tabTo: urlBuilder.accountDetailsNfts(address),
      activationRoutes: [accountsRoutes.accountNfts],
      show: tokensRouteActive
    },
    {
      tabLabel: 'Staking',
      tabTo: urlBuilder.accountDetailsStaking(address),
      activationRoutes: [accountsRoutes.accountStaking]
    },
    {
      tabLabel: 'Analytics',
      tabTo: urlBuilder.accountDetailsAnalytics(address),
      activationRoutes: [accountsRoutes.accountAnalytics]
    },
    {
      tabLabel: 'Smart Contracts',
      tabTo: urlBuilder.accountDetailsContracts(address),
      activationRoutes: [accountsRoutes.accountContracts],
      show: !code
    },
    {
      tabLabel: 'Upgrades',
      tabTo: urlBuilder.accountDetailsUpgrades(address),
      activationRoutes: [accountsRoutes.accountUpgrades],
      show: Boolean(code)
    },
    {
      tabTo: urlBuilder.accountDetailsContractCode(address),
      activationRoutes: [
        accountsRoutes.accountCode,
        accountsRoutes.accountCodeEndpoints
      ],
      show: Boolean(code),
      tabLabel: (
        <>
          Code{' '}
          {isVerified && (
            <FontAwesomeIcon
              icon={faCircleCheck}
              size='xs'
              className='text-primary-200 ms-1'
            />
          )}
        </>
      )
    },
    {
      tabLabel: 'Token Roles',
      tabTo: networkRoute(urlBuilder.accountDetailsTokenRoles(address)),
      activationRoutes: [accountsRoutes.accountRolesTokens],
      show: tokensRouteActive,
      extra: true
    },
    {
      tabLabel: 'Collection Roles',
      tabTo: networkRoute(urlBuilder.accountDetailsCollectionRoles(address)),
      activationRoutes: [accountsRoutes.accountRolesCollections],
      show: tokensRouteActive,
      extra: true
    }
  ];

  return <Tabs tabs={tabs} />;
};
