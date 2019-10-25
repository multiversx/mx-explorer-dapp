import * as React from 'react';

type ActionType = { type: 'change' } | { type: 'decrement' };
type DispatchType = (action: ActionType) => void;
type StateType = { elasticUrl: string };
type GlobalContextProviderProps = { children: React.ReactNode };

const GlobalStateContext = React.createContext<StateType | undefined>(undefined);
const GlobalDispatchContext = React.createContext<DispatchType | undefined>(undefined);

const initialState: StateType = {
  elasticUrl: 'https://elastic-aws.elrond.com',
};

function globalReducer(state: StateType = initialState, action: ActionType): StateType {
  switch (action.type) {
    case 'change': {
      return { elasticUrl: state.elasticUrl };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

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

function useGlobalDispatch() {
  const context = React.useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a CountProvider');
  }
  return context;
}

export { GlobalProvider, useGlobalState, useGlobalDispatch };
