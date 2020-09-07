import React from 'react';
import Map from './Map';
import { getMarkers, getLeaders } from './helpers/asyncRequests';
import { useGlobalState } from 'context';
import { MarkerPoint, processMarkers } from './helpers/processing';

const MapChart = () => {
  const [markers, setMarkers] = React.useState<MarkerPoint[]>([]);
  const [leaders, setLeaders] = React.useState<MarkerPoint[]>([]);

  const {
    timeout,
    activeNetwork: { nrOfShards },
    refresh: { timestamp },
    config: { metaChainShardId, explorerApi },
  } = useGlobalState();

  const shardsArray = [...Array.from(Array(nrOfShards).keys()), metaChainShardId];

  const fetchMarkers = () => {
    getMarkers({ timeout, explorerApi }).then(({ data }) => {
      const markersArray = processMarkers(data);
      setMarkers(markersArray as MarkerPoint[]);
    });
    fetchLeaders();
  };
  React.useEffect(fetchMarkers, []);

  const fetchLeaders = () => {
    if (markers.length > 0) {
      getLeaders({ timeout, explorerApi, shardsArray }).then((leadersArray) => {
        const publicKeys = leadersArray.map((l) => l.proposer);
        const leaderMarkers = markers.filter((marker) => publicKeys.includes(marker.publicKey));

        const offsets: { publicKey: string; name: string; offset: number }[] = [];
        leaderMarkers.forEach((leader) => {
          const occurences = offsets.map((offset) => offset.name).filter((p) => p === leader.name);

          offsets.push({
            name: leader.name,
            publicKey: leader.publicKey,
            offset: occurences.length > 0 ? -occurences.length - 3 : 0,
          });
        });

        const shardLeaders = leaderMarkers.map((leader) => {
          const { shard } = leadersArray.find((l) => l.proposer === leader.publicKey) || {};
          return {
            ...leader,
            shard,
            offset: offsets.find((o) => o.publicKey === leader.publicKey)!.offset || 0,
          };
        });

        if (setLeaders.length < 3) {
          const distinctShards = shardLeaders
            .map((l) => l.shard)
            .filter((value, index, self) => self.indexOf(value) === index);
          setLeaders((currentLeaders) => [
            ...currentLeaders.filter((l) => !distinctShards.includes(l.shard)),
            ...shardLeaders,
          ]);
        } else {
          setLeaders(shardLeaders);
        }
      });
    }
  };

  React.useEffect(fetchLeaders, [timestamp, markers]);

  return (
    <Map
      markers={markers}
      shardsArray={shardsArray}
      leaders={leaders}
      metaChainShardId={metaChainShardId}
    />
  );
};

export default MapChart;
