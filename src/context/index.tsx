import * as React from 'react';
import initialState, { StateType, defaultTestnet, TestnetType } from './state';
import { globalReducer, ActionType } from './reducer';

type DispatchType = (action: ActionType) => void;
type GlobalContextProviderProps = { children: React.ReactNode };

const GlobalStateContext = React.createContext<StateType | undefined>(undefined);
const GlobalDispatchContext = React.createContext<DispatchType | undefined>(undefined);

function GlobalProvider({ children }: GlobalContextProviderProps) {
  const [state, dispatch] = React.useReducer(globalReducer, initialState);
  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>{children}</GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
}

function useGlobalState() {
  const context = React.useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  return context;
}

function useCurrentTestnet(): TestnetType {
  const context = React.useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  const currentTestnetArray = context.config.testnets.filter(testnet => testnet.default);
  // pop() is mutating the array so we need to destructure it
  const currentTestnet = [...currentTestnetArray].pop();

  const testnet = currentTestnet && currentTestnetArray.length ? currentTestnet : defaultTestnet;

  return testnet;
}

function useGlobalDispatch() {
  const context = React.useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a CountProvider');
  }
  return context;
}

export { GlobalProvider, useGlobalState, useGlobalDispatch, useCurrentTestnet };
