import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { processNodesOverview } from 'helpers';
import { useAdapter } from 'hooks';
import { getInitialNodesOverviewState, setNodesOverview } from 'redux/slices';
import { GetNodesType } from 'types';

import { createSingleFlight } from './helpers';

const singleFlight = createSingleFlight<any>();

export const useFetchNodesOverview = (config: GetNodesType) => {
  const dispatch = useDispatch();
  const { getNodes } = useAdapter();

  const getNodesOverviewOnce = () =>
    singleFlight(JSON.stringify(config), () => getNodes(config));

  const fetchNodesOverview = async () => {
    const { data, success } = await getNodesOverviewOnce();

    if (data) {
      const processedNodesOverview = processNodesOverview(data);

      dispatch(
        setNodesOverview({
          nodes: processedNodesOverview,
          isDataReady: success
        })
      );
    }

    return { data, success };
  };

  useEffect(() => {
    dispatch(setNodesOverview(getInitialNodesOverviewState()));
    fetchNodesOverview();
  }, []);
};
