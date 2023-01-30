import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountSliceType } from 'types/account.types';

export const getInitialAccountState = (): AccountSliceType => {
  return {
    account: {
      address: '',
      balance: '',
      nonce: 0,
      txCount: 0,
      scrCount: 0,
      claimableRewards: ''
    },
    isFetched: false
  };
};

export const accountSlice = createSlice({
  name: 'accountSlice',
  initialState: getInitialAccountState(),
  reducers: {
    setAccount: (
      state: AccountSliceType,
      action: PayloadAction<AccountSliceType>
    ) => {
      state.account = {
        ...getInitialAccountState().account,
        ...action.payload
      };
    }
  }
});

export const { setAccount } = accountSlice.actions;

export const accountReducer = accountSlice.reducer;
