import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { Loader, PageState } from 'components';
import { useHasGrowthWidgets } from 'hooks';
import { faCoins } from 'icons/regular';
import { activeNetworkSelector, economicsSelector } from 'redux/selectors';
import { ChartPrice, ChartStake } from 'widgets';

import { NativeTokenDetailsCard } from './NativeTokenDetailsCard';

export const NativeTokenLayout = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { isFetched } = useSelector(economicsSelector);

  const loading = isFetched === undefined;
  const failed = isFetched === false;

  if (loading) {
    return <Loader />;
  }

  if (failed) {
    return (
      <PageState
        icon={faCoins}
        title='Unable to load details'
        description={
          <div className='px-spacer'>
            <span className='text-break-all'>{egldLabel}</span>
          </div>
        }
        isError
      />
    );
  }

  return (
    <div className='container page-content native-token'>
      <NativeTokenDetailsCard />
      {hasGrowthWidgets && (
        <div className='d-flex flex-column flex-xl-row gap-3 my-3'>
          <ChartPrice />
          <ChartStake />
        </div>
      )}
      <Outlet />
    </div>
  );
};
