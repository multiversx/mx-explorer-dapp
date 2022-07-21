import * as React from 'react';
import { faChartPie } from '@fortawesome/pro-solid-svg-icons/faChartPie';
import { faUsers } from '@fortawesome/pro-solid-svg-icons/faUsers';
import { faChartArea } from '@fortawesome/pro-solid-svg-icons/faChartArea';
import { useGlobalState } from 'context';
import EpochGear from 'components/Layout/GlobalStatsCard/EpochGear';
import { CardItem } from 'sharedComponents';

const GlobalStatsCard = () => {
  const ref = React.useRef(null);
  const { usd, stats, economics } = useGlobalState();

  return (
    <div ref={ref} className="global-stats-card">
      <div className="row">
        <div className="col">
          <div className="card d-flex flex-column flex-lg-row flex-wrap py-4 px-3 px-lg-spacer">
            <div className="card-body p-0 d-flex flex-column flex-lg-row">
              <div className="d-flex align-items-center justify-content-center">
                <EpochGear stats={stats} />
              </div>
              <div className="card-item-container w-100">
                <CardItem className="n3 lg title-bold" title="Market Info" icon={faChartArea}>
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary mr-3">EGLD Price:</span>
                      {usd
                        ? `$${usd.toLocaleString('en', {
                            maximumFractionDigits: usd > 1000 ? 0 : 2,
                          })}`
                        : '...'}
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary mr-3">Market Cap:</span>
                      {economics.marketCap}
                    </div>
                  </div>
                </CardItem>

                <CardItem className="n3 lg title-bold" title="Economics" icon={faChartPie}>
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary mr-1">Circulating Supply:</span>
                      {economics.circulatingSupply}
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary mr-1">Total Staked:</span>
                      {economics.staked} ({economics.totalStakedPercent})
                    </div>
                  </div>
                </CardItem>

                <CardItem className="n3 lg title-bold" title="Usage" icon={faUsers}>
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary mr-3">Addresses:</span>
                      {stats.accounts}
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary mr-3">Transactions:</span>
                      {stats.transactions}
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
