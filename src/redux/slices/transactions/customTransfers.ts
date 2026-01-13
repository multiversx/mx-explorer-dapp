import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { TransactionSliceType } from 'types';
import { getInitialTransactionsState } from './transactions';

export const customTransfersSlice = createSlice({
  name: 'customTransfersSlice',
  initialState: getInitialTransactionsState(),
  reducers: {
    setCustomTransfers: (
      state: TransactionSliceType,
      action: PayloadAction<TransactionSliceType>
    ) => {
      const existingHashes = state.transactions.map((b) => b.txHash);
      const newCustomTransfers = action.payload.transactions.map(
        (transfer) => ({
          ...transfer,
          isNew: !existingHashes.includes(transfer.txHash)
        })
      );

      state.transactions = newCustomTransfers;

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
