import {
  NodesVersionsApiType,
  NodesVersionsType
} from 'types/nodesVersions.types';

const countDecimals = (value: number) => {
  if (Math.floor(value) === value) return 0;
  return value.toString().split('.')[1].length || 0;
};

const prepareNodesVersions = (data: NodesVersionsApiType) => {
  const versions: NodesVersionsType[] = [];

  Object.keys(data).forEach((version) => {
    const percent = data[version];

    if (percent > 0) {
      versions.push({
        name: version,
        percent: Math.floor(
          countDecimals(percent) > 2 ? percent * 10000 : percent * 100
        )
      });
    }
  });

  return versions.sort((a, b) => b.percent - a.percent);
};

export const processNodesVersions = (data: NodesVersionsApiType) => {
  return {
    nodesVersions: prepareNodesVersions(data)
  };
};
