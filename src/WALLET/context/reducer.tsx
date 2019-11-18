import initialState, { StateType } from './state';

export type ActionType =
  | { type: 'login'; privateKey: string; publicKey: string }
  | { type: 'logout' }
  | { type: 'setBalance'; balance: string }
  | { type: 'setNonce'; nonce: string };

export function globalReducer(state: StateType = initialState, action: ActionType): StateType {
  switch (action.type) {
    case 'login': {
      const { privateKey, publicKey } = action;
      return { ...state, privateKey, publicKey, loggedIn: true };
    }
    case 'logout': {
      return initialState;
    }
    case 'setBalance': {
      const { balance } = action;
      return { ...state, balance };
    }
    case 'setNonce': {
      const { nonce } = action;
      return { ...state, nonce };
    }
    default: {
      throw new Error(`Unhandled action type: ${action!.type}`);
    }
  }
}
