import * as React from 'react';
import { reducer, ActionType, StateType } from './reducer';

type DispatchType = (action: ActionType) => void;

type GlobalProviderProps = { children: React.ReactNode };

const GlobalStateContext = React.createContext<StateType | undefined>(undefined);
const GlobalDispatchContext = React.createContext<DispatchType | undefined>(undefined);

function GlobalContextProvider({ children }: GlobalProviderProps) {
  const [state, dispatch] = React.useReducer(reducer, { count: 2 });
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

export { GlobalContextProvider, useGlobalState, useGlobalDispatch };
