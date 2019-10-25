export type ActionType = { type: 'increment' } | { type: 'decrement' };
export type StateType = { count: number };

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case 'increment': {
      return { count: state.count + 1 };
    }
    case 'decrement': {
      return { count: state.count - 1 };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export { reducer };
