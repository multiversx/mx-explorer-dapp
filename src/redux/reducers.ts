import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';

import { interfaceReducer } from './slices/interface';
import { networkReducer } from './slices/networks';
import { economicsReducer } from './slices/economics';
import { statsReducer } from './slices/stats';

const asyncIgnoredSlices = {};

const networkPersisted = {
  key: 'networks',
  storage: sessionStorage,
  blacklist: [],
};

const interfacePersisted = {
  key: 'interface',
  storage,
  blacklist: [],
};

const economicsPersisted = {
  key: 'economics',
  storage,
  blacklist: [],
};

const statsPersisted = {
  key: 'stats',
  storage,
  blacklist: [],
};

export const customIgnoredSlices = {
  networks: persistReducer(networkPersisted, networkReducer),
  interface: persistReducer(interfacePersisted, interfaceReducer),
  economics: persistReducer(economicsPersisted, economicsReducer),
  stats: persistReducer(statsPersisted, statsReducer),
};

export const ignoredSliceNames: string[] = [
  ...Object.keys(asyncIgnoredSlices).map((name) => name),
  ...Object.keys(customIgnoredSlices).map((name) => name),
];

function persistedSlice(name: string) {
  return {
    key: name,
    storage: storage,
    blacklist: ['status', 'error'],
  };
}

function wrapReducer<
  F extends (persistReducerFunc: ReturnType<typeof persistedSlice>, sliceObject: U) => any,
  U
>(persistReducerFunc: F, sliceObject: U, name: string): U {
  return persistReducerFunc(persistedSlice(name), sliceObject);
}

const ignoredSlices = Object.keys(asyncIgnoredSlices).reduce((acc, entry) => {
  const name = entry as keyof typeof asyncIgnoredSlices;
  return {
    ...acc,
    [name]: wrapReducer(persistReducer as any, asyncIgnoredSlices[name], name),
  };
}, {} as typeof asyncIgnoredSlices);

export const rootReducer = combineReducers({
  ...ignoredSlices,
  ...customIgnoredSlices,
});
