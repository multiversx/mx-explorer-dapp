import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { processListUpdates } from 'helpers';
import { CustomEventsSliceType, EventsSliceType } from 'types';
import { getInitialEventsState } from './events';

export const getInitialCustomEventsState = (): CustomEventsSliceType => {
  return {
    ...getInitialEventsState(),
    uuid: undefined
  };
};

export const customEventsSlice = createSlice({
  name: 'customEventsSlice',
  initialState: getInitialCustomEventsState(),
  reducers: {
    setCustomEvents: (
      state: CustomEventsSliceType,
      action: PayloadAction<CustomEventsSliceType & { size: number }>
    ) => {
      if (state.uuid && state.uuid !== action.payload.uuid) {
        state.events = [];
        state.eventsCount = ELLIPSIS;
      }

      const existing = state.events;
      const incoming = action.payload.events;

      const trimmedEvents = processListUpdates({
        existing,
        incoming,
        uniqueKey: 'txHash',
        size: action.payload.size
      });

      state.uuid = action.payload.uuid;
      state.events = trimmedEvents;

      if (action.payload.eventsCount !== ELLIPSIS) {
        state.eventsCount = action.payload.eventsCount;
      }

      state.isDataReady = action.payload.isDataReady;
      state.isWebsocket = action.payload.isWebsocket;
    },
    pauseCustomEventsRefresh: (state: EventsSliceType) => {
      state.isRefreshPaused = true;
    },
    resumeCustomEventsRefresh: (state: EventsSliceType) => {
      state.isRefreshPaused = false;
    }
  }
});

export const {
  setCustomEvents,
  pauseCustomEventsRefresh,
  resumeCustomEventsRefresh
} = customEventsSlice.actions;

export const customEventsReducer = customEventsSlice.reducer;
