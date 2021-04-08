import * as React from 'react';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faExchangeAlt } from '@fortawesome/pro-solid-svg-icons/faExchangeAlt';
import { faCube } from '@fortawesome/pro-solid-svg-icons/faCube';
import { faLayerGroup } from '@fortawesome/pro-solid-svg-icons/faLayerGroup';
import { useGlobalState } from 'context';
import EpochGear from 'components/Layout/GlobalStatsCard/EpochGear';
import { adapter, CardItem } from 'sharedComponents';

import { processStats } from 'helpers';
import { initialStats } from 'helpers/processStats';

const initialState = {
  ...initialStats,
};

const GlobalStatsCard = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();
  const { getStats } = adapter();
  const [data, setData] = React.useState(initialState);

  const getData = () => {
    if (ref.current !== null) {
      getStats().then((statsData) => {
        if (ref.current !== null) {
          setData({
            ...processStats(statsData),
          });
        }
      });
    }
  };
  React.useEffect(getData, [activeNetworkId]);

  return (
    <div ref={ref} className="global-stats-card">
      <div className="row">
        <div className="col">
          <div className="card d-flex flex-column flex-lg-row flex-wrap py-4 px-3 px-lg-spacer">
            <div className="card-body p-0 d-flex flex-column flex-lg-row">
              <div className="d-flex align-items-center justify-content-center">
                <EpochGear stats={data} />
              </div>
              <div className="card-item-container w-100">
                <CardItem className="lg title-bold" title="Shards" icon={faLayerGroup}>
                  {data.shards !== '...' ? parseInt(data.shards).toLocaleString('en') : data.shards}
                </CardItem>

                <CardItem className="lg title-bold" title="Blocks" icon={faCube}>
                  {data.blocks !== '...' ? parseInt(data.blocks).toLocaleString('en') : data.blocks}
                </CardItem>

                <CardItem className="lg title-bold" title="Accounts" icon={faUser}>
                  {data.accounts !== '...'
                    ? parseInt(data.accounts).toLocaleString('en')
                    : data.accounts}
                </CardItem>

                <CardItem className="lg title-bold" title="Transactions" icon={faExchangeAlt}>
                  {data.transactions !== '...'
                    ? parseInt(data.transactions).toLocaleString('en')
                    : data.transactions}
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
