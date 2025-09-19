import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountExtraSliceType } from 'types/account.types';

export const getInitialAccountExtraState = (): AccountExtraSliceType => {
  return {
    accountExtra: {
      address: '',
      firstTransactionDate: undefined,
      tokenBalance: undefined
    },
    isDataReady: false
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
      state.accountExtra.address = action.payload.accountExtra.address;
      state.accountExtra.firstTransactionDate =
        action.payload.accountExtra.firstTransactionDate;
      state.accountExtra.tokenBalance =
        action.payload.accountExtra.tokenBalance;

      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setAccountExtra } = accountExtraSlice.actions;

export const accountExtraReducer = accountExtraSlice.reducer;
