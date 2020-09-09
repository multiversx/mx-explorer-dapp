import axios from 'axios';
import { StateType, ConfigType } from './state';

export type ActionType =
  | { type: 'changeNetwork'; networkId: string }
  | {
      type: 'updateNetworks';
      config: ConfigType;
    }
  | { type: 'setValidatorData'; validatorData: StateType['validatorData'] }
  | { type: 'setBrandData'; brandData: StateType['brandData'] }
  | { type: 'triggerNewRound' }
  | { type: 'cancelAllRequests' };

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
    default: {
      throw new Error(`Unhandled action type: ${action!.type}`);
    }
  }
}
