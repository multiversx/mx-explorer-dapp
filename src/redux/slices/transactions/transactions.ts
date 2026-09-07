import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { TransactionSliceType } from 'types';

export const getInitialTransactionsState = (): TransactionSliceType => {
  return {
    transactions: [],
    transactionsCount: ELLIPSIS,
    isDataReady: undefined,
    isRefreshPaused: false,
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
      const previousByHash = new Map(
        state.transactions.map((transaction) => [
          transaction.txHash,
          transaction
        ])
      );
      const newTransactions = action.payload.transactions.map((transaction) => {
        const previous = previousByHash.get(transaction.txHash);
        const next = { ...transaction, isNew: !previous };

        return previous && JSON.stringify(previous) === JSON.stringify(next)
          ? previous
          : next;
      });

      const isUnchanged =
        newTransactions.length === state.transactions.length &&
        newTransactions.every(
          (transaction, index) => transaction === state.transactions[index]
        );

      if (!isUnchanged) {
        state.transactions = newTransactions;
      }

      if (action.payload.transactionsCount !== ELLIPSIS) {
        state.transactionsCount = action.payload.transactionsCount;
      }

      state.isDataReady = action.payload.isDataReady;
      state.isWebsocket = action.payload.isWebsocket;
    },
    pauseTxRefresh: (state: TransactionSliceType) => {
      state.isRefreshPaused = true;
    },
    resumeTxRefresh: (state: TransactionSliceType) => {
      state.isRefreshPaused = false;
    }
  }
});

export const { setTransactions, pauseTxRefresh, resumeTxRefresh } =
  transactionsSlice.actions;

export const transactionsReducer = transactionsSlice.reducer;
