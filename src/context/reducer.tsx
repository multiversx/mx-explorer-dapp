import { StateType, ConfigType } from './state';
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
  | { type: 'setAccountTokens'; accountTokens: StateType['accountTokens'] }
  | { type: 'setGlobalStats'; globalStats: StateType['globalStats'] };

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
    case 'setAccountTokens': {
      return {
        ...state,
        accountTokens: action.accountTokens,
      };
    }
    case 'setGlobalStats': {
      return {
        ...state,
        globalStats: action.globalStats,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action!.type}`);
    }
  }
}
