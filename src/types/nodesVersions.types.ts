import { MultilayerPercentageStepType } from 'components/types';
import { SliceType } from 'types/general.types';

export interface NodesVersionsApiType {
  [key: string]: number;
}

export interface NodesVersionsSliceType extends SliceType {
  unprocessed: NodesVersionsApiType;

  nodesVersions: MultilayerPercentageStepType[];
}
