import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import {
  TransactionSliceType,
  TransactionType,
  UITransactionType
} from 'types';
import { getInitialTransactionsState } from './transactions';

export const customTransfersSlice = createSlice({
  name: 'customTransfersSlice',
  initialState: getInitialTransactionsState(),
  reducers: {
    setCustomTransfers: (
      state: TransactionSliceType,
      action: PayloadAction<TransactionSliceType & { size: number }>
    ) => {
      const existing = state.transactions;
      const incoming = action.payload.transactions;

      const existingSet = new Set(existing.map((tx) => tx.txHash));
      const updated = new Map<string, UITransactionType>();
      const result: UITransactionType[] = [];

      console.log(
        '------existing',
        existing.map((ex) => ex.txHash)
      );

      for (const tx of existing) updated.set(tx.txHash, tx);
      for (const tx of incoming) updated.set(tx.txHash, { ...tx, isNew: true });

      console.log(
        '------incoming',
        incoming.map((ex) => ex.txHash)
      );

      for (const tx of incoming) {
        if (!existingSet.has(tx.txHash)) {
          result.push(updated.get(tx.txHash)!);
        }
      }

      for (const tx of existing) {
        result.push(updated.get(tx.txHash)!);
      }

      console.log(
        '------result',
        result.map((ex) => ex.txHash)
      );

      state.transactions = result.slice(0, action.payload.size);

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
