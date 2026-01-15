import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS, PAGE_SIZE } from 'appConstants';
import { processListUpdates } from 'helpers';
import { CustomTransfersSliceType, TransactionSliceType } from 'types';
import { getInitialTransactionsState } from './transactions';

export const getInitialCustomTransfersState = (): CustomTransfersSliceType => {
  return {
    ...getInitialTransactionsState(),
    uuid: undefined,
    size: PAGE_SIZE
  };
};

export const customTransfersSlice = createSlice({
  name: 'customTransfersSlice',
  initialState: getInitialCustomTransfersState(),
  reducers: {
    setCustomTransfers: (
      state: CustomTransfersSliceType,
      action: PayloadAction<CustomTransfersSliceType>
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
    pauseCustomTransferRefresh: (state: TransactionSliceType) => {
      state.isRefreshPaused = true;
    },
    resumeCustomTtransferRefresh: (state: TransactionSliceType) => {
      state.isRefreshPaused = false;
    }
  }
});

export const {
  setCustomTransfers,
  pauseCustomTransferRefresh,
  resumeCustomTtransferRefresh
} = customTransfersSlice.actions;

export const customTransfersReducer = customTransfersSlice.reducer;
