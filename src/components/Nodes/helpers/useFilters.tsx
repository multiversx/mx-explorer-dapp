import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { isValidInteger } from 'helpers';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export interface FiltersType {
  searchValue: string;
  peerType: string | undefined;
  issues: boolean;
  shard: string;
}

export default function useGetFilters() {
  const query = useQuery();
  const [searchValue, setSearchValue] = React.useState<FiltersType['searchValue']>('');
  const [peerType, setPeerType] = React.useState<FiltersType['peerType']>(undefined);
  const [issues, setIssues] = React.useState<FiltersType['issues']>(false);
  const [shard, setShard] = React.useState<FiltersType['shard']>();

  const getQueryParams = ({ searchValue, peerType, issues, shard }: FiltersType) => ({
    ...(searchValue === '' ? {} : { searchValue: String(searchValue) }),
    ...(['', undefined].includes(peerType) ? {} : { peerType: String(peerType) }),
    ...(!issues ? {} : { issues: 'true' }),
    ...(['', undefined].includes(shard) ? {} : { shard }),
  });

  React.useEffect(() => {
    setSearchValue(query.get('searchValue') ? String(query.get('searchValue')) : '');
    setPeerType(query.get('peerType') !== null ? String(query.get('peerType')) : undefined);
    setShard(isValidInteger(String(query.get('shard'))) ? String(query.get('shard')) : undefined);
    setIssues(query.get('issues') === 'true');
  }, [query]);

  return {
    getQueryParams,
    searchValue,
    peerType,
    issues,
    shard,
  };
}
