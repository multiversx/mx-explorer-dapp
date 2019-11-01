import initialState, { StateType } from './state';

export type ActionType = { type: 'changeTestnet'; testnetId: string } | { type: 'decrement' };

export function globalReducer(state: StateType = initialState, action: ActionType): StateType {
  switch (action.type) {
    case 'changeTestnet': {
      const newTestnet = state.config.testnets.filter(testnet => testnet.id === action.testnetId);
      const activeTestnet = [...newTestnet].pop() || state.defaultTestnet;
      // once activeTestnetId is populated, routes get prepended by testnetId
      return { ...state, activeTestnet, activeTestnetId: action.testnetId };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
