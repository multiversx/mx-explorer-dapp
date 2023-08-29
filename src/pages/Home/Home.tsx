import { useIsMainnet } from 'hooks';
import { MostUsed } from 'widgets';

import { ChartContractsTransactions } from './components/ChartContractsTransactions';
import { ChartPrice } from './components/ChartPrice';
import { ChartStake } from './components/ChartStake';
import { EconomicsCard } from './components/EconomicsCard';
import { LatestBlocks } from './components/LatestBlocks';
import { LatestTransactions } from './components/LatestTransactions';

export const Home = () => {
  const isMainnet = useIsMainnet();

  return (
    <div className='home page-content container'>
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
