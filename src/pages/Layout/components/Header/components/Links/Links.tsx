import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { NetworkLink } from 'components';
import { useActiveRoute, useIsMainnet } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import {
  blocksRoutes,
  transactionsRoutes,
  accountsRoutes,
  validatorsRoutes,
  tokensRoutes,
  nftRoutes,
  collectionRoutes,
  analyticsRoutes
} from 'routes';

import { LinksPropsType } from './types';

export const Links = (props: LinksPropsType) => {
  const { onClick } = props;
  const { adapter } = useSelector(activeNetworkSelector);
  const activeRoute = useActiveRoute();

  const isMainnet = useIsMainnet();
  const isAdapterAPI = adapter === 'api';

  const links = [
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
      activeRoutes: [
        blocksRoutes.blocks,
        blocksRoutes.blocksDetails,
        blocksRoutes.miniBlockDetails
      ]
    },
    {
      label: 'Transactions',
      show: true,
      to: transactionsRoutes.transactions,
      activeRoutes: [
        transactionsRoutes.transactions,
        transactionsRoutes.transactionDetails
      ]
    },
    {
      label: 'Accounts',
      show: true,
      to: accountsRoutes.accounts,
      activeRoutes: [
        accountsRoutes.accounts,
        accountsRoutes.accountDetails,
        accountsRoutes.accountTokens,
        accountsRoutes.accountNfts,
        accountsRoutes.accountContracts,
        accountsRoutes.accountCode,
        accountsRoutes.accountCodeConstructor,
        accountsRoutes.accountCodeEndpoints,
        accountsRoutes.accountCodeEvents,
        accountsRoutes.accountCodeTypes
      ]
    },
    {
      label: 'Tokens',
      to: tokensRoutes.tokens,
      show: isAdapterAPI,
      activeRoutes: [
        tokensRoutes.tokens,
        tokensRoutes.tokenDetails,
        tokensRoutes.tokenDetailsAccounts,
        tokensRoutes.tokenDetailsLockedAccounts,
        tokensRoutes.tokenDetailsRoles,
        tokensRoutes.tokensMeta,
        tokensRoutes.tokensMetaEsdt,
        tokensRoutes.tokensMetaEsdtDetails
      ]
    },
    {
      label: 'NFTs',
      to: collectionRoutes.collections,
      show: isAdapterAPI,
      activeRoutes: [
        collectionRoutes.collections,
        collectionRoutes.collectionDetails,
        collectionRoutes.collectionsNft,
        collectionRoutes.collectionsSft,
        collectionRoutes.collectionDetailsRoles,
        nftRoutes.nfts,
        nftRoutes.nftDetails,
        nftRoutes.nftDetailsAccounts
      ]
    },
    {
      label: 'Validators',
      to: isMainnet ? validatorsRoutes.identities : validatorsRoutes.nodes,
      show: isAdapterAPI,
      activeRoutes: [
        validatorsRoutes.identities,
        validatorsRoutes.identityDetails,
        validatorsRoutes.providers,
        validatorsRoutes.providerDetails,
        validatorsRoutes.providerTransactions,
        validatorsRoutes.nodes,
        validatorsRoutes.nodeDetails,
        validatorsRoutes.statistics,
        validatorsRoutes.queue
      ]
    },
    {
      label: 'Analytics',
      to: analyticsRoutes.analytics,
      show: isAdapterAPI && isMainnet,
      activeRoutes: [analyticsRoutes.analytics, analyticsRoutes.compare]
    }
  ].filter((link) => link.show);

  return (
    <div className='links'>
      {links.map((link) => (
        <NetworkLink
          key={link.label}
          to={link.to}
          onClick={onClick}
          className={classNames('link', {
            active: link.activeRoutes.some((item) => activeRoute(item))
          })}
        >
          {link.label}
        </NetworkLink>
      ))}
    </div>
  );
};
