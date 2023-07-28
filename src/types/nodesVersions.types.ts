import { SliceType } from 'types/general.types';

export interface NodesVersionsApiType {
  [key: string]: number;
}

export interface NodesVersionsType {
  name: string;
  percent: number;
}

export interface NodesVersionsSliceType extends SliceType {
  unprocessed: NodesVersionsApiType;

  nodesVersions: NodesVersionsType[];
}
