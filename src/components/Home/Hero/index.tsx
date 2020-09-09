import * as React from 'react';
import { useGlobalState } from 'context';
import Leaflet from './Leaflet';

const HeroHighlights = () => {
  const { activeNetwork } = useGlobalState();
  const isMain = activeNetwork.name.toLocaleLowerCase() === 'mainnet';
  return isMain ? (
    <div className="bg-black">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 pl-0 pr-0">
            <div className="canvas">{process.env.NODE_ENV !== 'test' && <Leaflet />}</div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default HeroHighlights;
