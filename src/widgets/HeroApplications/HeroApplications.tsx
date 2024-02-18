import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';
import { useFetchGrowthEconomics } from 'hooks';
import { ChartContractsTransactions } from 'pages/Home/components/ChartContractsTransactions';
import {
  activeNetworkSelector,
  growthEconomicsSelector
} from 'redux/selectors';
import { WithClassnameType } from 'types';

// Temporary - avoid branch conflicts
export interface FormattedValueUIType extends WithClassnameType {
  value: string | number;
  showEgldLabel?: boolean;
  superSuffix?: boolean;
}

export const FormattedValue = ({
  value,
  showEgldLabel,
  superSuffix,
  className
}: FormattedValueUIType) => {
  const { egldLabel } = useSelector(activeNetworkSelector);

  if (!value) {
    return null;
  }
  if (!egldLabel || !(String(value).includes(egldLabel) || showEgldLabel)) {
    return value;
  }

  const [amount, decimals] = String(value).replace(egldLabel, '').split('.');

  return (
    <span className={classNames(className, 'formatted')}>
      <MultiversXSymbol className='symbol' />{' '}
      <span className='amount'>{amount}</span>
      <span className='decimals'>.{decimals}</span>
      <>
        {superSuffix ? (
          <sup className='suffix'>&nbsp;{egldLabel}</sup>
        ) : (
          <span className='suffix'>&nbsp;{egldLabel}</span>
        )}
      </>
    </span>
  );
};

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
        <FormattedValue
          value={new BigNumber(unprocessed.feesCaptured).toFormat(2)}
          showEgldLabel
          superSuffix
        />
      )
    },
    {
      label: 'Developer Rewards',
      value: (
        <FormattedValue
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
        customStatistics={economics}
      />
    </div>
  );
};
