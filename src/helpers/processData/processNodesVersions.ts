import BigNumber from 'bignumber.js';

import { MultilayerPercentageStepType } from 'components/types';
import { NodesVersionsApiType } from 'types/nodesVersions.types';

const prepareNodesVersions = (data: NodesVersionsApiType) => {
  const versions: MultilayerPercentageStepType[] = [];

  Object.keys(data).forEach((version) => {
    const percent = data[version];

    if (percent > 0) {
      versions.push({
        name: version,
        value: new BigNumber(percent).times(100).toNumber()
      });
    }
  });

  return versions.sort((a, b) => b.value - a.value);
};

export const processNodesVersions = (data: NodesVersionsApiType) => {
  return {
    nodesVersions: prepareNodesVersions(data)
  };
};
