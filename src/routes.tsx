import React from 'react';
import BlockDetails from './components/BlockDetails';
import Blocks from './components/Blocks';
import EmptySearch from './components/EmptySearch';
import HashSearch from './components/HashSearch';
import Home from './components/Home';
import MiniBlockDetails from './components/MiniBlockDetails';
import TransactionDetails from './components/TransactionDetails';
import Transactions from './components/Transactions';
import AccountDetails from './components/AccountDetails';
import Accounts from './components/Accounts';
import Nodes from './components/Nodes';
import Identities from './components/Identities';
import IdentityDetails from './components/IdentityDetails';
import NodeDetails from './components/NodeDetails';
import Tokens from './components/Tokens';
import TokensMeta from './components/TokensMeta';
import TokenDetails from './components/TokenDetails';
import TokenDetailsAccounts from './components/TokenDetails/TokenAccounts';
import TokenDetailsLockedAccounts from './components/TokenDetails/TokenLockedAccounts';
import TokenDetailsRoles from './components/TokenDetails/TokenRoles';
import Collections from './components/Collections';
import CollectionDetails from './components/CollectionDetails';
import Nfts from './components/Nfts';
import NftDetails from './components/NftDetails';
import { withPageTitle, withNetworkReady } from './sharedComponents';
import Providers from 'components/Providers';
import ProviderDetails from 'components/ProviderDetails';
import AccountContractCode from './components/AccountDetails/AccountContractCode';
import AccountTokens from 'components/AccountDetails/AccountTokens';
import AccountNfts from 'components/AccountDetails/AccountNfts';
import AccountScResults from 'components/AccountDetails/AccountScResults';
import AccountContracts from 'components/AccountDetails/AccountContracts';
import ProviderTransactions from 'components/ProviderDetails/ProviderTransactions';
import NodesStatistics from 'components/NodesStatistics';
import NodesQueue from 'components/NodesQueue';

interface RouteType {
  path: string;
  title: string;
  component: any;
}

// INFO: to split the app in chunks use:
// component: React.lazy(() => import('./components/Validators')),

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
  collectionsNft: '/collections/nft',
  collectionsSft: '/collections/sft',
  collectionDetails: '/collections/:hash',
};

export const nftRoutes = {
  nfts: '/nfts',
  nftDetails: '/nfts/:hash',
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
];

const wrappedRoutes = () =>
  routes.map((route) => {
    const title = route.title ? `${route.title} • Elrond Explorer` : 'Elrond Explorer';
    return {
      path: route.path,
      component: (withPageTitle(
        title,
        withNetworkReady(route.component)
      ) as any) as React.ComponentClass<{}, any>,
    };
  });

export default wrappedRoutes();
