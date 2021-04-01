import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie } from '@fortawesome/pro-solid-svg-icons/faChartPie';
import { faUsers } from '@fortawesome/pro-solid-svg-icons/faUsers';
import { faChartArea } from '@fortawesome/pro-solid-svg-icons/faChartArea';
import { useGlobalState } from 'context';
import EpochGear from 'components/Layout/GlobalStatsCard/EpochGear';
import { adapter } from 'sharedComponents';

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

  const {
    getStats,
    getEgldPrice,
    getEgldMarketCap,
    getEgldCirculatingSupply,
    getEgldTotalStaked,
  } = adapter();

  const [data, setData] = React.useState(initialState);

  const getData = () => {
    if (ref.current !== null) {
      Promise.all([
        getStats(),
        getEgldPrice(),
        getEgldMarketCap(),
        getEgldCirculatingSupply(),
        getEgldTotalStaked(),
      ]).then(([statsData, priceData, marketCapData, circulatingSupplyData, totalStakedData]) => {
        const usd = priceData.success
          ? `$${parseFloat(priceData.data).toLocaleString('en')}`
          : '...';

        const marketCap = marketCapData.success
          ? `$${parseInt(marketCapData.data).toLocaleString('en')}`
          : '...';

        const circulatingSupply = circulatingSupplyData.success
          ? parseInt(circulatingSupplyData.data).toLocaleString('en')
          : '...';

        const totalStaked = totalStakedData.success
          ? parseInt(totalStakedData.data).toLocaleString('en')
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
      });
    }
  };
  React.useEffect(getData, [activeNetworkId]);

  return (
    <div ref={ref} className="container global-stats-card">
      <div className="row">
        <div className="col mb-spacer">
          <div className="card d-flex flex-column flex-lg-row flex-wrap py-4 px-3 px-lg-spacer">
            <div className="d-flex mb-3 mb-lg-0 pr-lg-4 mr-lg-2">
              <EpochGear stats={data} />
            </div>

            <div className="d-flex align-items-center mb-3 mb-lg-0 pr-lg-5">
              <div className="right-angle-icon flex-shrink-0 lg mr-4">
                <FontAwesomeIcon icon={faChartArea} />
              </div>
              <div className="d-flex flex-column flex-grow-1 flex-shrink-0">
                <div className="mb-1">Market Info</div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-secondary mr-3">EGLD Price:</span>
                  {data.usd}
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-secondary mr-3">EGLD Market Cap:</span>
                  {data.marketCap}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center mb-3 mb-lg-0 pr-lg-5">
              <div className="right-angle-icon flex-shrink-0 lg mr-4">
                <FontAwesomeIcon icon={faChartPie} />
              </div>
              <div className="d-flex flex-column flex-grow-1 flex-shrink-0">
                <div className="mb-1">Economics</div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-secondary mr-3">Circulating Supply:</span>
                  {data.circulatingSupply}
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-secondary mr-3">Total Staked:</span>
                  {data.totalStaked}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center mb-3 mb-lg-0">
              <div className="right-angle-icon flex-shrink-0 lg mr-4">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="d-flex flex-column flex-grow-1 flex-shrink-0">
                <div className="mb-1">Usage</div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-secondary mr-3">Addresses:</span>
                  {data.accounts}
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-secondary mr-3">Transactions:</span>
                  {data.transactions}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalStatsCard;
