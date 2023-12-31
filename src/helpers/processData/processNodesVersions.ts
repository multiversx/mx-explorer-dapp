import BigNumber from 'bignumber.js';

import {
  NodesVersionsApiType,
  NodesVersionsType
} from 'types/nodesVersions.types';

const prepareNodesVersions = (data: NodesVersionsApiType) => {
  const versions: NodesVersionsType[] = [];

  Object.keys(data).forEach((version) => {
    const percent = data[version];

    if (percent > 0) {
      versions.push({
        name: version,
        percent: new BigNumber(percent).times(100).toNumber()
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
