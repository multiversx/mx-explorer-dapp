import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface UseGetFiltersType {
  searchValue: string;
  peerType: string | undefined;
  issues: boolean;
}

export default function useGetFilters() {
  const query = useQuery();
  const history = useHistory();
  const { search, pathname } = useLocation();
  const [searchValue, setSearchValue] = React.useState<UseGetFiltersType['searchValue']>('');
  const [peerType, setPeerType] = React.useState<string | undefined>(undefined);
  const [issues, setIssues] = React.useState<boolean>(false);

  const getQueryParams = ({ searchValue, peerType, issues }: UseGetFiltersType) => ({
    ...(searchValue === '' ? {} : { searchValue: String(searchValue) }),
    ...(['', undefined].includes(peerType) ? {} : { peerType: String(peerType) }),
    ...(!issues ? {} : { issues: 'true' }),
  });

  const setQueryParams = ({ searchValue, peerType, issues }: UseGetFiltersType) => {
    const nextUrlParams = new URLSearchParams({
      ...(searchValue === '' ? {} : { searchValue: String(searchValue) }),
      ...(['', undefined].includes(peerType) ? {} : { peerType: String(peerType) }),
      ...(!issues ? {} : { issues: 'true' }),
    }).toString();
    if (nextUrlParams && `?${nextUrlParams}` !== search) {
      history.push(`${pathname}?${nextUrlParams}`);
    }
  };

  React.useEffect(() => {
    setSearchValue(query.get('searchValue') ? String(query.get('searchValue')) : '');
    setPeerType(query.get('peerType') !== null ? String(query.get('peerType')) : undefined);
    setIssues(query.get('issues') === 'true');
  }, [query]);

  return {
    getQueryParams,
    setQueryParams,
  };
}
