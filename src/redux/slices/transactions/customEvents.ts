import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { EventsSliceType, UIEventType } from 'types';
import { getInitialEventsState } from './events';

export const customEventsSlice = createSlice({
  name: 'customEventsSlice',
  initialState: getInitialEventsState(),
  reducers: {
    setCustomEvents: (
      state: EventsSliceType,
      action: PayloadAction<EventsSliceType>
    ) => {
      const existingHashes = state.events.map(
        (event: UIEventType) => event.txHash
      );
      const newEvents = action.payload.events.map((event: UIEventType) => ({
        ...event,
        isNew: !existingHashes.includes(event.txHash)
      }));

      state.events = newEvents;

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
