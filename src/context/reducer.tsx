import { StateType, ConfigType, NotificationType } from './state';
import moment from 'moment';
import { storage } from 'helpers';

export type ActionType =
  | { type: 'changeNetwork'; networkId: string }
  | {
      type: 'updateNetworks';
      config: ConfigType;
    }
  | { type: 'setShards'; shards: StateType['shards'] }
  | { type: 'triggerTick' }
  | {
      type: 'changeTheme';
      theme: StateType['theme'];
    }
  | { type: 'setGlobalStake'; globalStake: StateType['globalStake'] }
  | { type: 'setAccountDetails'; accountDetails: StateType['accountDetails'] }
  | { type: 'setTokenDetails'; tokenDetails: StateType['tokenDetails'] }
  | { type: 'setUsd'; usd: StateType['usd'] }
  | {
      type: 'setUrlBlacklist';
      urlBlacklist: StateType['urlBlacklist'];
    }
  | {
      type: 'addNotification';
      notification: NotificationType;
    }
  | {
      type: 'removeNotification';
      id: NotificationType['id'];
    };

export function globalReducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'changeNetwork': {
      const newNetwork = state.config.networks.find((network) => network.id === action.networkId);
      const activeNetwork = newNetwork || state.defaultNetwork;
      // once activeNetworkId is populated, routes get prepended by networkId

      return {
        ...state,
        activeNetwork,
        activeNetworkId: action.networkId,
        refresh: {
          timestamp: Date.now(),
        },
      };
    }
    case 'updateNetworks': {
      return { ...state, config: action.config };
    }
    case 'triggerTick': {
      return {
        ...state,
        refresh: {
          timestamp: Date.now(),
        },
      };
    }
    case 'setShards': {
      return {
        ...state,
        shards: action.shards,
      };
    }
    case 'setGlobalStake': {
      return {
        ...state,
        globalStake: action.globalStake,
      };
    }
    case 'changeTheme': {
      const newState = { ...state, theme: action.theme };
      const in6m = new Date(moment().add(6, 'months').toDate());
      storage.saveToLocal({
        key: 'theme',
        data: action.theme,
        expirationDate: in6m,
      });
      return newState;
    }
    case 'setAccountDetails': {
      return {
        ...state,
        accountDetails: action.accountDetails,
      };
    }
    case 'setTokenDetails': {
      return {
        ...state,
        tokenDetails: action.tokenDetails,
      };
    }
    case 'setUsd': {
      return {
        ...state,
        usd: action.usd,
      };
    }
    case 'setUrlBlacklist': {
      return { ...state, urlBlacklist: action.urlBlacklist };
    }
    case 'addNotification': {
      return { ...state, notifications: [action.notification, ...state.notifications] };
    }
    case 'removeNotification': {
      return { ...state, notifications: state.notifications.filter((n) => n.id !== action.id) };
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as any).type}`);
    }
  }
}
