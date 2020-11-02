import * as React from 'react';
import { useLocation } from 'react-router-dom';

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
  const [searchValue, setSearchValue] = React.useState<UseGetFiltersType['searchValue']>('');
  const [peerType, setPeerType] = React.useState<string | undefined>(undefined);
  const [issues, setIssues] = React.useState<boolean>(false);

  const getQueryParams = ({ searchValue, peerType, issues }: UseGetFiltersType) => ({
    ...(searchValue === '' ? {} : { searchValue: String(searchValue) }),
    ...(['', undefined].includes(peerType) ? {} : { peerType: String(peerType) }),
    ...(!issues ? {} : { issues: 'true' }),
  });

  React.useEffect(() => {
    setSearchValue(query.get('searchValue') ? String(query.get('searchValue')) : '');
    setPeerType(query.get('peerType') !== null ? String(query.get('peerType')) : undefined);
    setIssues(query.get('issues') === 'true');
  }, [query]);

  return {
    getQueryParams,
    searchValue,
    peerType,
    issues,
  };
}
