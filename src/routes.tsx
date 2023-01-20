import React from 'react';
import BlockDetails from './pages/BlockDetails';
import Blocks from './pages/Blocks';
import EmptySearch from './pages/EmptySearch';
import HashSearch from './pages/HashSearch';
import Home from './pages/Home';
import MiniBlockDetails from './pages/MiniBlockDetails';
import TransactionDetails from './pages/TransactionDetails';
import Transactions from './pages/Transactions';
import AccountDetails from './pages/AccountDetails';
import Accounts from './pages/Accounts';
import Nodes from './pages/Nodes';
import Identities from './pages/Identities';
import IdentityDetails from './pages/IdentityDetails';
import NodeDetails from './pages/NodeDetails';
import Tokens from './pages/Tokens';
import TokensMeta from './pages/TokensMeta';
import TokenDetails from './pages/TokenDetails';
import TokenDetailsAccounts from './pages/TokenDetails/TokenAccounts';
import TokenDetailsLockedAccounts from './pages/TokenDetails/TokenLockedAccounts';
import TokenDetailsRoles from './pages/TokenDetails/TokenRoles';
import Collections from './pages/Collections';
import CollectionDetails from './pages/CollectionDetails';
import CollectionDetailsRoles from './pages/CollectionDetails/CollectionRoles';
import Nfts from './pages/Nfts';
import NftDetails from './pages/NftDetails';
import { withPageTitle, withNetworkReady } from './sharedComponents';
import Providers from 'pages/Providers';
import ProviderDetails from 'pages/ProviderDetails';
import AccountContractCode from './pages/AccountDetails/AccountContractCode';
import AccountTokens from 'pages/AccountDetails/AccountTokens';
import AccountNfts from 'pages/AccountDetails/AccountNfts';
import AccountScResults from 'pages/AccountDetails/AccountScResults';
import AccountContracts from 'pages/AccountDetails/AccountContracts';
import AccountStaking from 'pages/AccountDetails/AccountStaking';
import AccountAnalytics from 'pages/AccountDetails/AccountAnalytics';
import ProviderTransactions from 'pages/ProviderDetails/ProviderTransactions';
import NodesStatistics from 'pages/NodesStatistics';
import NodesQueue from 'pages/NodesQueue';
import { Analytics } from 'pages/Analytics';

interface RouteType {
  path: string;
  title: string;
  component: any;
}

// INFO: to split the app in chunks use:
// component: React.lazy(() => import('./pages/Validators')),

export const searchRoutes = {
  index: '/search/',
  query: '/search/:hash',
};

export const blocksRoutes = {
  blocks: '/blocks',
  blocksDetails: '/blocks/:hash',
  miniBlockDetails: '/miniblocks/:hash',
};

export const transactionsRoutes = {
  transactions: '/transactions',
  transactionDetails: '/transactions/:hash/:tab?',
};

export const accountsRoutes = {
  accounts: '/accounts',
  accountDetails: '/accounts/:hash',
  accountCode: `/accounts/:hash/code`,
  accountTokens: `/accounts/:hash/tokens`,
  accountNfts: `/accounts/:hash/nfts`,
  accountScResults: `/accounts/:hash/sc-results`,
  accountContracts: `/accounts/:hash/contracts`,
  accountStaking: `/accounts/:hash/staking`,
  accountAnalytics: `/accounts/:hash/analytics`,
  oldAccountDetails: `/address/:hash`,
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
  queue: '/queue',
};

export const tokensRoutes = {
  tokens: '/tokens',
  tokensMeta: '/meta-tokens',
  tokenDetails: '/tokens/:hash',
  tokenDetailsAccounts: '/tokens/:hash/accounts',
  tokenDetailsLockedAccounts: '/tokens/:hash/locked-accounts',
  tokenDetailsRoles: '/tokens/:hash/roles',
};

export const collectionRoutes = {
  collections: '/collections',
  collectionsNft: '/nft-collections',
  collectionsSft: '/sft-collections',
  collectionDetails: '/collections/:hash',
  collectionDetailsRoles: '/collections/:hash/roles',
};

export const nftRoutes = {
  nfts: '/nfts',
  nftDetails: '/nfts/:hash',
};

export const analyticsRoutes = {
  analytics: '/analytics',
};

