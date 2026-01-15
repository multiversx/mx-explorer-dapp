import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS, PAGE_SIZE } from 'appConstants';
import { processListUpdates } from 'helpers';
import { CustomTransactionSliceType, TransactionSliceType } from 'types';
import { getInitialTransactionsState } from './transactions';

export const getInitialCustomTransactionsState =
  (): CustomTransactionSliceType => {
    return {
      ...getInitialTransactionsState(),
      uuid: undefined,
      size: PAGE_SIZE
    };
  };

export const customTransactionsSlice = createSlice({
  name: 'customTransactionsSlice',
  initialState: getInitialCustomTransactionsState(),
  reducers: {
    setCustomTransactions: (
      state: CustomTransactionSliceType,
      action: PayloadAction<CustomTransactionSliceType>
    ) => {
      if (state.uuid && state.uuid !== action.payload.uuid) {
        state.transactions = [];
        state.transactionsCount = ELLIPSIS;
      }

      const existing = state.transactions;
      const incoming = action.payload.transactions;

      const trimmedTransactions = processListUpdates({
        existing,
        incoming,
        uniqueKey: 'txHash',
        size: action.payload.size
      });

      state.uuid = action.payload.uuid;
      state.transactions = trimmedTransactions;

      if (action.payload.transactionsCount !== ELLIPSIS) {
        state.transactionsCount = action.payload.transactionsCount;
      }

      state.isDataReady = action.payload.isDataReady;
      state.isWebsocket = action.payload.isWebsocket;
    },
    pauseCustomTransactionsRefresh: (state: TransactionSliceType) => {
      state.isRefreshPaused = true;
    },
    resumeCustomTransactionsRefresh: (state: TransactionSliceType) => {
      state.isRefreshPaused = false;
    }
  }
});

export const {
  setCustomTransactions,
  pauseCustomTransactionsRefresh,
  resumeCustomTransactionsRefresh
} = customTransactionsSlice.actions;

export const customTransactionsReducer = customTransactionsSlice.reducer;
