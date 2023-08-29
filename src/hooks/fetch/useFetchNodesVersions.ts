import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { processNodesVersions } from 'helpers';
import { useAdapter } from 'hooks';
import { nodesVersionsSelector } from 'redux/selectors';
import { setNodesVersions } from 'redux/slices/nodesVersions';

export const useFetchNodesVersions = () => {
  const dispatch = useDispatch();
  const { getNodesVersions } = useAdapter();
  const { isFetched } = useSelector(nodesVersionsSelector);

  const fetchNodesVersions = () => {
    if (!isFetched) {
      getNodesVersions().then(({ data, success }) => {
        if (data && success) {
          const processedNodesVersions = processNodesVersions(data);

          dispatch(
            setNodesVersions({
              ...processedNodesVersions,

              unprocessed: data,
              isFetched: success
            })
          );
        }
      });
    }
  };

  useEffect(fetchNodesVersions, []);
};
