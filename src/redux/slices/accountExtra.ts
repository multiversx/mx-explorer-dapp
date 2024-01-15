import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountExtraSliceType } from 'types/account.types';

export const getInitialAccountExtraState = (): AccountExtraSliceType => {
  return {
    accountExtra: {
      firstTransactionDate: undefined,
      tokenBalance: undefined
    },
    isFetched: false
  };
};

export const accountExtraSlice = createSlice({
  name: 'accountExtraSlice',
  initialState: getInitialAccountExtraState(),
  reducers: {
    setAccountExtra: (
      state: AccountExtraSliceType,
      action: PayloadAction<AccountExtraSliceType>
    ) => {
      state.accountExtra.firstTransactionDate =
        action.payload.accountExtra.firstTransactionDate;
      state.accountExtra.tokenBalance =
        action.payload.accountExtra.tokenBalance;

      state.isFetched = action.payload.isFetched;
    }
  }
});

export const { setAccountExtra } = accountExtraSlice.actions;

export const accountExtraReducer = accountExtraSlice.reducer;
