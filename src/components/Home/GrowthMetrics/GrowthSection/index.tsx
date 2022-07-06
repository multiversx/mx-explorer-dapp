import * as React from 'react';
import { useGlobalState } from 'context';
import { GrowthMetricsType } from 'context/state';

import GrowthBlock from '../GrowthBlock';
import getGrowthBlockSettings from './getGrowthBlockSettings';

export type GrowthBlockSettingsType = keyof GrowthMetricsType['metrics'];

const GrowthSection = () => {
  const { growthMetrics } = useGlobalState();

  const getSettings = (type: GrowthBlockSettingsType) => {
    if (growthMetrics && growthMetrics.metrics && growthMetrics.metrics[type]) {
      return getGrowthBlockSettings({
        type,
        data: growthMetrics.metrics[type],
      });
    } else {
      return {
        title: '',
        value: {
          text: '',
        },
      };
    }
  };

  return (
    <>
      <div className="row">
        <GrowthBlock {...getSettings('egldUsdPrice')} />
        <GrowthBlock {...getSettings('egldEurPrice')} />
        <GrowthBlock {...getSettings('egldBtcPrice')} />
        <GrowthBlock {...getSettings('egldEthPrice')} />
        <GrowthBlock {...getSettings('allTimeHigh')} />
        <GrowthBlock {...getSettings('marketCapitalization')} />
        <GrowthBlock {...getSettings('change24h')} />
        <GrowthBlock {...getSettings('change7Day')} />
        <GrowthBlock {...getSettings('change14Day')} />
        <GrowthBlock {...getSettings('change30Day')} />
        <GrowthBlock {...getSettings('change200Day')} />
        <GrowthBlock {...getSettings('change1Year')} />
      </div>
      <div className="row">
        <GrowthBlock {...getSettings('exchangeVolume24h')} />
        <GrowthBlock {...getSettings('exchangeWithdraw24h')} />
        <GrowthBlock {...getSettings('exchangeDeposits24h')} />
      </div>
      <div className="row">
        <GrowthBlock {...getSettings('currentEgldSupply')} />
        <GrowthBlock {...getSettings('lockedEgld')} />
        <GrowthBlock {...getSettings('freeFloatingEgld')} />
        <GrowthBlock {...getSettings('egldLeftPerUser')} />
        <GrowthBlock {...getSettings('addresses')} />
        <GrowthBlock {...getSettings('newAddresses')} />
        <GrowthBlock {...getSettings('maiarUsers')} />
        <GrowthBlock {...getSettings('newMaiarUsers')} />
      </div>
    </>
  );
};

export default GrowthSection;
