import React from 'react';
import { AccountDetails } from 'pages/AccountDetails';
import { AccountAnalytics } from 'pages/AccountDetails/AccountAnalytics';
import { AccountContractCode } from 'pages/AccountDetails/AccountContractCode';
import { AccountContracts } from 'pages/AccountDetails/AccountContracts';
import { AccountNfts } from 'pages/AccountDetails/AccountNfts';
import { AccountStaking } from 'pages/AccountDetails/AccountStaking';
import { AccountTokens } from 'pages/AccountDetails/AccountTokens';
import { Accounts } from 'pages/Accounts';
import { Analytics } from 'pages/Analytics';
import { AnalyticsCompare } from 'pages/AnalyticsCompare';
import { BlockDetails } from 'pages/BlockDetails';
import { Blocks } from 'pages/Blocks';
import { CollectionDetails } from 'pages/CollectionDetails';
import { CollectionDetailsRoles } from 'pages/CollectionDetails/CollectionRoles';
import { Collections } from 'pages/Collections';
import { EmptySearch } from 'pages/EmptySearch';
import { HashSearch } from 'pages/HashSearch';
import { Home } from 'pages/Home';
import { Identities } from 'pages/Identities';
import { IdentityDetails } from 'pages/IdentityDetails';
import { MiniBlockDetails } from 'pages/MiniBlockDetails';
import { NftDetails } from 'pages/NftDetails';
import { Nfts } from 'pages/Nfts';
import { NodeDetails } from 'pages/NodeDetails';
import { Nodes } from 'pages/Nodes';
import { NodesQueue } from 'pages/NodesQueue';
import { NodesStatistics } from 'pages/NodesStatistics';
import { ProviderDetails } from 'pages/ProviderDetails';
import { ProviderTransactions } from 'pages/ProviderDetails/ProviderTransactions';
import { Providers } from 'pages/Providers';
import { TokenDetails } from 'pages/TokenDetails';
import { TokenDetailsAccounts } from 'pages/TokenDetails/TokenAccounts';
import { TokenDetailsLockedAccounts } from 'pages/TokenDetails/TokenLockedAccounts';
import { TokenDetailsRoles } from 'pages/TokenDetails/TokenRoles';
import { Tokens } from 'pages/Tokens';
import { TokensMeta } from 'pages/TokensMeta';
import { TransactionDetails } from 'pages/TransactionDetails';
import { Transactions } from 'pages/Transactions';

import { withPageTitle, withNetworkReady } from '../components';

interface RouteType {
  path: string;
  title: string;
  component: any;
}

// INFO: to split the app in chunks use:
// component: React.lazy(() => import('./pages/Validators')),

export const searchRoutes = {
  index: '/search/',
  query: '/search/:hash'
};

export const blocksRoutes = {
  blocks: '/blocks',
  blocksDetails: '/blocks/:hash',
  miniBlockDetails: '/miniblocks/:hash'
};

export const transactionsRoutes = {
  transactions: '/transactions',
  transactionDetails: '/transactions/:hash',
  transactionDetailsLogs: '/transactions/:hash/logs'
};

export const accountsRoutes = {
  accounts: '/accounts',
  accountDetails: '/accounts/:hash',
  accountTokens: '/accounts/:hash/tokens',
  accountNfts: '/accounts/:hash/nfts',
  accountContracts: '/accounts/:hash/contracts',
  accountStaking: '/accounts/:hash/staking',
  accountAnalytics: '/accounts/:hash/analytics',
  oldAccountDetails: '/address/:hash',
  accountCode: '/accounts/:hash/code',
  accountCodeEndpoints: '/accounts/:hash/code/endpoints',
  accountCodeViews: '/accounts/:hash/code/endpoints',
  accountCodeTypes: '/accounts/:hash/code/endpoints'
};

export const validatorsRoutes = {
  identities: '/validators',
  identityDetails: '/identities/:hash',
  providers: '/providers',
  providerDetails: '/providers/:hash',
  providerTransactions: '/providers/:hash/transactions',
  nodes: '/nodes',
  nodeDetails: '/nodes/:hash',
  statistics: '/statistics',
  queue: '/queue'
};

export const tokensRoutes = {
  tokens: '/tokens',
  tokensMeta: '/meta-tokens',
  tokensMetaEsdt: '/meta-esdt',
  tokenDetails: '/tokens/:hash',
  tokensMetaEsdtDetails: '/meta-esdt/:hash',
  tokenDetailsAccounts: '/tokens/:hash/accounts',
  tokenDetailsLockedAccounts: '/tokens/:hash/locked-accounts',
  tokenDetailsRoles: '/tokens/:hash/roles'
};

export const collectionRoutes = {
  collections: '/collections',
  collectionsNft: '/collections/nft',
  collectionsSft: '/collections/sft',
  collectionDetails: '/collections/:hash',
  collectionDetailsRoles: '/collections/:hash/roles'
};

export const nftRoutes = {
  nfts: '/nfts',
  nftDetails: '/nfts/:hash'
};

export const analyticsRoutes = {
  analytics: '/analytics',
  compare: '/analytics/compare'
};

