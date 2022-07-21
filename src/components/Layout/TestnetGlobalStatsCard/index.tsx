import * as React from 'react';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faExchangeAlt } from '@fortawesome/pro-solid-svg-icons/faExchangeAlt';
import { faCube } from '@fortawesome/pro-solid-svg-icons/faCube';
import { faLayerGroup } from '@fortawesome/pro-solid-svg-icons/faLayerGroup';
import { useGlobalState } from 'context';
import EpochGear from 'components/Layout/GlobalStatsCard/EpochGear';
import { CardItem } from 'sharedComponents';

const TestnetGlobalStatsCard = () => {
  const ref = React.useRef(null);
  const { stats } = useGlobalState();

  return (
    <div ref={ref} className="global-stats-card">
      <div className="row">
        <div className="col">
          <div className="card d-flex flex-column flex-lg-row flex-wrap py-4 px-3 px-lg-spacer">
            <div className="card-body p-0 d-flex flex-column flex-lg-row">
              <div className="d-flex align-items-center justify-content-center">
                <EpochGear stats={stats} showTime />
              </div>
              <div className="card-item-container w-100">
                <CardItem className="lg title-bold" title="Shards" icon={faLayerGroup}>
                  {stats.shards}
                </CardItem>

                <CardItem className="lg title-bold" title="Blocks" icon={faCube}>
                  <div data-testid="blocks">{stats.blocks}</div>
                </CardItem>

                <CardItem className="lg title-bold" title="Accounts" icon={faUser}>
                  <div data-testid="accounts">{stats.accounts}</div>
                </CardItem>

                <CardItem className="lg title-bold" title="Transactions" icon={faExchangeAlt}>
                  <div data-testid="transactions">{stats.transactions}</div>
                </CardItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestnetGlobalStatsCard;
