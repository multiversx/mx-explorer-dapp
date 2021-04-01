import * as React from 'react';
import { faChartPie } from '@fortawesome/pro-solid-svg-icons/faChartPie';
import { faUsers } from '@fortawesome/pro-solid-svg-icons/faUsers';
import { faChartArea } from '@fortawesome/pro-solid-svg-icons/faChartArea';
import { useGlobalState } from 'context';
import EpochGear from 'components/Layout/GlobalStatsCard/EpochGear';
import { adapter, CardItem } from 'sharedComponents';

import { processStats } from 'helpers';
import { initialStats } from 'helpers/processStats';

const initialState = {
  ...initialStats,
  usd: '...',
  marketCap: '...',
  circulatingSupply: '...',
  totalStaked: '...',
};

const GlobalStatsCard = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();

  const { getStats, getEgldPrice, getEgldMarketCap, getEconomics } = adapter();

  const [data, setData] = React.useState(initialState);

  const getData = () => {
    if (ref.current !== null) {
      Promise.all([getStats(), getEgldPrice(), getEgldMarketCap(), getEconomics()]).then(
        ([statsData, priceData, marketCapData, economicsData]) => {
          const usd = priceData.success
            ? `$${parseFloat(priceData.data).toLocaleString('en')}`
            : '...';

          const marketCap = marketCapData.success
            ? `$${parseInt(marketCapData.data).toLocaleString('en')}`
            : '...';

          const circulatingSupply = economicsData.success
            ? parseInt(economicsData.data.circulatingSupply).toLocaleString('en')
            : '...';

          const totalStaked = economicsData.success
            ? parseInt(economicsData.data.staked).toLocaleString('en')
            : '...';

          if (ref.current !== null) {
            setData({
              ...processStats(statsData),
              usd,
              marketCap,
              circulatingSupply,
              totalStaked,
            });
          }
        }
      );
    }
  };
  React.useEffect(getData, [activeNetworkId]);

  return (
    <div ref={ref} className="container global-stats-card">
      <div className="row">
        <div className="col mb-spacer">
          <div className="card d-flex flex-column flex-lg-row flex-wrap py-4 px-3 px-lg-spacer">
            <div className="card-body p-0 d-flex flex-column flex-lg-row">
              <div className="d-flex align-items-center justify-content-center mb-3 mb-lg-0 pr-lg-4">
                <EpochGear stats={data} />
              </div>
              <div className="card-item-container w-100">
                <CardItem className="n3 lg" title="Market Info" icon={faChartArea}>
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary mr-3">Price:</span>
                      {data.usd}
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary mr-3">Market Cap:</span>
                      {data.marketCap}
                    </div>
                  </div>
                </CardItem>

                <CardItem className="n3 lg" title="Economics" icon={faChartPie}>
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary mr-3">Circulating Supply:</span>
                      {data.circulatingSupply}
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary mr-3">Total Staked:</span>
                      {data.totalStaked}
                    </div>
                  </div>
                </CardItem>

                <CardItem className="n3 lg" title="Usage" icon={faUsers}>
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary mr-3">Addresses:</span>
                      {data.accounts}
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary mr-3">Transactions:</span>
                      {data.transactions}
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

export default GlobalStatsCard;
