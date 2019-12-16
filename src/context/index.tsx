import * as React from 'react';
import { ActionType, globalReducer } from './reducer';
import initialState, { StateType } from './state';

type DispatchType = (action: ActionType) => void;
interface GlobalContextProviderProps {
  children: React.ReactNode;
}

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
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }
  return context;
}

function useGlobalDispatch() {
  const context = React.useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error('useGlobalDispatch must be used within a GlobalProvider');
  }
  return context;
}

export { GlobalProvider, useGlobalState, useGlobalDispatch };
