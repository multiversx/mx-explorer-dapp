import React from 'react';
import Map from './Map';
import { getMarkers, MarkerType } from './helpers/asyncRequests';
import { useGlobalState } from 'context';
import { MarkerPoint } from './helpers/processing';

const MapChart = () => {
  const [markers, setMarkers] = React.useState<MarkerPoint[]>([]);
  const { timeout } = useGlobalState();
  const fetchMarkers = () => {
    getMarkers({ timeout }).then((data: any) => {
      const locationsArray: MarkerType[] = Object.keys(data).map(id => data[id]);
      const markersArray = locationsArray
        .map(loc => {
          const lat = parseFloat(loc.loc.split(',')[0]);
          const lon = parseFloat(loc.loc.split(',')[1]);
          if (!isNaN(lat) && !isNaN(lon)) {
            return {
              name: loc.city,
              lat,
              lon,
              markerOffset: 0,
              ip: loc.ip,
            };
          }
          return null;
        })
        .filter(Boolean);

      setMarkers(markersArray as MarkerPoint[]);
    });
  };
  React.useEffect(fetchMarkers, []);
  return <Map markers={markers} />;
};

export default MapChart;
