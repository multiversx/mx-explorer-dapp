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

import type { LinksPropsType } from './types';

import styles from './styles.module.scss';

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
        nftRoutes.nfts,
        nftRoutes.nftDetails
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
      activeRoutes: [analyticsRoutes.analytics]
    }
  ].filter((link) => link.show);

  return (
    <div className={styles.links}>
      {links.map((link) => (
        <NetworkLink
          key={link.label}
          to={link.to}
          onClick={onClick}
          className={classNames(styles.link, {
            [styles.active]: link.activeRoutes.some((item) => activeRoute(item))
          })}
        >
          {link.label}
        </NetworkLink>
      ))}
    </div>
  );
};
