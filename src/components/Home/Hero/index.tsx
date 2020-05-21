import * as React from 'react';
import Leaflet from './Leaflet';

const HeroHighlights = () => (
  <div className="bg-black">
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 pl-0 pr-0">
          <div className="canvas">
            <Leaflet />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HeroHighlights;
