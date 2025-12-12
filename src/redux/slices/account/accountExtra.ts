import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountExtraSliceType } from 'types/account.types';

export const getInitialAccountExtraState = (): AccountExtraSliceType => {
  return {
    accountExtra: {
      address: '',
      accountTransactions: [],
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
      state.accountExtra.accountTransactions =
        action.payload.accountExtra.accountTransactions;

      state.isDataReady = action.payload.isDataReady;
    },
    setAccountExtraTransactions: (
      state: AccountExtraSliceType,
      action: PayloadAction<
        AccountExtraSliceType['accountExtra']['accountTransactions']
      >
    ) => {
      state.accountExtra.accountTransactions = action.payload;
    }
  }
});

export const { setAccountExtra, setAccountExtraTransactions } =
  accountExtraSlice.actions;

export const accountExtraReducer = accountExtraSlice.reducer;