const mainRoutes: RouteType[] = [
  {
    path: searchRoutes.index,
    title: 'Search',
    component: EmptySearch
  },
  {
    path: searchRoutes.query,
    title: 'Search',
    component: HashSearch
  },
  {
    path: '/',
    title: '',
    component: Home
  },
  {
    path: blocksRoutes.blocks,
    title: 'Blocks',
    component: Blocks
  },
  {
    path: blocksRoutes.blocksDetails,
    title: 'Block Details',
    component: BlockDetails
  },
  {
    path: blocksRoutes.miniBlockDetails,
    title: 'Miniblock Details',
    component: MiniBlockDetails
  },
  {
    path: transactionsRoutes.transactions,
    title: 'Transactions',
    component: Transactions
  },
  {
    path: transactionsRoutes.transactionDetails,
    title: 'Transaction Details',
    component: TransactionDetails
  },
  {
    path: transactionsRoutes.transactionDetailsLogs,
    title: 'Transaction Logs',
    component: TransactionDetails
  },
  {
    path: validatorsRoutes.identities,
    title: 'Validators',
    component: Identities
  },
  {
    path: validatorsRoutes.identityDetails,
    title: 'Validator Details',
    component: IdentityDetails
  },
  {
    path: validatorsRoutes.nodes,
    title: 'Nodes',
    component: Nodes
  },
  {
    path: validatorsRoutes.nodeDetails,
    title: 'Node Details',
    component: NodeDetails
  },
  {
    path: validatorsRoutes.statistics,
    title: 'Nodes Statistics',
    component: NodesStatistics
  },
  {
    path: validatorsRoutes.queue,
    title: 'Nodes Queue',
    component: NodesQueue
  },
  {
    path: accountsRoutes.accounts,
    title: 'Accounts',
    component: Accounts
  },
  {
    path: accountsRoutes.accountDetails,
    title: 'Account Details',
    component: AccountDetails
  },
  {
    path: accountsRoutes.oldAccountDetails,
    title: 'Account Details',
    component: AccountDetails // redirect
  },
  {
    path: accountsRoutes.accountCode,
    title: 'Account Contract Code',
    component: AccountContractCode
  },
  {
    path: accountsRoutes.accountTokens,
    title: 'Account Tokens',
    component: AccountTokens
  },
  {
    path: accountsRoutes.accountNfts,
    title: 'Account NFTs',
    component: AccountNfts
  },
  {
    path: accountsRoutes.accountStaking,
    title: 'Account Staking Details',
    component: AccountStaking
  },
  {
    path: accountsRoutes.accountAnalytics,
    title: 'Account Analytics',
    component: AccountAnalytics
  },
  {
    path: accountsRoutes.accountContracts,
    title: 'Account Smart Contracts',
    component: AccountContracts
  },
  {
    path: tokensRoutes.tokens,
    title: 'Tokens',
    component: Tokens
  },
  {
    path: tokensRoutes.tokensMeta,
    title: 'Meta-ESDT Tokens',
    component: TokensMeta
  },
  {
    path: tokensRoutes.tokensMetaEsdt,
    title: 'Meta-ESDT Tokens',
    component: TokensMeta
  },
  {
    path: tokensRoutes.tokenDetails,
    title: 'Token Details',
    component: TokenDetails
  },
  {
    path: tokensRoutes.tokensMetaEsdtDetails,
    title: 'Meta-ESDT Details',
    component: CollectionDetails
  },
  {
    path: tokensRoutes.tokenDetailsAccounts,
    title: 'Token Holders',
    component: TokenDetailsAccounts
  },
  {
    path: tokensRoutes.tokenDetailsLockedAccounts,
    title: 'Locked Token Accounts',
    component: TokenDetailsLockedAccounts
  },
  {
    path: tokensRoutes.tokenDetailsRoles,
    title: 'Token Roles',
    component: TokenDetailsRoles
  },
  {
    path: collectionRoutes.collections,
    title: 'NFTs',
    component: Collections
  },
  {
    path: collectionRoutes.collectionsNft,
    title: 'NFT Collections',
    component: Collections
  },
  {
    path: collectionRoutes.collectionsSft,
    title: 'SFT Collections',
    component: Collections
  },
  {
    path: collectionRoutes.collectionDetails,
    title: 'Collection Details',
    component: CollectionDetails
  },
  {
    path: collectionRoutes.collectionDetailsRoles,
    title: 'Collection Details Roles',
    component: CollectionDetailsRoles
  },
  {
    path: nftRoutes.nfts,
    title: 'NFTs',
    component: Nfts
  },
  {
    path: nftRoutes.nftDetails,
    title: 'NFT Details',
    component: NftDetails
  },
  {
    path: validatorsRoutes.providers,
    title: 'Providers',
    component: Providers
  },
  {
    path: validatorsRoutes.providerDetails,
    title: 'Provider Details',
    component: ProviderDetails
  },
  {
    path: validatorsRoutes.providerTransactions,
    title: 'Provider Details',
    component: ProviderTransactions
  },
  {
    path: analyticsRoutes.analytics,
    title: 'Analytics',
    component: Analytics
  },
  {
    path: analyticsRoutes.compare,
    title: 'Analytics',
    component: AnalyticsCompare
  }
];

export const routes = () =>
  mainRoutes.map((route) => {
    const title = route.title
      ? `${route.title} • MultiversX (previously Elrond) Explorer`
      : 'MultiversX (previously Elrond) Explorer';

    return {
      path: route.path,
      Component: withPageTitle(
        title,
        withNetworkReady(route.component)
      ) as any as React.ComponentClass<any, any>
    };
  });

export const wrappedRoutes = routes();
