import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { FormatEGLD } from 'components';
import { useFetchGrowthEconomics } from 'hooks';
import { ChartContractsTransactions } from 'pages/Home/components/ChartContractsTransactions';
import { growthEconomicsSelector } from 'redux/selectors';

export const HeroApplications = () => {
  const { applicationsDeployed, unprocessed } = useSelector(
    growthEconomicsSelector
  );

  const economics: any[] = [
    {
      label: 'Apps Deployed',
      value: <span className='text-primary'>{applicationsDeployed}</span>
    },
    {
      label: 'Fees Captured',
      value: (
        <FormatEGLD
          value={new BigNumber(unprocessed.feesCaptured).toFormat(2)}
          showEgldLabel
          superSuffix
        />
      )
    },
    {
      label: 'Developer Rewards',
      value: (
        <FormatEGLD
          value={new BigNumber(unprocessed.developerRewards).toFormat(2)}
          showEgldLabel
          superSuffix
        />
      )
    }
  ];

  useFetchGrowthEconomics();

  return (
    <div className='card-body p-0 '>
      <ChartContractsTransactions
        title='Transactions'
        showTransactions={false}
        showTotal={false}
        simpleTooltip={true}
        hasBorder={true}
        customStatistics={economics}
      />
    </div>
  );
};
