import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AccountExtraAnalyticsSliceType,
  AccountExtraSliceType
} from 'types/account.types';

export const getInitialAccountExtraState = (): AccountExtraSliceType => {
  return {
    accountExtra: {
      address: '',
      accountTransactions: [],
      accountTransactionsFetched: undefined,
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
      state.accountExtra.accountTransactionsFetched =
        action.payload.accountExtra.accountTransactionsFetched;
      state.accountExtra.accountTransactions =
        action.payload.accountExtra.accountTransactions;

      state.isDataReady = action.payload.isDataReady;
    },
    setAccountExtraTransactions: (
      state: AccountExtraSliceType,
      action: PayloadAction<AccountExtraAnalyticsSliceType>
    ) => {
      state.accountExtra.accountTransactions =
        action.payload.accountTransactions;
      state.accountExtra.accountTransactionsFetched =
        action.payload.accountTransactionsFetched;
    }
  }
});

export const { setAccountExtra, setAccountExtraTransactions } =
  accountExtraSlice.actions;

export const accountExtraReducer = accountExtraSlice.reducer;
