import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { TransactionSliceType } from 'types';
import { getInitialTransactionsState } from './transactions';

export const customTransactionsSlice = createSlice({
  name: 'customTransactionsSlice',
  initialState: getInitialTransactionsState(),
  reducers: {
    setCustomTransactions: (
      state: TransactionSliceType,
      action: PayloadAction<TransactionSliceType>
    ) => {
      const existingHashes = state.transactions.map((b) => b.txHash);
      const newCustomTransactions = action.payload.transactions.map(
        (transaction) => ({
          ...transaction,
          isNew: !existingHashes.includes(transaction.txHash)
        })
      );

      state.transactions = newCustomTransactions;

      if (action.payload.transactionsCount !== ELLIPSIS) {
        state.transactionsCount = action.payload.transactionsCount;
      }

      state.isDataReady = action.payload.isDataReady;
      state.isWebsocket = action.payload.isWebsocket;
    },
    pauseCustomTxRefresh: (state: TransactionSliceType) => {
      state.isRefreshPaused = true;
    },
    resumeCustomTxRefresh: (state: TransactionSliceType) => {
      state.isRefreshPaused = false;
    }
  }
});

export const {
  setCustomTransactions,
  pauseCustomTxRefresh,
  resumeCustomTxRefresh
} = customTransactionsSlice.actions;

export const customTransactionsReducer = customTransactionsSlice.reducer;
