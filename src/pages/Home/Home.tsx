import { useHasGrowthWidgets } from 'hooks';
import {
  MostUsed,
  ChartContractsTransactions,
  ChartPrice,
  ChartStake,
  EconomicsCard
} from 'widgets';

import { LatestBlocks } from './components/LatestBlocks';
import { LatestTransactions } from './components/LatestTransactions';

export const Home = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();

  return (
    <div className='home page-content container'>
      {hasGrowthWidgets && (
        <>
          <div className='d-flex flex-column flex-xl-row gap-3 my-3'>
            <ChartPrice />
            <ChartStake />
            <EconomicsCard />
          </div>

          <ChartContractsTransactions isStandalone />
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
