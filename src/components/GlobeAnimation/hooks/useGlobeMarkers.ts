import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { markersSelector } from 'redux/selectors';
import { MarkerType } from 'types';
import { FALLBACK_MARKERS } from '../helpers/fallbackMarkers';

const isValidMarker = (marker: MarkerType) =>
  Number.isFinite(marker.latitude) && Number.isFinite(marker.longitude);

export const useGlobeMarkers = () => {
  const { markers, isDataReady } = useSelector(markersSelector);

  return useMemo(() => {
    const validMarkers = isDataReady ? markers.filter(isValidMarker) : [];

    return validMarkers.length > 0 ? validMarkers : FALLBACK_MARKERS;
  }, [markers, isDataReady]);
};
