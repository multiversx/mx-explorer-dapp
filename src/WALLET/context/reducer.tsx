import initialState, { StateType } from './state';

export type ActionType = { type: 'changeUser'; userId: string };

export function globalReducer(state: StateType = initialState, action: ActionType): StateType {
  switch (action.type) {
    case 'changeUser': {
      const { userId } = action;
      // once activeTestnetId is populated, routes get prepended by testnetId
      return { ...state, userId };
    }
    default: {
      throw new Error(`Unhandled action type: ${action!.type}`);
    }
  }
}
