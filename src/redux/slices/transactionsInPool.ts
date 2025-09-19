import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { TransactionInPoolSliceType } from 'types';

export const getInitialTransactionsInPoolState =
  (): TransactionInPoolSliceType => {
    return {
      transactionsInPool: [],
      transactionsInPoolCount: ELLIPSIS,
      isDataReady: undefined,
      isWebsocket: false
    };
  };

export const transactionsInPoolSlice = createSlice({
  name: 'transactionsInPoolSlice',
  initialState: getInitialTransactionsInPoolState(),
  reducers: {
    setTransactionsInPool: (
      state: TransactionInPoolSliceType,
      action: PayloadAction<TransactionInPoolSliceType>
    ) => {
      const existingHashes = state.transactionsInPool.map((b) => b.txHash);
      const newTransactionsInPools = action.payload.transactionsInPool.map(
        (transactionsInPool) => ({
          ...transactionsInPool,
          isNew: !existingHashes.includes(transactionsInPool.txHash)
        })
      );

      state.transactionsInPool = newTransactionsInPools;

      if (action.payload.transactionsInPoolCount !== ELLIPSIS) {
        state.transactionsInPoolCount = action.payload.transactionsInPoolCount;
      }

      state.isDataReady = action.payload.isDataReady;
      state.isWebsocket = action.payload.isWebsocket;
    }
  }
});

export const { setTransactionsInPool } = transactionsInPoolSlice.actions;

export const transactionsInPoolReducer = transactionsInPoolSlice.reducer;
