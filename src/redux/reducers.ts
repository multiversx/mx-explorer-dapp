import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';

import { accountReducer } from './slices/account';
import { accountStakingReducer } from './slices/accountStaking';
import { collectionReducer } from './slices/collection';
import { economicsReducer } from './slices/economics';
import { globalStakeReducer } from './slices/globalStake';
import { growthEconomicsReducer } from './slices/growthEconomics';
import { growthHeroReducer } from './slices/growthHero';
import { growthMostUsedReducer } from './slices/growthMostUsed';
import { growthPriceReducer } from './slices/growthPrice';
import { growthSearchReducer } from './slices/growthSearch';
import { growthStakingReducer } from './slices/growthStaking';
import { growthTransactionsReducer } from './slices/growthTransactions';
import { interfaceReducer } from './slices/interface';
import { markersReducer } from './slices/markers';
import { miniBlockReducer } from './slices/miniBlock';
import { networkReducer } from './slices/networks';
import { nodesVersionsReducer } from './slices/nodesVersions';
import { refreshReducer } from './slices/refresh';
import { statsReducer } from './slices/stats';
import { tokenReducer } from './slices/token';

const asyncIgnoredSlices = {};

const networkPersisted = {
  key: 'networks',
  storage: sessionStorage,
  blacklist: []
};

const interfacePersisted = {
  key: 'interface',
  storage,
  blacklist: []
};

export const customIgnoredSlices = {
  // networks: persistReducer(networkPersisted, networkReducer),
  // interface: persistReducer(interfacePersisted, interfaceReducer),

  networks: networkReducer,
  interface: interfaceReducer,

  account: accountReducer,
  accountStaking: accountStakingReducer,
  collection: collectionReducer,
  economics: economicsReducer,
  globalStake: globalStakeReducer,
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
  markers: markersReducer,
  miniBlock: miniBlockReducer,
  nodesVersions: nodesVersionsReducer
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

const ignoredSlices = Object.keys(asyncIgnoredSlices).reduce((acc, entry) => {
  const name = entry as keyof typeof asyncIgnoredSlices;
  return {
    ...acc,
    [name]: wrapReducer(persistReducer as any, asyncIgnoredSlices[name], name)
  };
}, {} as typeof asyncIgnoredSlices);

export const rootReducer = combineReducers({
  ...ignoredSlices,
  ...customIgnoredSlices
});
