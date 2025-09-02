import { SliceType } from 'types/general.types';

export interface SearchSliceType extends SliceType {
  latestSearches: SearchResultType[];
  topTokens: SearchResultType[];
  topCollections: SearchResultType[];
  topApps: SearchResultType[];
}

export interface SearchResultType {
  id: string;
  text: string;
}
