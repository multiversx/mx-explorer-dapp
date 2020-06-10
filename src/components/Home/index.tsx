import * as React from 'react';
import { useGlobalState } from 'context';
import Hero from './Hero';
import LatestBlocks from './LatestBlocks';
import LatestTransactions from './LatestTransactions';
import useSetValidatorsData from 'components/Validators/useSetValidatorsData';

const FetchValidatorsComponent = () => {
  const success = useSetValidatorsData();
  return success ? <></> : null;
};

const Home = () => {
  const [fetchValidators, setFetchValidators] = React.useState(true);
  const { brandData } = useGlobalState();

  React.useEffect(() => {
    setFetchValidators(false);
  }, []);

  return (
    <div>
      {fetchValidators && brandData.length === 0 && <FetchValidatorsComponent />}
      <Hero />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-lg-6 mt-4 mb-4">
            <LatestBlocks />
          </div>
          <div className="col-lg-6 mt-4 mb-4">
            <LatestTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
