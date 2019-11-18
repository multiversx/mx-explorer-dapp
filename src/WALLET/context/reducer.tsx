import initialState, { StateType } from './state';

export type ActionType =
  | { type: 'login'; privateKey: string; publicKey: string }
  | { type: 'logout' };

export function globalReducer(state: StateType = initialState, action: ActionType): StateType {
  switch (action.type) {
    case 'login': {
      const { privateKey, publicKey } = action;
      return { ...state, privateKey, publicKey, loggedIn: true };
    }
    case 'logout': {
      return initialState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action!.type}`);
    }
  }
}
