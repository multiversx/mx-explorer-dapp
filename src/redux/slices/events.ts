import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { EventsSliceType, UIEventType } from 'types';

export const getInitialEventsState = (): EventsSliceType => {
  return {
    events: [],
    eventsCount: ELLIPSIS,
    isDataReady: undefined,
    isRefreshPaused: false,
    isWebsocket: false
  };
};

export const eventsSlice = createSlice({
  name: 'eventsSlice',
  initialState: getInitialEventsState(),
  reducers: {
    setEvents: (
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
    pauseRefresh: (state: EventsSliceType) => {
      state.isRefreshPaused = true;
    },
    resumeRefresh: (state: EventsSliceType) => {
      state.isRefreshPaused = false;
    }
  }
});

export const { setEvents, pauseRefresh, resumeRefresh } = eventsSlice.actions;

export const eventsReducer = eventsSlice.reducer;
