import React from 'react';
import Map from './Map';
import { getCities, /*getLeaders,*/ CityType } from './helpers/asyncRequests';
import { useGlobalState } from 'context';
// import { MarkerPoint } from './helpers/processing';
import { nrOfShards, metaChainShardId } from 'appConfig';

const MapChart = () => {
  const [cities, setCities] = React.useState<CityType[]>([]);
  // const [leaders, setLeaders] = React.useState();

  const {
    timeout,
    // refresh: { timestamp },
    activeNetwork: { apiUrl },
  } = useGlobalState();

  const shardsArray = [...Array.from(Array(nrOfShards).keys()), metaChainShardId];

  const fetchMarkers = () => {
    getCities({ timeout, apiUrl: apiUrl || '' }).then(({ data }) => {
      setCities(data);
    });
    // fetchLeaders();
  };
  React.useEffect(fetchMarkers, []);

  // const fetchLeaders = () => {
  //   if (markers.length > 0) {
  //     getLeaders({ timeout, apiUrl: apiUrl || '', shardsArray }).then((leadersArray) => {
  //       const publicKeys = leadersArray.map((l) => l.proposer);
  //       const leaderMarkers = markers.filter((marker) => publicKeys.includes(marker.publicKey));

  //       const offsets: { publicKey: string; name: string; offset: number }[] = [];
  //       leaderMarkers.forEach((leader) => {
  //         const occurences = offsets.map((offset) => offset.name).filter((p) => p === leader.name);

  //         offsets.push({
  //           name: leader.name,
  //           publicKey: leader.publicKey,
  //           offset: occurences.length > 0 ? -occurences.length - 3 : 0,
  //         });
  //       });

  //       const shardLeaders = leaderMarkers.map((leader) => {
  //         const { shard } = leadersArray.find((l) => l.proposer === leader.publicKey) || {};
  //         return {
  //           ...leader,
  //           shard,
  //           offset: offsets.find((o) => o.publicKey === leader.publicKey)!.offset || 0,
  //         };
  //       });

  //       if (setLeaders.length < 3) {
  //         const distinctShards = shardLeaders
  //           .map((l) => l.shard)
  //           .filter((value, index, self) => self.indexOf(value) === index);

  //         setLeaders((currentLeaders) => [
  //           ...currentLeaders.filter((l) => !distinctShards.includes(l.shard)),
  //           ...shardLeaders,
  //         ]);
  //       } else {
  //         setLeaders(shardLeaders);
  //       }
  //     });
  //   }
  // };

  // React.useEffect(fetchLeaders, [timestamp, markers]);

  return (
    <Map
      cities={cities}
      shardsArray={shardsArray}
      leaders={[]}
      metaChainShardId={metaChainShardId}
    />
  );
};

export default MapChart;
