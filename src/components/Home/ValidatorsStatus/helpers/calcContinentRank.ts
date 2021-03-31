import { MarkerType } from './asyncRequests';

export interface RankType {
  continent: string;
  nodes: number;
  percentage: number;
}

export default function calcContinentRank(markers: MarkerType[], totalNodes: number) {
  const rank: RankType[] = [];
  const uniqueContinents = Array.from(new Set(markers.map((marker) => marker.continent)));

  let markersTotalNodes = 0;
  markers.forEach((marker) => (markersTotalNodes += marker.validators));

  uniqueContinents.forEach((continent) => {
    let nodes = 0;
    markers.forEach((marker) => {
      if (marker.continent === continent) {
        nodes += marker.validators;
      }
    });

    const percentage = (nodes * 100) / markersTotalNodes;
    const alteredNodesCount = Math.floor((percentage * totalNodes) / 100);

    rank.push({
      continent,
      nodes: alteredNodesCount,
      percentage: Math.floor(percentage),
    });
  });
  rank.sort((a, b) => b.percentage - a.percentage);

  const topThree = rank.splice(0, 3);

  let otherNodes = 0;
  rank.forEach((item) => (otherNodes += item.nodes));

  const otherPercent = (otherNodes * 100) / markersTotalNodes;
  const alteredOtherNodesCount = Math.floor((otherPercent * totalNodes) / 100);

  let totalAlteredNodesCount = alteredOtherNodesCount;
  topThree.forEach((rank) => {
    totalAlteredNodesCount += rank.nodes;
  });
  const diff = totalNodes - totalAlteredNodesCount;

  return [
    ...topThree,
    {
      continent: 'Others',
      nodes: alteredOtherNodesCount + diff,
      percentage: otherPercent < 1 ? 1 : Math.floor(otherPercent),
    },
  ];
}
