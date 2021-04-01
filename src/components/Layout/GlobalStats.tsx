import React from 'react';
import { useGlobalState, useGlobalDispatch } from 'context';
import { adapter } from 'sharedComponents';
import moment from 'moment';
import initialState from 'context/state';

const processStats = (statsData: any) => {
  const { data, success } = statsData;
  const check = success ? data.roundsPerEpoch >= data.roundsPassed : false;
  const newState = success
    ? {
        shards: parseInt(data.shards).toLocaleString('en'),
        blocks: parseInt(data.blocks).toLocaleString('en'),
        accounts: parseInt(data.accounts).toLocaleString('en'),
        transactions: parseInt(data.transactions).toLocaleString('en'),
        epoch: data.epoch.toLocaleString('en'),
        epochPercentage: check ? (100 * data.roundsPassed) / data.roundsPerEpoch : 0,
        epochTotalTime: check
          ? moment.utc(data.refreshRate * data.roundsPerEpoch).format('HH:mm')
          : '...',
        epochTimeElapsed: check
          ? moment.utc(data.refreshRate * data.roundsPassed).format('HH:mm')
          : '...',
        epochTimeRemaining: check
          ? moment.utc(data.refreshRate * (data.roundsPerEpoch - data.roundsPassed)).format('HH:mm')
          : '...',
      }
    : initialState().globalStats;

  return newState;
};

const GlobalStats = () => {
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { getStats, getEgldPrice } = adapter();

  const getData = () => {
    Promise.all([getStats(), getEgldPrice()]).then(([statsData, priceData]) => {
      if (statsData.success) {
        const usd =
          priceData.success && priceData.data.length > 0
            ? priceData.data[priceData.data.length - 1].value
            : undefined;

        dispatch({
          type: 'setGlobalStats',
          globalStats: { ...processStats(statsData), usd },
        });
      }
    });
  };
  React.useEffect(getData, [timestamp, activeNetworkId]);

  return <></>;
};

export default GlobalStats;
