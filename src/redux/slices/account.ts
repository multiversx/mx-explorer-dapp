import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountSliceType } from 'types/account.types';

export const getInitialAccountState = (): AccountSliceType => {
  return {
    address: '',
    balance: '',
    nonce: 0,
    txCount: 0,
    scrCount: 0,
    claimableRewards: '',

    accountFetched: false,
  };
};

export const accountSlice = createSlice({
  name: 'accountSlice',
  initialState: getInitialAccountState(),
  reducers: {
    setAccount: (state: AccountSliceType, action: PayloadAction<AccountSliceType>) => {
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

      state.accountFetched = action.payload.accountFetched;
    },
  },
});

export const { setAccount } = accountSlice.actions;

export const accountReducer = accountSlice.reducer;
