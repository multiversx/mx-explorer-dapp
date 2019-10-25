import * as React from 'react';

type Action = { type: 'change' } | { type: 'decrement' };
type Dispatch = (action: Action) => void;
type State = { elasticUrl: string };
type CountProviderProps = { children: React.ReactNode };

const CountStateContext = React.createContext<State | undefined>(undefined);
const CountDispatchContext = React.createContext<Dispatch | undefined>(undefined);

function countReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'change': {
      return { elasticUrl: state.elasticUrl };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function CountProvider({ children }: CountProviderProps) {
  const [state, dispatch] = React.useReducer(countReducer, {
    elasticUrl: 'https://elastic-aws.elrond.com',
  });
  return (
    <CountStateContext.Provider value={state}>
      <CountDispatchContext.Provider value={dispatch}>{children}</CountDispatchContext.Provider>
    </CountStateContext.Provider>
  );
}

function useCountState() {
  const context = React.useContext(CountStateContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  return context;
}

function useCountDispatch() {
  const context = React.useContext(CountDispatchContext);
  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a CountProvider');
  }
  return context;
}

export { CountProvider, useCountState, useCountDispatch };
