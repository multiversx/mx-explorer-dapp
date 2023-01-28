import * as React from 'react';
import { MostUsed } from 'components';
import { useIsMainnet } from 'hooks';

import { ChartStake } from './ChartStake';
import { EconomicsCard } from './EconomicsCard';
import { HeroCard } from './HeroCard';
import { LatestBlocks } from './LatestBlocks';
import { LatestTransactions } from './LatestTransactions';
import { ChartContractsTransactions } from './ChartContractsTransactions';
import { ChartPrice } from './ChartPrice';

export const Home = () => {
  const isMainnet = useIsMainnet();

  return (
    <div className='home page-content container'>
      <HeroCard />

      {isMainnet && (
        <>
          <div className='d-xl-flex mt-3'>
            <ChartPrice />
            <ChartStake />
            <EconomicsCard />
          </div>

          <ChartContractsTransactions />
          <MostUsed />
        </>
      )}

      <div className='row'>
        <div className='col-12 mt-3'>
          <LatestBlocks />
        </div>
        <div className='col-12 mt-3'>
          <LatestTransactions />
        </div>
      </div>
    </div>
  );
};
