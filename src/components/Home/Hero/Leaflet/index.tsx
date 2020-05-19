import React from 'react';
import Map from './Map';
import { getMarkers, MarkerType, getLeaders } from './helpers/asyncRequests';
import { useGlobalState } from 'context';
import { MarkerPoint, processMarkers } from './helpers/processing';

const MapChart = () => {
  const [markers, setMarkers] = React.useState<MarkerPoint[]>([]);
  const [leaders, setLeaders] = React.useState<MarkerPoint[]>([]);
  const { timeout } = useGlobalState();
  const fetchMarkers = () => {
    getMarkers({ timeout }).then((data: any) => {
      const markersArray = processMarkers(data);
      setMarkers(markersArray as MarkerPoint[]);
    });
    getLeaders({ timeout }).then(leaders => {
      const leadersArray = processMarkers(leaders);
      setLeaders(leadersArray as MarkerPoint[]);
    });
  };
  React.useEffect(fetchMarkers, []);
  return <Map markers={markers} leaders={leaders} />;
};

export default MapChart;
