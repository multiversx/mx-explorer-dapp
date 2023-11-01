import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

import {
  METACHAIN_SHARD_ID,
  TEMP_LOCAL_NOTIFICATION_DISMISSED
} from 'appConstants';
import { storage } from 'helpers';
import { sortShards } from 'helpers/sortShards';
import {
  ExplorerOriginType,
  ThemesEnum,
  NotificationType,
  ShardType
} from 'types';

export type InterfaceSliceType = {
  activeTheme: ThemesEnum;
  explorerOrigin: ExplorerOriginType;
  notifications: NotificationType[];
  shards: ShardType[];
};

export function getInitialInterfaceState(): InterfaceSliceType {
  // TODO: Uncomment when multiples themes are available
  // const media = window.matchMedia('(prefers-color-scheme: dark)')?.matches;
  // const systemTheme = media ? ThemesEnum.default : ThemesEnum.default;

  // const defaultTheme = Boolean(process.env.VITE_APP_TESTNET)
  //   ? ThemesEnum.testnet
  //   : systemTheme;

  return {
    activeTheme: ThemesEnum.default,
    explorerOrigin: {
      pathname: '/',
      search: ''
    },
    notifications: [],
    shards: []
  };
}

export const interfaceSlice = createSlice({
  name: 'interfaceSlice',
  initialState: getInitialInterfaceState(),
  reducers: {
    setActiveTheme: (
      state: InterfaceSliceType,
      action: PayloadAction<InterfaceSliceType['activeTheme']>
    ) => {
      state.activeTheme = action.payload;
    },
    setExplorerOrigin: (
      state: InterfaceSliceType,
      action: PayloadAction<InterfaceSliceType['explorerOrigin']>
    ) => {
      state.explorerOrigin = action.payload;
    },
    setShards: (
      state: InterfaceSliceType,
      action: PayloadAction<InterfaceSliceType['shards']>
    ) => {
      state.shards = sortShards({ shards: action.payload, METACHAIN_SHARD_ID });
    },
    addNotification: (
      state: InterfaceSliceType,
      action: PayloadAction<NotificationType>
    ) => {
      const notification = action.payload;
      const toastAlreadyExists = state.notifications.some(
        (t) => t.id === notification.id
      );
      if (!toastAlreadyExists) {
        state.notifications.push(notification);
      }
    },
    removeNotification: (
      state: InterfaceSliceType,
      action: PayloadAction<string>
    ) => {
      const removedNotificationId = action.payload;
      if (removedNotificationId === TEMP_LOCAL_NOTIFICATION_DISMISSED) {
        const in30Days = new Date(moment().add(30, 'days').toDate());
        storage.saveToLocal({
          key: TEMP_LOCAL_NOTIFICATION_DISMISSED,
          data: TEMP_LOCAL_NOTIFICATION_DISMISSED,
          expirationDate: in30Days
        });
      }
      state.notifications = state.notifications.filter(
        (n) => n.id !== removedNotificationId
      );
    }
  }
});

export const {
  setActiveTheme,
  setExplorerOrigin,
  setShards,
  addNotification,
  removeNotification
} = interfaceSlice.actions;

export const interfaceReducer = interfaceSlice.reducer;