const routes: RouteType[] = [
  {
    path: searchRoutes.index,
    title: 'Search',
    component: EmptySearch,
  },
  {
    path: searchRoutes.query,
    title: 'Search',
    component: HashSearch,
  },
  {
    path: '/',
    title: '',
    component: Home,
  },
  {
    path: blocksRoutes.blocks,
    title: 'Blocks',
    component: Blocks,
  },
  {
    path: blocksRoutes.blocksDetails,
    title: 'Block Details',
    component: BlockDetails,
  },
  {
    path: blocksRoutes.miniBlockDetails,
    title: 'Miniblock Details',
    component: MiniBlockDetails,
  },
  {
    path: transactionsRoutes.transactions,
    title: 'Transactions',
    component: Transactions,
  },
  {
    path: transactionsRoutes.transactionDetails,
    title: 'Transaction Details',
    component: TransactionDetails,
  },
  {
    path: validatorsRoutes.identities,
    title: 'Validators',
    component: Identities,
  },
  {
    path: validatorsRoutes.identityDetails,
    title: 'Validator Details',
    component: IdentityDetails,
  },
  {
    path: validatorsRoutes.nodes,
    title: 'Nodes',
    component: Nodes,
  },
  {
    path: validatorsRoutes.nodeDetails,
    title: 'Node Details',
    component: NodeDetails,
  },
  {
    path: validatorsRoutes.statistics,
    title: 'Nodes Statistics',
    component: NodesStatistics,
  },
  {
    path: validatorsRoutes.queue,
    title: 'Nodes Queue',
    component: NodesQueue,
  },
  {
    path: accountsRoutes.accounts,
    title: 'Accounts',
    component: Accounts,
  },
  {
    path: accountsRoutes.accountDetails,
    title: 'Account Details',
    component: AccountDetails,
  },
  {
    path: accountsRoutes.oldAccountDetails,
    title: 'Account Details',
    component: AccountDetails, // redirect
  },
  {
    path: accountsRoutes.accountCode,
    title: 'Account Contract Code',
    component: AccountContractCode,
  },
  {
    path: accountsRoutes.accountTokens,
    title: 'Account Tokens',
    component: AccountTokens,
  },
  {
    path: accountsRoutes.accountNfts,
    title: 'Account NFTs',
    component: AccountNfts,
  },
  {
    path: accountsRoutes.accountStaking,
    title: 'Account Staking Details',
    component: AccountStaking,
  },
  {
    path: accountsRoutes.accountAnalytics,
    title: 'Account Analytics',
    component: AccountAnalytics,
  },
  {
    path: accountsRoutes.accountScResults,
    title: 'Account Smart Contract Results',
    component: AccountScResults,
  },
  {
    path: accountsRoutes.accountContracts,
    title: 'Account Smart Contracts',
    component: AccountContracts,
  },
  {
    path: tokensRoutes.tokens,
    title: 'Tokens',
    component: Tokens,
  },
  {
    path: tokensRoutes.tokensMeta,
    title: 'Meta-ESDT Tokens',
    component: TokensMeta,
  },
  {
    path: tokensRoutes.tokenDetails,
    title: 'Token Details',
    component: TokenDetails,
  },
  {
    path: tokensRoutes.tokenDetailsAccounts,
    title: 'Token Holders',
    component: TokenDetailsAccounts,
  },
  {
    path: tokensRoutes.tokenDetailsLockedAccounts,
    title: 'Locked Token Accounts',
    component: TokenDetailsLockedAccounts,
  },
  {
    path: tokensRoutes.tokenDetailsRoles,
    title: 'Token Roles',
    component: TokenDetailsRoles,
  },
  {
    path: collectionRoutes.collections,
    title: 'Collections',
    component: Collections,
  },
  {
    path: collectionRoutes.collectionsNft,
    title: 'NFT Collections',
    component: Collections,
  },
  {
    path: collectionRoutes.collectionsSft,
    title: 'SFT Collections',
    component: Collections,
  },
  {
    path: collectionRoutes.collectionDetails,
    title: 'Collection Details',
    component: CollectionDetails,
  },
  {
    path: collectionRoutes.collectionDetailsRoles,
    title: 'Collection Details Roles',
    component: CollectionDetailsRoles,
  },
  {
    path: nftRoutes.nfts,
    title: 'NFTs',
    component: Nfts,
  },
  {
    path: nftRoutes.nftDetails,
    title: 'NFT Details',
    component: NftDetails,
  },
  {
    path: validatorsRoutes.providers,
    title: 'Providers',
    component: Providers,
  },
  {
    path: validatorsRoutes.providerDetails,
    title: 'Provider Details',
    component: ProviderDetails,
  },
  {
    path: validatorsRoutes.providerTransactions,
    title: 'Provider Details',
    component: ProviderTransactions,
  },
  {
    path: analyticsRoutes.analytics,
    title: 'Analytics',
    component: Analytics,
  },
];

const wrappedRoutes = () =>
  routes.map((route) => {
    const title = route.title
      ? `${route.title} • MultiversX (previously Elrond) Explorer`
      : 'MultiversX (previously Elrond) Explorer';
    return {
      path: route.path,
      component: (withPageTitle(
        title,
        withNetworkReady(route.component)
      ) as any) as React.ComponentClass<{}, any>,
    };
  });

export default wrappedRoutes();
