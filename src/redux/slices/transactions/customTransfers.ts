import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS, PAGE_SIZE } from 'appConstants';
import {
  CustomTransfersSliceType,
  TransactionSliceType,
  UITransactionType
} from 'types';
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

      const existingSet = new Set(existing.map((tx) => tx.txHash));
      const updated = new Map<string, UITransactionType>();
      const result: UITransactionType[] = [];

      console.info(
        '------existing',
        existing.map((ex) => ex.txHash)
      );

      for (const tx of existing) updated.set(tx.txHash, tx);
      for (const tx of incoming) updated.set(tx.txHash, { ...tx, isNew: true });

      console.info(
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

      const trimmedTransactions = result.slice(0, action.payload.size);
      console.info(
        '------result',
        trimmedTransactions.map((ex) => ex.txHash)
      );

      state.transactions = trimmedTransactions;

      if (action.payload.transactionsCount !== ELLIPSIS) {
        state.transactionsCount = action.payload.transactionsCount;
      }

      state.isDataReady = action.payload.isDataReady;
      state.isWebsocket = action.payload.isWebsocket;
      state.uuid = action.payload.uuid;
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
