import * as React from 'react';
import { MostUsed } from 'components';
import { useIsMainnet } from 'helpers';

import { TestnetGlobalStatsCard } from 'pages/Layout/TestnetGlobalStatsCard';
import { AccountsChart } from './AccountsChart';
import { LatestBlocks } from './LatestBlocks';
import { LatestTransactions } from './LatestTransactions';
import { NetworkHealth } from './NetworkHealth';
import { PriceChart } from './PriceChart';
import { StakingChart } from './StakingChart';
import { TransactionsChart } from './TransactionsChart';
import { ValidatorsStatus } from './ValidatorsStatus';

export const Home = () => {
  const isMainnet = useIsMainnet();

  return (
    <div className='home page-content container'>
      {isMainnet ? (
        <>
          <MostUsed />
          {/* <div className='row'>
            <div className='col-12 mx-auto col-lg-6'>
              <NetworkHealth />
            </div>
            <div className='col-12 col-lg-6 mt-spacer mt-lg-0'>
              <ValidatorsStatus />
            </div>
          </div>

          <div className='row'>
            <div className='col-12 col-lg-6 mt-spacer'>
              <PriceChart />
            </div>
            <div className='col-12 col-lg-6 mt-spacer'>
              <StakingChart />
            </div>
            <div className='col-12 col-lg-6 mt-spacer'>
              <TransactionsChart />
            </div>
            <div className='col-12 col-lg-6 mt-spacer'>
              <AccountsChart />
            </div>
          </div> */}
        </>
      ) : (
        // <TestnetGlobalStatsCard />
        <></>
      )}

      <div className='row'>
        <div className='col-12 mt-spacer'>
          <LatestBlocks />
        </div>
        <div className='col-12 mt-spacer'>
          <LatestTransactions />
        </div>
      </div>
    </div>
  );
};
