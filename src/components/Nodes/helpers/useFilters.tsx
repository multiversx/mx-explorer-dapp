import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { isValidInteger } from 'helpers';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export interface FiltersType {
  searchValue: string;
  peerType: string;
  issues: boolean;
  shard: string;
  status: string;
}

export default function useGetFilters() {
  const query = useQuery();
  const [searchValue, setSearchValue] = React.useState<FiltersType['searchValue']>('');
  const [peerType, setPeerType] = React.useState<FiltersType['peerType']>('');
  const [issues, setIssues] = React.useState<FiltersType['issues']>(false);
  const [shard, setShard] = React.useState<FiltersType['shard']>();
  const [status, setStatus] = React.useState<FiltersType['status']>('');

  const setUrlQueryParams = ({ searchValue, peerType, issues, shard, status }: FiltersType) => {
    const queryObject = {
      ...(searchValue === '' ? {} : { searchValue }),
      ...(status === '' ? {} : { status }),
      ...(peerType === '' ? {} : { peerType }),
      ...(!issues ? {} : { issues: 'true' }),
      ...(shard === '' ? {} : { shard }),
    };
    const queryString = new URLSearchParams(queryObject);
    const queryIsDefined = String(queryString).length > 0;

    if (
      (window.location.search || queryIsDefined) &&
      `?${String(queryString)}` !== window.location.search
    ) {
      const questionMark = queryIsDefined ? '?' : '';
      window.history.pushState({}, '', `/nodes${questionMark}${queryString}`);
    }
  };

  React.useEffect(() => {
    setSearchValue(query.get('searchValue') ? String(query.get('searchValue')) : '');
    setStatus(query.get('status') ? String(query.get('status')) : '');
    setPeerType(query.get('peerType') ? String(query.get('peerType')) : '');
    setShard(isValidInteger(String(query.get('shard'))) ? String(query.get('shard')) : '');
    setIssues(query.get('issues') === 'true');
  }, [query]);

  return {
    setUrlQueryParams,
    searchValue,
    peerType,
    issues,
    shard,
    status,
  };
}
