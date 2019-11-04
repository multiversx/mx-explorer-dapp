import * as React from 'react';
import { Highlights, TestnetLink } from './../../sharedComponents';

import { useGlobalState } from '../../context';

const TransactionDetails: React.FC = () => {
  const {
    activeTestnet: { name },
  } = useGlobalState();

  return (
    <>
      <Highlights />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">Pages</h4>
            <b>Home: {name}</b>
            <ul>
              <li>
                <h3>
                  <TestnetLink to="/blocks/page/1">Blocks</TestnetLink>
                </h3>
              </li>
              <li>
                <h3>
                  <TestnetLink to="/transactions/page/1">Transactions</TestnetLink>
                </h3>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionDetails;
