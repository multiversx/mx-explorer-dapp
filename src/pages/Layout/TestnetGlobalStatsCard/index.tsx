import * as React from 'react';
import { faCube } from '@fortawesome/pro-solid-svg-icons/faCube';
import { faExchangeAlt } from '@fortawesome/pro-solid-svg-icons/faExchangeAlt';
import { faLayerGroup } from '@fortawesome/pro-solid-svg-icons/faLayerGroup';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import BigNumber from 'bignumber.js';

import { useSelector } from 'react-redux';
import { CardItem } from 'components';
import { useFetchStats } from 'helpers';

import { EpochGear } from 'pages/Layout/GlobalStatsCard/EpochGear';
import { statsSelector } from 'redux/selectors';

export const TestnetGlobalStatsCard = () => {
  useFetchStats();
  const ref = React.useRef(null);

  const { isFetched, shards, blocks, accounts, transactions } =
    useSelector(statsSelector);

  return (
    <div ref={ref} className='global-stats-card'>
      <div className='row'>
        <div className='col'>
          <div className='card d-flex flex-column flex-lg-row flex-wrap py-4 px-3 px-lg-spacer'>
            <div className='card-body d-flex flex-column flex-lg-row'>
              <div className='d-flex align-items-center justify-content-center'>
                <EpochGear showTime />
              </div>
              <div className='card-item-container w-100'>
                <CardItem
                  className='lg title-bold'
                  title='Shards'
                  icon={faLayerGroup}
                >
                  {isFetched ? shards : '...'}
                </CardItem>

                <CardItem
                  className='lg title-bold'
                  title='Blocks'
                  icon={faCube}
                >
                  <div data-testid='blocks'>
                    {isFetched ? new BigNumber(blocks).toFormat(0) : '...'}
                  </div>
                </CardItem>

                <CardItem
                  className='lg title-bold'
                  title='Accounts'
                  icon={faUser}
                >
                  <div data-testid='accounts'>
                    {isFetched ? new BigNumber(accounts).toFormat(0) : '...'}
                  </div>
                </CardItem>

                <CardItem
                  className='lg title-bold'
                  title='Transactions'
                  icon={faExchangeAlt}
                >
                  <div data-testid='transactions'>
                    {isFetched
                      ? new BigNumber(transactions).toFormat(0)
                      : '...'}
                  </div>
                </CardItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
