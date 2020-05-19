import * as React from 'react';
import { Highlights, Search } from './../../../sharedComponents';
import Leaflet from './Leaflet';
// import Map from './Map';

const HeroHighlights: React.FC = () => {
  return (
    <>
      <div className="bg-black">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 pl-0 pr-0">
              <div className="canvas">
                <Leaflet />
              </div>
            </div>
            {/* <div className="canvas">{ChartJS}</div> */}
          </div>
          {/* <div className="row">
            <div className="col-12 mb-3">
              <div className="form-search" role="search">
                <div className="input-group input-group-seamless">
                  <Search />
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default HeroHighlights;
