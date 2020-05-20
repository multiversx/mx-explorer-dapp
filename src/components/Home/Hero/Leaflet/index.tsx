import React from 'react';
import Map from './Map';
import { getMarkers, getShardLeader } from './helpers/asyncRequests';
import { useGlobalState } from 'context';
import { MarkerPoint, processMarkers } from './helpers/processing';

const MapChart = () => {
  const [markers, setMarkers] = React.useState<MarkerPoint[]>([]);
  const [leaders, setLeaders] = React.useState<MarkerPoint[]>([]);

  const {
    timeout,
    activeTestnet: { nodeUrl, elasticUrl },
    refresh: { timestamp },
    config: { metaChainShardId },
  } = useGlobalState();

  const fetchMarkers = () => {
    getMarkers({ timeout }).then((data: any) => {
      const markersArray = processMarkers(data);
      setMarkers(markersArray as MarkerPoint[]);
    });
    getLeaders();
  };
  React.useEffect(fetchMarkers, []);

  const getLeaders = () => {
    Promise.all([
      getShardLeader({ timeout, nodeUrl, elasticUrl, shardNumber: 1 }),
      getShardLeader({ timeout, nodeUrl, elasticUrl, shardNumber: 2 }),
      getShardLeader({ timeout, nodeUrl, elasticUrl, shardNumber: metaChainShardId }),
    ]).then(leadersArray => {
      const publicKeys = leadersArray.map(l => l.proposer);
      const leaderMarkers = markers.filter(marker => publicKeys.includes(marker.publicKey));
      const shardLeaders = leaderMarkers.map(leader => {
        const { shard } = leadersArray.find(l => l.proposer === leader.publicKey) || {};
        return {
          ...leader,
          shard,
        };
      });

      setLeaders(shardLeaders);
    });
  };

  React.useEffect(getLeaders, [timestamp, markers]);

  return <Map markers={markers} leaders={leaders} metaChainShardId={metaChainShardId} />;
};

export default MapChart;
