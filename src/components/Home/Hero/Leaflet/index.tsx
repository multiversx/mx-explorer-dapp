import React from 'react';
import Map from './Map';
import { getMarkers, getLeaders } from './helpers/asyncRequests';
import { useGlobalState } from 'context';
import { MarkerPoint, processMarkers } from './helpers/processing';
import { nrOfShards, metaChainShardId, explorerApi } from 'appConfig';

const MapChart = () => {
  const [markers, setMarkers] = React.useState<MarkerPoint[]>([]);
  const [leaders, setLeaders] = React.useState<MarkerPoint[]>([]);
  const ref = React.useRef(null);

  const {
    timeout,
    refresh: { timestamp },
  } = useGlobalState();

  const shardsArray = [...Array.from(Array(nrOfShards).keys()), metaChainShardId];

  const fetchMarkers = () => {
    getMarkers({ timeout, explorerApi }).then(({ data }) => {
      const markersArray = processMarkers(data);
      if (ref.current) {
        setMarkers(markersArray as MarkerPoint[]);
      }
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
          if (ref.current) {
            setLeaders((currentLeaders) => [
              ...currentLeaders.filter((l) => !distinctShards.includes(l.shard)),
              ...shardLeaders,
            ]);
          }
        } else {
          if (ref.current) {
            setLeaders(shardLeaders);
          }
        }
      });
    }
  };

  React.useEffect(fetchLeaders, [timestamp, markers]);

  return (
    <div ref={ref}>
      <Map
        markers={markers}
        shardsArray={shardsArray}
        leaders={leaders}
        metaChainShardId={metaChainShardId}
      />
    </div>
  );
};

export default MapChart;
