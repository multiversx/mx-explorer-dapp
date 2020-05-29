import { StateType } from './state';

export type ActionType =
  | { type: 'changeTestnet'; testnetId: string }
  | { type: 'setValidatorData'; validatorData: StateType['validatorData'] }
  | { type: 'setBrandData'; brandData: StateType['brandData'] }
  | { type: 'triggerNewRound' }
  | {
      type: 'setNewRoundIntervalId';
      intervalId: ReturnType<typeof setInterval>;
      testnetId: string;
    };

export function globalReducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'changeTestnet': {
      const newTestnet = state.config.testnets.filter(testnet => testnet.id === action.testnetId);
      const activeTestnet = [...newTestnet].pop() || state.defaultTestnet;
      // once activeTestnetId is populated, routes get prepended by testnetId
      return { ...state, activeTestnet, activeTestnetId: action.testnetId };
    }
    case 'triggerNewRound': {
      return {
        ...state,
        refresh: {
          ...state.refresh,
          timestamp: Date.now(),
        },
      };
    }
    case 'setNewRoundIntervalId': {
      const { intervalId, testnetId } = action;
      return {
        ...state,
        refresh: {
          ...state.refresh,
          intervalId,
          testnetId,
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
    default: {
      throw new Error(`Unhandled action type: ${action!.type}`);
    }
  }
}
