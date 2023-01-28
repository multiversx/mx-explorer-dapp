import * as React from 'react';
import { MostUsed } from 'components';
import { useIsMainnet } from 'hooks';

import { HeroCard } from './HeroCard';
import { LatestBlocks } from './LatestBlocks';
import { LatestTransactions } from './LatestTransactions';
import { PriceChart } from './PriceChart';
import { LongChart } from './LongChart';
import { DelegationChart } from './DelegationChart';
import { EconomicsCard } from './EconomicsCard';

export const Home = () => {
  const isMainnet = useIsMainnet();

  return (
    <div className='home page-content container'>
      {isMainnet ? (
        <>
          <HeroCard />
          <MostUsed />
        </>
      ) : (
        <></>
      )}

      <div className='row'>
        <div className='col-12 mt-spacer'>
          <div className='d-xl-flex'>
            <PriceChart />
            <DelegationChart />
            <EconomicsCard />
          </div>

          <LongChart />
          <LatestBlocks />
        </div>
        <div className='col-12 mt-spacer'>
          <LatestTransactions />
        </div>
      </div>
    </div>
  );
};
