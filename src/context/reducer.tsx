import initialState, { StateType, defaultTestnet } from './state';

export type ActionType = { type: 'changeTestnet'; testnetId: string } | { type: 'decrement' };

export function globalReducer(state: StateType = initialState, action: ActionType): StateType {
  switch (action.type) {
    case 'changeTestnet': {
      const newTestnet = state.config.testnets.filter(testnet => testnet.id === action.testnetId);
      const activeTestnet = [...newTestnet].pop() || defaultTestnet;
      return { ...state, activeTestnet };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
