import * as React from 'react';
import initialState, { StateType } from './state';
import { globalReducer, ActionType } from './reducer';

type DispatchType = (action: ActionType) => void;
type WalletContextProviderProps = { children: React.ReactNode };

const WalletStateContext = React.createContext<StateType | undefined>(undefined);
const WalletDispatchContext = React.createContext<DispatchType | undefined>(undefined);

function WalletProvider({ children }: WalletContextProviderProps) {
  const [state, dispatch] = React.useReducer(globalReducer, initialState);
  return (
    <WalletStateContext.Provider value={state}>
      <WalletDispatchContext.Provider value={dispatch}>{children}</WalletDispatchContext.Provider>
    </WalletStateContext.Provider>
  );
}

function useWalletState() {
  const context = React.useContext(WalletStateContext);
  if (context === undefined) {
    throw new Error('useWalletState must be used within a WalletProvider');
  }
  return context;
}

function useWalletDispatch() {
  const context = React.useContext(WalletDispatchContext);
  if (context === undefined) {
    throw new Error('useWalletDispatch must be used within a WalletProvider');
  }
  return context;
}

export { WalletProvider, useWalletState, useWalletDispatch };
