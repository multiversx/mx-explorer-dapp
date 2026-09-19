import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarkersSliceType } from 'types/markers.types';

export const getInitialMarkersState = (): MarkersSliceType => {
  return {
    isDataReady: false,
    markers: []
  };
};

export const markersSlice = createSlice({
  name: 'markersSlice',
  initialState: getInitialMarkersState(),
  reducers: {
    setMarkers: (
      state: MarkersSliceType,
      action: PayloadAction<MarkersSliceType>
    ) => {
      state.isDataReady = action.payload.isDataReady;
      state.markers = action.payload.markers;
    }
  }
});

export const { setMarkers } = markersSlice.actions;

export const markersReducer = markersSlice.reducer;
