import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
      state.transactionsDetails = {
        ...state.transactionsDetails,
        [action.payload.transactionDetails.txHash]:
          action.payload.transactionDetails
      };
    }
  }
});

export const { addTransactionDetails } = transactionOverviewSlice.actions;

export const transactionOverviewReducer = transactionOverviewSlice.reducer;
