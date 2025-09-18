import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { TransactionSliceType } from 'types';

export const getInitialTransactionsState = (): TransactionSliceType => {
  return {
    transactions: [],
    transactionsCount: ELLIPSIS,
    isDataReady: undefined,
    isWebsocket: false
  };
};

export const transactionsSlice = createSlice({
  name: 'transactionsSlice',
  initialState: getInitialTransactionsState(),
  reducers: {
    setTransactions: (
      state: TransactionSliceType,
      action: PayloadAction<TransactionSliceType>
    ) => {
      const existingHashes = state.transactions.map((b) => b.txHash);
      const newTransactions = action.payload.transactions.map(
        (transaction) => ({
          ...transaction,
          isNew: !existingHashes.includes(transaction.txHash)
        })
      );
      state.transactions = newTransactions;
      state.transactionsCount = action.payload.transactionsCount;
      state.isDataReady = action.payload.isDataReady;
      state.isWebsocket = action.payload.isWebsocket;
    }
  }
});

export const { setTransactions } = transactionsSlice.actions;

export const transactionsReducer = transactionsSlice.reducer;
