import * as React from 'react';
import { useReducer } from 'reinspect';
import { ActionType, globalReducer } from './reducer';
import initialState, { StateType, ConfigType } from './state';

type DispatchType = (action: ActionType) => void;
export interface GlobalContextProviderType {
  children: React.ReactNode;
  optionalConfig?: ConfigType;
}

const GlobalStateContext = React.createContext<StateType | undefined>(undefined);
const GlobalDispatchContext = React.createContext<DispatchType | undefined>(undefined);

function GlobalProvider({ children, optionalConfig }: GlobalContextProviderType) {
  // const [state, dispatch] = React.useReducer(globalReducer, initialState(config, optionalConfig));

  const [prodState, prodDispatch] = React.useReducer(globalReducer, initialState(optionalConfig));

  const [devState, devDispatch] = useReducer(globalReducer, initialState(optionalConfig), 'global');

  const state = process.env.NODE_ENV === 'development' ? devState : prodState;
  const dispatch = process.env.NODE_ENV === 'development' ? devDispatch : prodDispatch;

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
