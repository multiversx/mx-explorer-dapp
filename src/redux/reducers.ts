import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import sessionStorage from 'redux-persist/lib/storage/session';

import { accountReducer } from './slices/account';
import { accountExtraReducer } from './slices/accountExtra';
import { accountStakingReducer } from './slices/accountStaking';
import { blocksReducer } from './slices/blocks';
import { collectionReducer } from './slices/collection';
import { economicsReducer } from './slices/economics';
import { generalReducer } from './slices/general';
import { growthEconomicsReducer } from './slices/growthEconomics';
import { growthHeroReducer } from './slices/growthHero';
import { growthMostUsedReducer } from './slices/growthMostUsed';
import { growthPriceReducer } from './slices/growthPrice';
import { growthSearchReducer } from './slices/growthSearch';
import { growthStakingReducer } from './slices/growthStaking';
import { growthTransactionsReducer } from './slices/growthTransactions';
import { interfaceReducer } from './slices/interface';
import { markersReducer } from './slices/markers';
import { metaTagsReducer } from './slices/metaTags';
import { miniBlockReducer } from './slices/miniBlock';
import { networkReducer } from './slices/networks';
import { nftReducer } from './slices/nft';
import { nodesIdentitiesReducer } from './slices/nodesIdentities';
import { nodesOverviewReducer } from './slices/nodesOverview';
import { nodesVersionsReducer } from './slices/nodesVersions';
import { pageHeadersAccountsReducer } from './slices/pageHeadersAccountsStats';
import { pageHeadersBlocksReducer } from './slices/pageHeadersBlocksStats';
import { pageHeadersCollectionsReducer } from './slices/pageHeadersCollectionsStats';
import { pageHeadersTokensReducer } from './slices/pageHeadersTokensStats';
import { refreshReducer } from './slices/refresh';
import { stakeReducer } from './slices/stake';
import { stakeExtraReducer } from './slices/stakeExtra';
import { statsReducer } from './slices/stats';
import { tokenReducer } from './slices/token';
import { tokenExtraReducer } from './slices/tokenExtra';
import { transactionsReducer } from './slices/transactions';
import { transactionsInPoolReducer } from './slices/transactionsInPool';

const asyncIgnoredSlices = {};

// const networkPersisted = {
//   key: 'networks',
//   storage: sessionStorage,
//   blacklist: []
// };

// const interfacePersisted = {
//   key: 'interface',
//   storage,
//   blacklist: []
// };

export const customIgnoredSlices = {
  // networks: persistReducer(networkPersisted, networkReducer),
  // interface: persistReducer(interfacePersisted, interfaceReducer),

  networks: networkReducer,
  interface: interfaceReducer,

  account: accountReducer,
  accountExtra: accountExtraReducer,
  accountStaking: accountStakingReducer,
  blocks: blocksReducer,
  collection: collectionReducer,
  economics: economicsReducer,
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

function persistedSlice(name: string) {
  return {
    key: name,
    storage: storage,
    blacklist: ['status', 'error']
  };
}

function wrapReducer<
  F extends (
    persistReducerFunc: ReturnType<typeof persistedSlice>,
    sliceObject: U
  ) => any,
  U
>(persistReducerFunc: F, sliceObject: U, name: string): U {
  return persistReducerFunc(persistedSlice(name), sliceObject);
}

const ignoredSlices = Object.keys(asyncIgnoredSlices).reduce(
  (acc, entry) => {
    const name = entry as keyof typeof asyncIgnoredSlices;
    return {
      ...acc,
      [name]: wrapReducer(persistReducer as any, asyncIgnoredSlices[name], name)
    };
  },
  {} as typeof asyncIgnoredSlices
);

export const rootReducer = combineReducers({
  ...ignoredSlices,
  ...customIgnoredSlices
});
