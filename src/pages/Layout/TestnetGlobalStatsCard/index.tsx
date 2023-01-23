import * as React from 'react';
import BigNumber from 'bignumber.js';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faExchangeAlt } from '@fortawesome/pro-solid-svg-icons/faExchangeAlt';
import { faCube } from '@fortawesome/pro-solid-svg-icons/faCube';
import { faLayerGroup } from '@fortawesome/pro-solid-svg-icons/faLayerGroup';

import { EpochGear } from 'pages/Layout/GlobalStatsCard/EpochGear';
import { CardItem } from 'components';
import { useFetchStats } from 'helpers';

import { useSelector } from 'react-redux';
import { statsSelector } from 'redux/selectors';

export const TestnetGlobalStatsCard = () => {
  useFetchStats();
  const ref = React.useRef(null);

  const { statsFetched, shards, blocks, accounts, transactions } = useSelector(statsSelector);

  return (
    <div ref={ref} className="global-stats-card">
      <div className="row">
        <div className="col">
          <div className="card d-flex flex-column flex-lg-row flex-wrap py-4 px-3 px-lg-spacer">
            <div className="card-body p-0 d-flex flex-column flex-lg-row">
              <div className="d-flex align-items-center justify-content-center">
                <EpochGear showTime />
              </div>
              <div className="card-item-container w-100">
                <CardItem className="lg title-bold" title="Shards" icon={faLayerGroup}>
                  {statsFetched ? shards : '...'}
                </CardItem>

                <CardItem className="lg title-bold" title="Blocks" icon={faCube}>
                  <div data-testid="blocks">
                    {statsFetched ? new BigNumber(blocks).toFormat(0) : '...'}
                  </div>
                </CardItem>

                <CardItem className="lg title-bold" title="Accounts" icon={faUser}>
                  <div data-testid="accounts">
                    {statsFetched ? new BigNumber(accounts).toFormat(0) : '...'}
                  </div>
                </CardItem>

                <CardItem className="lg title-bold" title="Transactions" icon={faExchangeAlt}>
                  <div data-testid="transactions">
                    {statsFetched ? new BigNumber(transactions).toFormat(0) : '...'}
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
