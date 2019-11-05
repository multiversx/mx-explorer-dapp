import * as React from 'react';
import HeroHighlights from './HeroHighlights';
import LatestBlocks from './LatestBlocks';
import LatestTransactions from './LatestTransactions';
import { useGlobalState } from '../../context';

const TransactionDetails: React.FC = () => {
  const {
    activeTestnet: { name },
  } = useGlobalState();

  return (
    <div>
      <HeroHighlights />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-lg-5 mt-4 mb-4">
            <LatestBlocks />
          </div>
          <div className="col-lg-7 mt-4 mb-4">
            <LatestTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
