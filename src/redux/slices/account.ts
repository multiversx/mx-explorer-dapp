import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountType } from 'types/account.types';

export const getInitialAccountState = (): AccountType => {
  return {
    address: '',
    balance: '',
    nonce: 0,
    txCount: 0,
    scrCount: 0,
    claimableRewards: '',
  };
};

export const accountSlice = createSlice({
  name: 'accountSlice',
  initialState: getInitialAccountState(),
  reducers: {
    setAccount: (state: AccountType, action: PayloadAction<AccountType>) => {
      state.address = action.payload.address;
      state.balance = action.payload.balance;
      state.nonce = action.payload.nonce;
      state.txCount = action.payload.txCount;
      state.scrCount = action.payload.scrCount;
      state.claimableRewards = action.payload.claimableRewards;
      state.code = action.payload.code;
      state.codeHash = action.payload.codeHash;
      state.shard = action.payload.shard;
      state.ownerAddress = action.payload.ownerAddress;
      state.developerReward = action.payload.developerReward;
      state.deployedAt = action.payload.deployedAt;
      state.scamInfo = action.payload.scamInfo;
      state.isUpgradeable = action.payload.isUpgradeable;
      state.isReadable = action.payload.isReadable;
      state.isPayable = action.payload.isPayable;
      state.isPayableBySmartContract = action.payload.isPayableBySmartContract;
      state.assets = action.payload.assets;
      state.username = action.payload.username;
    },
  },
});

export const { setAccount } = accountSlice.actions;

export const accountReducer = accountSlice.reducer;
