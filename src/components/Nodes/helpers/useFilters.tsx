import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { isValidInteger } from 'helpers';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export interface FiltersType {
  search: string;
  peerType: string;
  nodeType: string;
  issues: boolean;
  shardId: string;
  status: string;
  page: string;
}

export default function useGetFilters() {
  const query = useQuery();
  const [search, setSearch] = React.useState<FiltersType['search']>('');
  const [peerType, setPeerType] = React.useState<FiltersType['peerType']>('');
  const [nodeType, setNodeType] = React.useState<FiltersType['nodeType']>('');
  const [issues, setIssues] = React.useState<FiltersType['issues']>(false);
  const [shardId, setShardId] = React.useState<FiltersType['shardId']>();
  const [status, setStatus] = React.useState<FiltersType['status']>('');
  const [page, setPage] = React.useState<FiltersType['page']>('');

  const getQueryString = ({
    search,
    peerType,
    issues,
    shardId,
    status,
    page,
    nodeType,
  }: FiltersType) => {
    const queryObject = {
      ...(search === '' ? {} : { search }),
      ...(status === '' ? {} : { status }),
      ...(peerType === '' ? {} : { peerType }),
      ...(nodeType === '' ? {} : { nodeType }),
      ...(!issues ? {} : { issues: 'true' }),
      ...(shardId === '' ? {} : { shardId }),
      ...(page === '' ? {} : { page }),
    };
    const queryString = new URLSearchParams(queryObject);
    const queryIsDefined = String(queryString).length > 0;

    const updatePushState =
      (window.location.search || queryIsDefined) &&
      `?${String(queryString)}` !== window.location.search;

    const questionMark = queryIsDefined ? '?' : '';

    return {
      queryObject,
      query: `${questionMark}${queryString}`,
      updatePushState,
    };
  };

  React.useEffect(() => {
    setSearch(query.get('search') ? String(query.get('search')) : '');
    setStatus(query.get('status') ? String(query.get('status')) : '');
    setPeerType(query.get('peerType') ? String(query.get('peerType')) : '');
    setNodeType(query.get('nodeType') ? String(query.get('nodeType')) : '');
    setShardId(isValidInteger(String(query.get('shardId'))) ? String(query.get('shardId')) : '');
    setPage(isValidInteger(String(query.get('page'))) ? String(query.get('page')) : '');
    setIssues(query.get('issues') === 'true');
  }, [query]);

  return {
    getQueryString,
    search,
    peerType,
    nodeType,
    issues,
    shardId,
    page,
    status,
  };
}
