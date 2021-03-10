import * as React from 'react';
import ValidatorsStatus from './ValidatorsStatus';
import NetworkHealth from './NetworkHealth';
import { LatestBlocks } from 'sharedComponents';
import LatestTransactions from './LatestTransactions';
import { useIsMainnet } from 'helpers';

const Home = () => {
  const isMainnet = useIsMainnet();

  return (
    <div className="home">
      <div className="container">
        <div className="row">
          <div className={`col-12  mt-spacer ${isMainnet ? 'col-lg-6' : ''}`}>
            <NetworkHealth />
          </div>
          {isMainnet && (
            <div className="col-12 col-lg-6 mt-spacer">
              <ValidatorsStatus />
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-12 mt-spacer">
            <LatestBlocks />
          </div>
          <div className="col-12 mt-spacer">
            <LatestTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
