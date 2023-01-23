export enum QueryParamNamesEnum {
  page = 'page',
  after = 'after',
  before = 'before',
  search = 'search',
  type = 'type',
}

export interface ExplorerOriginType {
  search: string;
  pathname: string;
}

export interface SearchParamsType {
  [QueryParamNamesEnum.page]?: number;
  [QueryParamNamesEnum.after]?: number;
  [QueryParamNamesEnum.before]?: number;
  [QueryParamNamesEnum.search]?: string;
}
