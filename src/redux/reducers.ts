import { combineReducers } from '@reduxjs/toolkit';

import {
  accountReducer,
  accountExtraReducer,
  accountStakingReducer
} from './slices/account';
import { blocksReducer } from './slices/blocks';
import { collectionReducer } from './slices/collection';
import { economicsReducer } from './slices/economics';
import { epochProgressReducer } from './slices/epochProgress';
import { generalReducer } from './slices/general';

import { interfaceReducer } from './slices/interface';
import { markersReducer } from './slices/markers';
import { metaTagsReducer } from './slices/metaTags';
import { miniBlockReducer } from './slices/miniBlock';
import { networkReducer } from './slices/networks';
import { nftReducer } from './slices/nft';
import {
  nodesIdentitiesReducer,
  nodesOverviewReducer,
  nodesVersionsReducer
} from './slices/nodes';

import { refreshReducer } from './slices/refresh';
import { stakeReducer } from './slices/stake';
import { stakeExtraReducer } from './slices/stakeExtra';
import { statsReducer } from './slices/stats';
import { tokenReducer } from './slices/token';
import { tokenExtraReducer } from './slices/tokenExtra';
import {
  eventsReducer,
  transactionsReducer,
  transactionsInPoolReducer,
  transactionOverviewReducer,
  customEventsReducer,
  customTransactionsReducer,
  customTransfersReducer
} from './slices/transactions';

import {
  growthEconomicsReducer,
  growthHeroReducer,
  growthMostUsedReducer,
  growthPriceReducer,
  growthSearchReducer,
  growthStakingReducer,
  growthTransactionsReducer,
  pageHeadersAccountsReducer,
  pageHeadersBlocksReducer,
  pageHeadersCollectionsReducer,
  pageHeadersTokensReducer
} from './slices/widgets';

const asyncIgnoredSlices = {};

export const customIgnoredSlices = {
  networks: networkReducer,
  interface: interfaceReducer,

  account: accountReducer,
  accountExtra: accountExtraReducer,
  accountStaking: accountStakingReducer,
  blocks: blocksReducer,
  collection: collectionReducer,
  customEvents: customEventsReducer,
  customTransactions: customTransactionsReducer,
  customTransfers: customTransfersReducer,
  economics: economicsReducer,
  epochProgress: epochProgressReducer,
  events: eventsReducer,
  general: generalReducer,
  stake: stakeReducer,
  stakeExtra: stakeExtraReducer,
  growthHero: growthHeroReducer,
  growthMostUsed: growthMostUsedReducer,
  growthPrice: growthPriceReducer,
  growthSearch: growthSearchReducer,
  growthStaking: growthStakingReducer,
  growthTransactions: growthTransactionsReducer,
  growthEconomics: growthEconomicsReducer,
  refresh: refreshReducer,
  stats: statsReducer,
  token: tokenReducer,
  tokenExtra: tokenExtraReducer,
  transactions: transactionsReducer,
  transactionsInPool: transactionsInPoolReducer,
  transactionOverview: transactionOverviewReducer,
  markers: markersReducer,
  metaTags: metaTagsReducer,
  miniBlock: miniBlockReducer,
  nft: nftReducer,
  nodesIdentities: nodesIdentitiesReducer,
  nodesOverview: nodesOverviewReducer,
  nodesVersions: nodesVersionsReducer,
  pageHeadersBlocksStats: pageHeadersBlocksReducer,
  pageHeadersAccountsStats: pageHeadersAccountsReducer,
  pageHeadersCollectionsStats: pageHeadersCollectionsReducer,
  pageHeadersTokensStats: pageHeadersTokensReducer
};

export const ignoredSliceNames: string[] = [
  ...Object.keys(asyncIgnoredSlices).map((name) => name),
  ...Object.keys(customIgnoredSlices).map((name) => name)
];

export const rootReducer = combineReducers({
  ...asyncIgnoredSlices,
  ...customIgnoredSlices
});
