import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAdapter } from 'components';
import { processNodesVersions } from 'helpers';
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchNodesVersions, []);
};