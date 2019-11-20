import initialState, { StateType } from './state';
import localStorageDB from './../lib/localstorageDB';

export type ActionType =
  | { type: 'initSession' }
  | { type: 'login'; privateKey: string; publicKey: string }
  | { type: 'logout' }
  | { type: 'setBalance'; balance: string }
  | { type: 'setNonce'; nonce: number };

export function globalReducer(state: StateType = initialState, action: ActionType): StateType {
  switch (action.type) {
    case 'initSession': {
      localStorageDB.resetStorage();
      const storageState = localStorageDB.get('state');
      const state = storageState ? storageState : initialState;
      localStorageDB.save('state', state);
      return state;
    }
    case 'login': {
      const { privateKey, publicKey } = action;
      const newState = { ...state, privateKey, publicKey, loggedIn: true };
      localStorageDB.save('state', newState);
      return newState;
    }
    case 'logout': {
      localStorageDB.save('state', initialState);
      return initialState;
    }
    case 'setBalance': {
      const { balance } = action;
      const newState = { ...state, balance };
      localStorageDB.save('state', newState);
      return newState;
    }
    case 'setNonce': {
      const { nonce } = action;
      const newState = { ...state, nonce };
      localStorageDB.save('state', newState);
      return newState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action!.type}`);
    }
  }
}
