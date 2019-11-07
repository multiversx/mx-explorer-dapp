import * as React from 'react';
import { Highlights, Search } from './../../../sharedComponents';
import Chart from './Chart';

const HeroHighlights: React.FC = () => {
  const [liveTps, setLiveTps] = React.useState(0);

  return (
    <div className="bg-blue">
      <div className="container pt-4 pb-4">
        <div className="row">
          <div className="col-lg-5 mt-4 mb-4">
            <Highlights hero setLiveTps={setLiveTps} />
          </div>
          <div className="col-lg-7 mt-4 mb-4">
            <span className="highlight-label d-block text-center mt-4 mb-3">
              LIVE TPS • LAST 3 MIN
            </span>
            <div className="canvas">
              <Chart liveTps={liveTps} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mb-3">
            <div className="form-search" role="search">
              <div className="input-group input-group-seamless">
                <Search />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroHighlights;
