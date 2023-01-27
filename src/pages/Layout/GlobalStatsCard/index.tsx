import * as React from 'react';
import { faChartArea } from '@fortawesome/pro-solid-svg-icons/faChartArea';
import { faChartPie } from '@fortawesome/pro-solid-svg-icons/faChartPie';
import { faUsers } from '@fortawesome/pro-solid-svg-icons/faUsers';
import BigNumber from 'bignumber.js';

import { useSelector } from 'react-redux';
import { CardItem } from 'components';
import { EpochGear } from 'pages/Layout/GlobalStatsCard/EpochGear';

import { economicsSelector, statsSelector } from 'redux/selectors';

export const GlobalStatsCard = () => {
  const ref = React.useRef(null);

  const { circulatingSupply, staked, totalStakedPercent, marketCap, price } =
    useSelector(economicsSelector);
  const { accounts, transactions } = useSelector(statsSelector);

  return (
    <div ref={ref} className='global-stats-card'>
      <div className='row'>
        <div className='col'>
          <div className='card d-flex flex-column flex-lg-row flex-wrap py-4 px-3 px-lg-spacer'>
            <div className='card-body d-flex flex-column flex-lg-row'>
              <div className='d-flex align-items-center justify-content-center'>
                <EpochGear />
              </div>
              <div className='card-item-container w-100'>
                <CardItem
                  className='n3 lg title-bold'
                  title='Market Info'
                  icon={faChartArea}
                >
                  <div className='d-flex flex-column w-100'>
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-neutral-400 me-3'>EGLD Price:</span>
                      {price}
                    </div>
                    <div className='d-flex justify-content-between'>
                      <span className='text-neutral-400 me-3'>Market Cap:</span>
                      {marketCap}
                    </div>
                  </div>
                </CardItem>

                <CardItem
                  className='n3 lg title-bold'
                  title='Economics'
                  icon={faChartPie}
                >
                  <div className='d-flex flex-column w-100'>
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-neutral-400 me-1'>
                        Circulating Supply:
                      </span>

                      {circulatingSupply}
                    </div>
                    <div className='d-flex justify-content-between'>
                      <span className='text-neutral-400 me-1'>
                        Total Staked:
                      </span>
                      {staked} ({totalStakedPercent})
                    </div>
                  </div>
                </CardItem>

                <CardItem
                  className='n3 lg title-bold'
                  title='Usage'
                  icon={faUsers}
                >
                  <div className='d-flex flex-column w-100'>
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-neutral-400 me-3'>Addresses:</span>
                      {accounts}
                    </div>
                    <div className='d-flex justify-content-between'>
                      <span className='text-neutral-400 me-3'>
                        Transactions:
                      </span>
                      {transactions}
                    </div>
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
