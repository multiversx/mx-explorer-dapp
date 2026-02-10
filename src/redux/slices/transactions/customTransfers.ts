import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { processListUpdates } from 'helpers';
import { CustomTransactionSliceType, TransactionSliceType } from 'types';
import { getInitialTransactionsState } from './transactions';

export const getInitialCustomTransfersState =
  (): CustomTransactionSliceType => {
    return {
      ...getInitialTransactionsState(),
      uuid: undefined
    };
  };

export const customTransfersSlice = createSlice({
  name: 'customTransfersSlice',
  initialState: getInitialCustomTransfersState(),
  reducers: {
    setCustomTransfers: (
      state: CustomTransactionSliceType,
      action: PayloadAction<CustomTransactionSliceType & { size: number }>
    ) => {
      if (
        action.payload.clearExisting ||
        (state.uuid && state.uuid !== action.payload.uuid)
      ) {
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
    pauseCustomTransfersRefresh: (state: TransactionSliceType) => {
      state.isRefreshPaused = true;
    },
    resumeCustomTransfersRefresh: (state: TransactionSliceType) => {
      state.isRefreshPaused = false;
    }
  }
});

export const {
  setCustomTransfers,
  pauseCustomTransfersRefresh,
  resumeCustomTransfersRefresh
} = customTransfersSlice.actions;

export const customTransfersReducer = customTransfersSlice.reducer;
