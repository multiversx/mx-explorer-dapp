import axios from 'axios';
import { StateType, ConfigType } from './state';
import moment from 'moment';
import { storage } from 'helpers';

export type ActionType =
  | { type: 'changeNetwork'; networkId: string }
  | {
      type: 'updateNetworks';
      config: ConfigType;
    }
  | { type: 'setValidatorData'; validatorData: StateType['validatorData'] } // TODO: remove
  | { type: 'setBrandData'; brandData: StateType['brandData'] } // TODO: remove
  | { type: 'setNodes'; nodes: StateType['nodes'] }
  | { type: 'setBrands'; brands: StateType['brands'] }
  | {
      type: 'setIdentities';
      identities: StateType['identities'];
      blockchainTotalStake: StateType['blockchainTotalStake'];
    }
  | { type: 'setShards'; shards: StateType['shards'] }
  | { type: 'triggerNewRound' }
  | { type: 'cancelAllRequests' }
  | {
      type: 'changeTheme';
      theme: StateType['theme'];
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
    case 'triggerNewRound': {
      return {
        ...state,
        refresh: {
          timestamp: Date.now(),
        },
      };
    }
    case 'setValidatorData': {
      const { validatorData } = action;
      return {
        ...state,
        validatorData,
      };
    }
    case 'setNodes': {
      return {
        ...state,
        nodes: action.nodes,
      };
    }
    case 'setBrands': {
      // TODO: remove
      return {
        ...state,
        brands: action.brands,
      };
    }
    case 'setIdentities': {
      return {
        ...state,
        identities: action.identities,
        blockchainTotalStake: action.blockchainTotalStake,
      };
    }
    case 'setShards': {
      return {
        ...state,
        shards: action.shards,
      };
    }
    case 'setBrandData': {
      const { brandData } = action;
      return {
        ...state,
        brandData,
      };
    }
    case 'cancelAllRequests': {
      const cancelToken = axios.CancelToken.source();
      cancelToken.cancel();
      return {
        ...state,
        cancelToken,
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
    default: {
      throw new Error(`Unhandled action type: ${action!.type}`);
    }
  }
}
