import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MAX_CACHED_TRANSACTION_DETAILS } from 'appConstants';
import {
  TransactionOverviewSliceType,
  TransactionOverviewAddSliceType
} from 'types/transaction.types';

export const getInitialTransactionOverviewState =
  (): TransactionOverviewSliceType => {
    return {
      transactionsDetails: {},
      isDataReady: undefined
    };
  };

export const transactionOverviewSlice = createSlice({
  name: 'transactionOverviewSlice',
  initialState: getInitialTransactionOverviewState(),
  reducers: {
    addTransactionDetails: (
      state: TransactionOverviewSliceType,
      action: PayloadAction<TransactionOverviewAddSliceType>
    ) => {
      const { txHash } = action.payload.transactionDetails;
      const transactionsDetails = state.transactionsDetails ?? {};

      delete transactionsDetails[txHash];
      transactionsDetails[txHash] = action.payload.transactionDetails;

      const keys = Object.keys(transactionsDetails);
      if (keys.length > MAX_CACHED_TRANSACTION_DETAILS) {
        keys
          .slice(0, keys.length - MAX_CACHED_TRANSACTION_DETAILS)
          .forEach((key) => delete transactionsDetails[key]);
      }

      state.transactionsDetails = transactionsDetails;
    }
  }
});

export const { addTransactionDetails } = transactionOverviewSlice.actions;

export const transactionOverviewReducer = transactionOverviewSlice.reducer;
