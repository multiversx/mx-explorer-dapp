import React, { useCallback, useEffect } from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import { useGlobalDispatch, useGlobalState } from 'context';
import { GrowthDataType } from 'context/state';
import { Loader, PageState, adapter } from 'sharedComponents';

import GrowthSection from './GrowthSection';

const GrowthMetrics = () => {
  const ref = React.useRef(null);
  const { getGrowthMetrics } = adapter();
  const dispatch = useGlobalDispatch();
  const { growthMetrics } = useGlobalState();
  const { loading, fetched } = growthMetrics;

  const dispatcher = useCallback(
    (payload) =>
      dispatch({
        type: 'setGrowthMetrics',
        growthMetrics: {
          metrics: payload.growthMetrics,
          loading: payload.loading,
          fetched: payload.fetched,
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fetchData = useCallback(() => {
    const fetchPayload = async () => {
      try {
        dispatcher({
          loading: true,
          fetched: false,
        });

        const { success, data } = await getGrowthMetrics();
        const replace = (alpha: string, beta: string) => beta.toUpperCase();

        if (success) {
          const growthMetrics = data.reduce((total: GrowthDataType, item: GrowthDataType) => {
            const key = item.type.replaceAll(/-([a-z0-9])/g, replace);

            return {
              ...total,
              [key]: item,
            };
          }, {});

          dispatcher({
            growthMetrics,
            loading: false,
            fetched: true,
          });
        } else {
          dispatcher({
            loading: false,
            fetched: false,
          });
        }
      } catch {
        dispatcher({
          loading: false,
          fetched: false,
        });
      }
    };

    fetchPayload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchData, []);

  return (
    <div className="growth-metrics mt-5" ref={ref}>
      {loading && <Loader />}
      {!loading && !fetched && (
        <PageState
          icon={faChartBar}
          title="Unable to load Growth metric"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
      {!loading && fetched && <GrowthSection />}
    </div>
  );
};

export default GrowthMetrics;
