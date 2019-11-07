import initialState, { StateType } from './state';

export type ActionType =
  | { type: 'changeTestnet'; testnetId: string }
  | { type: 'triggerNewRound' }
  | {
      type: 'setNewRoundIntervalId';
      intervalId: ReturnType<typeof setInterval>;
      testnetId: string;
    };

export function globalReducer(state: StateType = initialState, action: ActionType): StateType {
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
        rounds: {
          ...state.rounds,
          timestamp: Date.now(),
        },
      };
    }
    case 'setNewRoundIntervalId': {
      const { intervalId, testnetId } = action;
      return {
        ...state,
        rounds: {
          ...state.rounds,
          intervalId,
          testnetId,
        },
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action!.type}`);
    }
  }
}
