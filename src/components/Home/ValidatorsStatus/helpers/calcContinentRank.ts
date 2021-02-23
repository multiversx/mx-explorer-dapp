import { MarkerType } from './asyncRequests';

export interface RankType {
  continent: string;
  nodes: number;
  percentage: number;
}

export default function calcContinentRank (markers: MarkerType[]) {
  const rank: RankType[] = [];
  const uniqueContinents = Array.from(new Set(markers.map((marker) => marker.continent)));

  let totalNodes = 0;
  markers.forEach((marker) => (totalNodes += marker.validators));

  uniqueContinents.forEach((continent) => {
    let nodes = 0;
    markers.forEach((marker) => {
      if (marker.continent === continent) {
        nodes += marker.validators;
      }
    });

    rank.push({
      continent,
      nodes,
      percentage: Math.floor((nodes * 100) / totalNodes),
    });
  });

  rank.sort((a, b) => b.percentage - a.percentage);

  const topThree = rank.splice(0, 3);

  let otherNodes = 0;
  rank.forEach((item) => (otherNodes += item.nodes));

  return [
    ...topThree,
    {
      continent: 'Others',
      nodes: otherNodes,
      percentage: Math.floor((otherNodes * 100) / totalNodes),
    },
  ];
};